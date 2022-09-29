<template>
  <q-page padding>
    <div v-if="listadoFav.length !== 0">
      <q-toolbar-title class="q-pa-md q-ml-md text-body1">
        Favoritos
      </q-toolbar-title>
      <q-separator inset />

      <div class="q-pa-sm q-pl-md q-mt-md row justify-start">
        <div
          v-for="v in listadoFav"
          :key="v"
          class="q-pa-sm q-pl-md row justify-center col-md-4 col-sm-6"
        >
          <VideoFavorito
            class="q-mr-md q-mb-md"
            v-bind:url="v.attributes.url"
            :title="v.attributes.name"
            :idVideo="v.id"
            :idUpload="v.attributes.idUpload"
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
            <div class="text-center text-h5">No hay Videos favoritos aún</div>
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
import { ref, defineComponent, onMounted, computed } from "vue";
import { useQuasar, QSpinnerGears } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import VideoFavorito from "components/VideoFavorito.vue";

export default defineComponent({
  components: { VideoFavorito },

  setup() {
    const store = useStore();
    const $q = useQuasar();

    const favoritos = ref(null);
    const arrayAux = ref(null);
    const listadoFav = ref([]);

    const authorization = computed({
      get: () => store.state.example.authorization,
      set: (val) => {
        store.commit("example/setAuthorization", val);
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
      listarFavoritos();
    });

    const listarFavoritos = async () => {
      favoritos.value = [];
      arrayAux.value = [];
      listadoFav.value = [];
      favoritos.value = $q.localStorage.getItem("favoritos");

      if (favoritos.value.length !== 0) {
        // obtener listado de videos a mostrar
        try {
          await api.get(`/api/videos`, authorization.value).then((res) => {
            arrayAux.value = res.data.data;
            for (let index = 0; index < arrayAux.value.length; index++) {
              for (let j = 0; j < favoritos.value.length; j++) {
                if (
                  arrayAux.value[index].attributes.url == favoritos.value[j].src
                ) {
                  arrayAux.value[index].attributes.esFav = true;
                  listadoFav.value.push(arrayAux.value[index]);
                }
              }
            }
            $q.loading.hide();
          });
        } catch (error) {
          $q.loading.hide();
          $q.notify({
            type: "warning",
            message: "Ha ocurrido un error. Contacte al administrador.",
          });
        }
      }
      $q.loading.hide();
    };

    return {
      authorization,
      arrayAux,
      favoritos,
      listadoFav,
      listarFavoritos,
    };
  },
});
</script>
