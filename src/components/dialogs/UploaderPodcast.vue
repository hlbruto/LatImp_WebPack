<template>
  <q-dialog v-model="dialogoUploaderPodcast">
    <q-uploader
      :factory="factoryUpload"
      label="Subir archivos de imágenes"
      accept=".jpg, image/*"
    >
      <template v-slot:list="scope">
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

    const authorization = computed({
      get: () => store.state.example.authorization,
      set: (val) => {
        store.commit("example/setAuthorization", val);
      },
    });

    const listadoPodcast = computed({
      get: () => store.state.example.listadoPodcast,
      set: (val) => {
        store.commit("example/setListadoPodcast", val);
      },
    });

    const dialogoUploaderPodcast = computed({
      get: () => store.state.example.dialogoUploaderPodcast,
      set: (val) => {
        store.commit("example/updateDialogUploaderPodcast", val);
      },
    });

    const factoryUpload = async (file) => {
      try {
        const fd = new FormData();
        fd.append("files", file[0]);
        await api.post(`/api/upload/`, fd, authorization.value).then((res) => {
          const a = {
            data: {
              name: file[0].name,
              url: api.defaults.baseURL + res.data[0].url,
              idUpload: res.data[0].id,
            },
          };
          api.post(`/api/podcasts`, a, authorization.value).then((res) => {
            $q.notify({
              type: "info",
              message: "Se agregó el archivo correctamente",
            });
            dialogoUploaderPodcast.value = false;
            listarPodcast();
          });
        });
      } catch (error) {
        $q.notify({
          type: "warning",
          message: "Ha ocurrido un error. Contacte al administrador.",
        });
      }
    };

    const listarPodcast = async () => {
      listadoPodcast.value = [];

      // recargar listado de podcast a mostrar
      try {
        await api.get(`/api/podcasts`, authorization.value).then((res) => {
          listadoPodcast.value = res.data.data;
        });
        router.push({ path: "/podcast" });
      } catch (error) {
        $q.notify({
          type: "warning",
          message: "Ha ocurrido un error. Contacte al administrador.",
        });
      }
    };

    return {
      authorization,
      listadoPodcast,
      dialogoUploaderPodcast,
      factoryUpload,
      listarPodcast,
    };
  },
});
</script>
