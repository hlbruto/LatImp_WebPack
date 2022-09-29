<template>
  <div>
    <q-card class="my-card">
      <q-media-player
        background-color="black"
        big-play-button-color="teal-10"
        radius="4px"
        type="video"
        :ratio="16 / 9"
        :sources="video.sources"
      />

      <q-card-section class="text-caption row justify-between">
        <q-item-label class="col-8">{{ props.title }}</q-item-label>
        <q-checkbox
          v-model="val"
          checked-icon="mdi-heart"
          indeterminate-icon="help"
          color="primary"
          disable
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const val = ref(true);
const favoritos = ref(null);
const arrayAux = ref(null);

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  idVideo: {
    type: Number,
    default: 0,
  },
  idUpload: {
    type: Number,
    default: 0,
  },
});

const video = ref({
  sources: [
    {
      src: props.url,
      type: "video/mp4",
    },
  ],
});
</script>
