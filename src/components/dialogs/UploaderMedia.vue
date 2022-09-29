<template>
  <q-dialog v-model="dialogoUploaderVideo">
    <q-uploader
      :factory="factoryUpload"
      label="Subir video"
      accept=".mp4, .mpg"
    >
      <template v-slot:list="scope">
        <div class="q-pa-md" style="max-width: 300px">
          <div class="q-gutter-md">
            <q-select
              v-model="model"
              dense
              label="Módulo"
              :options="options"
              :rules="[(val) => !!val || 'Campo requerido']"
              lazy-rules
            />
          </div>
        </div>

        <q-list separator>
          <q-item v-for="file in scope.files" :key="file.__key">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>

              <q-item-label caption> Estado: {{ file.__status }} </q-item-label>

              <q-item-label caption>
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section>

            <q-item-section v-if="file.__img" thumbnail class="gt-xs">
              <img :src="file.__img.src" />
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-uploader>
  </q-dialog>
</template>

<script>
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import { computed, ref, defineComponent } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const $q = useQuasar();
    const router = useRouter();

    const model = ref("");
    const favoritos = ref(null);

    const arrayAux = ref([]);

    const options = ref([
      "Primeros pasos",
      "Trabajando hacia el éxito",
      "Redes Sociales",
      "LLamadas de entrenamiento grabadas",
    ]);

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

    const dialogoUploaderVideo = computed({
      get: () => store.state.example.dialogoUploaderVideo,
      set: (val) => {
        store.commit("example/updateDialogUploaderVideo", val);
      },
    });

    const factoryUpload = async (file) => {
      if (model.value != "") {
        try {
          const fd = new FormData();
          fd.append("files", file[0]);
          await api
            .post(`/api/upload/`, fd, authorization.value)
            .then((res) => {
              const a = {
                data: {
                  name: file[0].name,
                  category: model.value,
                  url: api.defaults.baseURL + res.data[0].url,
                  idUpload: res.data[0].id,
                },
              };
              api.post(`/api/videos`, a, authorization.value).then((res) => {
                $q.notify({
                  type: "info",
                  message: "Se agregó el video correctamente",
                });
                dialogoUploaderVideo.value = false;
                model.value = "";
                listarVideos();
              });
            });
        } catch (error) {
          $q.notify({
            type: "warning",
            message: "Ha ocurrido un error. Contacte al administrador.",
          });
        }
      } else {
        $q.notify({
          type: "warning",
          message: "Debe seleccionar un módulo",
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

    return {
      model,
      options,
      arrayAux,
      authorization,
      favoritos,
      tipoVideo,
      listadoVideosTodos,
      listadoVideos,
      dialogoUploaderVideo,
      factoryUpload,
      listarVideos,
    };
  },
});
</script>
