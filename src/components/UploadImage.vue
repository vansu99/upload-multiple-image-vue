<template>
  <div>
    <div class="image-list" v-if="selectedFile.length > 0">
      <div class="image-content" :key="index" v-for="(item, index) in selectedFile">
        <div class="image">
          <img :src="item.url" :alt="item.name" />
        </div>
        <div class="image-desc">
          <span class="image-name">{{ item.name }}</span>
          <el-progress
            :percentage="item.percentage"
            :stroke-width="10"
            :show-text="false"
          />
        </div>
      </div>
    </div>

    <input
      class="input-file"
      type="file"
      accept="image/*"
      multiple
      @change="selectFile"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { uploadImage } from '../services';

export default {
  setup() {
    const selectedFile = ref([]);
    const progress = ref([]);
    const fileList = ref([]);

    async function selectFile(event) {
      selectedFile.value = await Promise.all(
        [...event.target.files]
          .map((item) => ({
            file: item,
          }))
          .concat([...selectedFile.value])
      );

      for (let i = 0; i < selectedFile.value.length; i++) {
        const urlImage = await getBase64(selectedFile.value[i].file);
        selectedFile.value[i].percentage = 0;

        uploadImage(selectedFile.value[i].file, (e) => {
          selectedFile.value[i].percentage = Math.round((100 * e.loaded) / e.total);
          selectedFile.value[i].url = urlImage;
          selectedFile.value[i].name = selectedFile.value[i].file.name;
        });
      }
    }

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    return {
      fileList,
      progress,
      selectFile,
      selectedFile,
    };
  },
};
</script>

<style scoped>
.progress {
  margin-bottom: 20px;
}

span {
  font-size: 17px;
  color: #fff;
}

.input-file {
  display: block;
  padding: 20px;
  border: 1px solid #2d2d2d;
  margin-bottom: 20px;
}

.image-list {
  margin: 10px 0;
}

.image-content {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}

.image-content .image-desc {
  margin-left: 10px;
  flex: 1;
}

.image-content .image-name {
  margin-bottom: 6px;
}

.image {
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 6px;
}

.image img {
  max-width: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
