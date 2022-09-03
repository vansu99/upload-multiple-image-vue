<template>
  <div>
    <!-- <div>
      <h1>Upload image v1</h1>
      <UploadImage />
    </div>
    <br />
    <div>
      <h1>Upload image v2</h1>
      <UploadImageV2
        :data-images="images"
        @upload-success="uploadImageSuccess"
        @before-remove="beforeRemove"
      />
    </div>
    <br /> -->
    <div>
      <h1>Upload image v3</h1>
      <UploadImageV3 :data-images="images" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { uploadImageV2 } from './services';
import UploadImage from './components/UploadImage.vue';
import UploadImageV2 from './components/UploadImageV2.vue';
import UploadImageV3 from './components/UploadImageV3.vue';

export default {
  components: {
    UploadImage,
    UploadImageV2,
    UploadImageV3,
  },
  setup() {
    const images = ref([
      {
        path: 'https://images.unsplash.com/photo-1661592999164-00b78d12220a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        file_name: 'testing.jpg',
        percentage: 100,
      },
    ]);

    // this is a function using v2
    async function uploadImageSuccess(file, currentIndexImage, filelist) {
      try {
        let formData = new FormData();
        formData.append('file', file);

        const response = await uploadImageV2(formData);
        console.log('upload success', response);
      } catch (error) {
        console.error(error);
      }
    }

    // this is a function using v2
    function beforeRemove(index, done, fileList) {
      const r = confirm('remove image');
      if (r === true) {
        done();
      }
    }

    return { images, beforeRemove, uploadImageSuccess };
  },
};
</script>

<style scoped>
h1 {
  color: #fff;
}
</style>
