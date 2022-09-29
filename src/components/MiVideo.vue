<template>
  <div>
    <q-card class="my-card">
      <!-- <q-media-player
        background-color="black"
        big-play-button-color="teal-10"
        type="video"
        radius="4px"
        :ratio="16 / 9"
        :autoplay="false"
        :sources="video.sources"
      /> -->

      <q-media-player
        background-color="black"
        big-play-button-color="teal-10"
        type="video"
        radius="4px"
        :ratio="16 / 9"
        :autoplay="false"
        :source="props.url"
      />

      <q-card-section class="text-caption row justify-between">
        <q-item-label class="col-8">{{ props.title }}</q-item-label>
        <q-checkbox
          v-model="val"
          checked-icon="mdi-heart"
          indeterminate-icon="help"
          color="primary"
          @click="quitarFavorito()"
          v-if="val === true"
        />
        <q-checkbox
          v-model="val"
          unchecked-icon="mdi-heart-outline"
          indeterminate-icon="help"
          color="primary"
          @click="ponerFavorito()"
          v-else
        />
        <q-btn
          class="col-1"
          flat
          round
          size="sm"
          color="negative"
          icon="delete"
          @click="confirmDelete()"
          v-if="roleUser == 'admin'"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar, QSpinnerGears } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";

const $q = useQuasar();
const store = useStore();

const data = ref({});

const val = ref(false);
const user = $q.localStorage.getItem("user");
const roleUser = $q.localStorage.getItem("role");
const favoritos = ref([]);
const idF = ref(0);
const position = ref(0);
const src = ref("");

const arrayAux = ref([]);

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
  esFav: {
    type: Boolean,
    default: false,
  },
});

const authorization = computed({
  get: () => store.state.example.authorization,
  set: (val) => {
    store.commit("example/setAuthorization", val);
  },
});

const tipoVideo = computed({
  get: () => store.state.example.tipoVideo,
  set: (val) => {
    store.commit("example/setTipoVideo", val);
  },
});

const listadoVideosTodos = computed({
  get: () => store.state.example.listadoVideosTodos,
  set: (val) => {
    store.commit("example/setListadoVideosTodos", val);
  },
});

const listadoVideos = computed({
  get: () => store.state.example.listadoVideos,
  set: (val) => {
    store.commit("example/setListadoVideos", val);
  },
});

/* const video = ref({
  sources: [
    {
      src: props.url,
      type: "video/mp4",
    },
  ],
}); */

onMounted(() => {
  const estaLogueado = $q.localStorage.getItem("jwt");
  if (estaLogueado !== undefined) {
    authorization.value = {
      headers: {
        Authorization: `Bearer ${estaLogueado}`,
      },
    };
  }
  if (props.esFav === true) {
    val.value = true;
  } else {
    val.value = false;
  }
});

const esFavorito = () => {
  $q.loading.show({
    spinner: QSpinnerGears,
    spinnerColor: "primary",
    messageColor: "black",
    backgroundColor: "blue",
    message: "Cargando los videos...",
  });
  if (val.value === true) {
    ponerFavorito();
  } else {
    quitarFavorito();
  }
};

const ponerFavorito = async () => {
  data.value.src = props.url;
  data.value.userid = user.id;
  data.value.user = user.id;
  const a = {
    data: data.value,
  };
  arrayAux.value = $q.localStorage.getItem("favoritos");
  try {
    await api.post(`/api/favoritos`, a, authorization.value).then((res) => {
      const video = {
        id: res.data.data.id,
        src: res.data.data.attributes.src,
        userid: res.data.data.attributes.userid,
      };
      arrayAux.value.push(video);
      favoritos.value = arrayAux.value;

      $q.localStorage.set("favoritos", favoritos.value);

      val.value = true;
      recargarListadoAdd();
    });
  } catch (error) {
    $q.notify({
      type: "warning",
      message: "Ha ocurrido un error. Contacte al administrador.",
    });
  }
};

const recargarListadoAdd = () => {
  favoritos.value = $q.localStorage.getItem("favoritos");
  const resArray = listadoVideos.value;
  for (let index = 0; index < resArray.length; index++) {
    resArray[index].attributes.esFav = false;

    if (favoritos.value.length !== 0) {
      for (let j = 0; j < favoritos.value.length; j++) {
        if (resArray[index].attributes.url == favoritos.value[j].src) {
          resArray[index].attributes.esFav = true;
        }
      }
    }
    arrayAux.value.push(resArray[index]);
  }
  listadoVideos.value = arrayAux.value;
  listadoVideosTodos.value = arrayAux.value;

  $q.loading.hide();
};

const quitarFavorito = async () => {
  arrayAux.value = $q.localStorage.getItem("favoritos");
  console.log("hey");

  for (let index = 0; index < arrayAux.value.length; index++) {
    if (arrayAux.value[index].src == props.url) {
      idF.value = arrayAux.value[index].id;
      src.value = arrayAux.value[index].src;
      position.value = index;
    }
  }
  try {
    await api
      .delete(`/api/favoritos/` + idF.value, authorization.value)
      .then((res) => {
        arrayAux.value.splice(position.value, 1);
        favoritos.value = arrayAux.value;

        $q.localStorage.set("favoritos", favoritos.value);
        listarVideos();
      });
  } catch (error) {
    $q.notify({
      type: "warning",
      message: "Ha ocurrido un error. Contacte al administrador.",
    });
  }
};

const confirmDelete = async () => {
  $q.dialog({
    title: "Confirmación",
    message: "¿Desea eliminar el video?",
    ok: {
      push: true,
      color: "negative",
    },
    cancel: {
      push: false,
      flat: true,
      color: "negative",
    },
    persistent: true,
  })
    .onOk(() => {
      $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: "primary",
        messageColor: "black",
        backgroundColor: "blue",
        message: "Cargando los videos...",
      });
      deleteVideo();
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const deleteVideo = async () => {
  try {
    await api
      .delete(`/api/upload/files/` + props.idUpload, authorization.value)
      .then((res) => {
        api
          .delete(`/api/videos/` + props.idVideo, authorization.value)
          .then((res) => {
            $q.notify({
              type: "info",
              message: "Se eliminó el video correctamente",
            });
            if (val.value == true) {
              quitarFavorito();
            } else {
              listarVideos();
            }
          });
      });
  } catch (error) {
    $q.notify({
      type: "warning",
      message: "Ha ocurrido un error. Contacte al administrador.",
    });
  }
};

const listarVideos = async () => {
  favoritos.value = [];
  favoritos.value = $q.localStorage.getItem("favoritos");

  // obtener listado de videos a mostrar
  try {
    await api.get(`/api/videos`, authorization.value).then((res) => {
      const resArray = res.data.data;
      arrayAux.value = [];
      for (let index = 0; index < resArray.length; index++) {
        resArray[index].attributes.esFav = false;

        if (favoritos.value.length !== 0) {
          for (let j = 0; j < favoritos.value.length; j++) {
            if (resArray[index].attributes.url == favoritos.value[j].src) {
              resArray[index].attributes.esFav = true;
            }
          }
        }
        arrayAux.value.push(resArray[index]);
      }
      listadoVideos.value = [];
      listadoVideos.value = arrayAux.value;
      listadoVideosTodos.value = arrayAux.value;

      $q.loading.hide();
    });
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "warning",
      message: "Ha ocurrido un error. Contacte al administrador.",
    });
  }
};
</script>

<style lang="scss">
.my-card:hover {
  background-color: rgb(208, 216, 233);
  //border-color: #4bb0d8;
  border-width: 1pt;
  max-width: 100%;
}
</style>
