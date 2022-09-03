<template>
  <div class="container">
    <input
      :accept="accept"
      :multiple="multiple"
      @change="onSelectFile"
      type="file"
      class="input-upload"
    />

    <ul class="image-list">
      <li v-for="file in selectedFiles" :key="file.file_name" class="image-item">
        <img :src="file.path" :alt="file.file_name" />
        <div class="image-desc">
          <p>{{ file.file_name }}</p>
          <el-progress :percentage="file.percentage" />
        </div>
        <button class="image-btn" @click="removeImage(file.file_name)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { ref, onMounted } from 'vue';
import { validateImage } from '../utils';
import { uploadImageV3 } from '../services';

export default {
  props: {
    dataImages: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    accept: {
      type: String,
      default: '.jpg, .jpeg',
    },
  },
  setup(props) {
    const selectedFiles = ref([]);

    const onSelectFile = (event) => {
      const files = event.target.files;
      let file = null;
      if (files === null) return;

      for (let i = 0; i < files.length; i++) {
        (function (file) {
          let reader = new FileReader();
          file = files[i];
          if (validateImage(file)) {
            reader.onload = (e) => {
              let imgURI = e.target.result;
              if (imgURI) {
                selectedFiles.value.push({
                  file: file,
                  file_name: file.name,
                  path: imgURI,
                  percentage: 0,
                });
                uploadFiles(file.name);
              }
            };

            reader.readAsDataURL(files[i]);
          }
        })(file);
      }
    };

    const removeImage = (fileName) => {
      const index = selectedFiles.value.findIndex((item) => item.file_name === fileName);
      selectedFiles.value.splice(index, 1);
    };

    const uploadFiles = (fileName) => {
      selectedFiles.value.forEach((file) => {
        if (file.file_name === fileName) {
          file.percentage = 0;

          uploadImageV3(file.file, (event) => {
            file.percentage = Math.round((100 * event.loaded) / event.total);
          });
        }
      });
    };

    onMounted(() => {
      if (props.dataImages.length > 0) {
        selectedFiles.value = cloneDeep(props.dataImages);
      }
    });

    return {
      uploadFiles,
      onSelectFile,
      selectedFiles,
      removeImage,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 340px;
}

.image-list {
  margin-top: 20px;
  padding: 0;
}

.input-upload {
  border: 1px solid #d1d1d1;
  padding: 20px;
}

.image-list .image-item {
  display: flex;
  column-gap: 15px;
  align-items: center;
  margin-bottom: 15px;
}

.image-item > img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
}

.image-desc {
  width: 160px;
}

.image-desc p {
  word-break: break-all;
}

.image-btn {
  cursor: pointer;
  border-radius: 4px;
  outline: none;
  border: 0;
  padding: 7px 10px;
  transition: all 0.2s ease;
}

.image-btn:hover {
  background-color: lightblue;
}
</style>