<template>
  <q-page padding>
    <div v-if="listadoVideos.length !== 0">
      <q-toolbar-title class="q-pa-md q-ml-md text-body1">
        {{ tipoVideo }}
      </q-toolbar-title>
      <q-separator inset />

      <div class="q-pa-sm q-pl-md q-mt-md row justify-start">
        <div
          v-for="v in listadoVideos"
          :key="v"
          class="q-pa-sm q-pl-md row justify-center col-md-4 col-sm-6"
        >
          <MiVideo
            class="q-mr-md q-mb-md"
            v-bind:url="v.attributes.url"
            :title="v.attributes.name"
            :idVideo="v.id"
            :idUpload="v.attributes.idUpload"
            :esFav="v.attributes.esFav"
          />
        </div>
      </div>
    </div>

    <div v-else>
      <q-card flat>
        <q-card-section class="row justify-center">
          <img
            alt="Latinos Imparables"
            src="/logo.jpg"
            style="width: 300px; height: 270px; opacity: 0.4"
          />

          <div class="absolute-center">
            <q-icon name="mdi-cogs" size="100px" />
            <div class="text-center text-h5">No hay Videos aún</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- place QPageScroller at end of page -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="grey-9" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted, onUpdated, computed } from "vue";
import { useQuasar, QSpinnerGears } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import MiVideo from "components/MiVideo.vue";

export default defineComponent({
  components: { MiVideo },

  setup() {
    const store = useStore();
    const $q = useQuasar();

    const favoritos = ref([]);
    const arrayAux = ref([]);

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

    onMounted(() => {
      const estaLogueado = $q.localStorage.getItem("jwt");
      if (estaLogueado !== undefined) {
        authorization.value = {
          headers: {
            Authorization: `Bearer ${estaLogueado}`,
          },
        };
      }
      $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: "primary",
        messageColor: "black",
        backgroundColor: "blue",
        message: "Cargando los videos...",
      });
      listarVideos();
    });

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

    return {
      authorization,
      arrayAux,
      favoritos,
      tipoVideo,
      listadoVideosTodos,
      listadoVideos,
      listarVideos,
    };
  },
});
</script>
