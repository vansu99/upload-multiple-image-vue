<template>
  <div class="image-upload-v2">
    <input
      type="file"
      ref="idUpload"
      multiple
      accept="images/*"
      @change="uploadFieldChange"
    />

    <div v-if="images.length > 0" class="image-list">
      <div class="image-item" v-for="(image, index) in images" :key="index">
        <img :src="image.path" :alt="image.name" />
        <div class="image-desc">
          <span>{{ image.name }}</span>
          <el-progress
            :percentage="image.percentage"
            :stroke-width="10"
            :show-text="false"
          />
        </div>
        <button @click.prevent="deleteImage(index)" class="btn-remove">Remove</button>
      </div>
    </div>
  </div>
</template>

<script>
//import ImageTools from '../utils/resizeImage';
import { onMounted, ref, watch } from 'vue';
import { cloneDeep, forEach } from 'lodash-es';

export default {
  props: {
    dataImages: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // const imageTools = new ImageTools();
    const currentIndexImage = ref(0);
    const images = ref([]);
    const idUpload = ref(null);
    const progressUpload = ref(0);

    watch(
      () => props.dataImages,
      (val) => {
        console.log({ val });
        images.value = cloneDeep(val);
      },
      { deep: true }
    );

    const createImage = (file) => {
      let reader = new FileReader();

      reader.onload = (e) => {
        let dataURI = e.target.result;
        if (dataURI) {
          if (!images.value.length) {
            images.value.push({
              name: file.name,
              path: dataURI,
            });

            images.value[images.value.length - 1].percentage = 0;

            for (let i = 0; i < 100; i++) {
              images.value[images.value.length - 1].percentage += 1;
            }

            currentIndexImage.value = 0;
          } else {
            images.value.push({
              name: file.name,
              path: dataURI,
            });
            images.value[images.value.length - 1].percentage = 0;

            for (let i = 0; i < 100; i++) {
              images.value[images.value.length - 1].percentage += 1;
            }
          }

          // call api
          emit('upload-success', file, images.value.length - 1, images.value);
        }
      };
      reader.readAsDataURL(file);
    };

    const uploadFieldChange = (e) => {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return false;
      }

      forEach(files, (value, index) => {
        createImage(value);
      });
      if (document.getElementById(idUpload)) {
        document.getElementById(idUpload).value = [];
      }
    };

    const deleteImage = (currentIndex) => {
      emit(
        'before-remove',
        currentIndex,
        () => {
          images.value.splice(currentIndex, 1);
          currentIndexImage.value = 0;
          if (images.length) {
            images.value[0].highlight = 1;
          }
        },
        images.value
      );
    };

    onMounted(() => {
      images.value = cloneDeep(props.dataImages);
    });

    return { uploadFieldChange, deleteImage, progressUpload, images };
  },
};
</script>

<style scoped>
.image-upload-v2 {
  max-width: 400px;
  width: 100%;
  margin-top: 20px;
}

.image-upload-v2 input {
  border: 1px solid #d1d1d1;
  padding: 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.image-item {
  cursor: pointer;
  display: flex;
  column-gap: 15px;
  align-items: center;
}

.image-item > img {
  display: block;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
  object-fit: cover;
}

.image-item .image-desc {
  min-width: 140px;
}

.image-item .image-desc span {
  display: block;
  color: #fff;
  font-size: 15px;
  margin-bottom: 5px;
}

.image-item .btn-remove {
  outline: none;
  padding: 6px 10px;
  background-color: #fff;
  color: #000;
  font-size: 14px;
  text-align: center;
  border: 0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-item .btn-remove:hover {
  background-color: lightblue;
}
</style>
