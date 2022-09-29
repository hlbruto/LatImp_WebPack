<template>
  <q-page>
    <div v-if="listadoPodcast.length !== 0">
      <q-toolbar-title class="q-pa-md q-ml-md text-body1">
        Podcast
      </q-toolbar-title>
      <q-separator inset />

      <div class="q-pa-sm q-pl-md q-mt-md row justify-start">
        <div v-for="p in listadoPodcast" :key="p.id">
          <q-card class="q-mr-md q-mb-md">
            <img :src="p.attributes.url" style="width: 100%; height: 250px" />

            <q-card-section class="text-caption row justify-between">
              <q-item-label class="col-9">{{ p.attributes.name }}</q-item-label>
              <q-btn
                class="col-1"
                flat
                round
                size="sm"
                color="negative"
                icon="delete"
                @click="confirmDelete(p.attributes.idUpload, p.id)"
                v-if="roleUser == 'admin'"
              />
            </q-card-section>
          </q-card>
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
            <div class="text-center text-h5">No hay Podcast aún</div>
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

<script setup>
import { ref, defineComponent, onMounted, computed } from "vue";
import { useQuasar, QSpinnerGears } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";

const store = useStore();
const $q = useQuasar();

const idUpload = ref("");
const idPodcast = ref("");

const roleUser = $q.localStorage.getItem("role");

const listadoPodcast = computed({
  get: () => store.state.example.listadoPodcast,
  set: (val) => {
    store.commit("example/setListadoPodcast", val);
  },
});

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
    message: "Cargando los podcast...",
  });
  listarPodcast();
});

const listarPodcast = async () => {
  //listadoPodcast.value = [];

  // recargar listado de podcast a mostrar
  try {
    await api.get(`/api/podcasts`, authorization.value).then((res) => {
      listadoPodcast.value = res.data.data;
      $q.loading.hide();
    });
  } catch (warning) {
    $q.loading.hide();

    $q.notify({
      type: "warning",
      message: "Ha ocurrido un error. Contacte al administrador.",
    });
  }
};

const confirmDelete = async (a, b) => {
  idUpload.value = a;
  idPodcast.value = b;

  $q.dialog({
    title: "Confirmación",
    message: "¿Desea eliminar el podcast?",
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
        message: "Cargando los podcast...",
      });
      deletePodcast();
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const deletePodcast = async () => {
  try {
    await api
      .delete(`/api/upload/files/` + idUpload.value, authorization.value)
      .then((res) => {
        api
          .delete(`/api/podcasts/` + idPodcast.value, authorization.value)
          .then((res) => {
            listarPodcast();
            $q.notify({
              type: "info",
              message: "Se eliminó el podcast correctamente",
            });
          });
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
