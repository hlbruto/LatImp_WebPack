<template>
  <q-drawer
    v-model="leftDrawerOpen"
    class="my-class"
    behavior="desktop"
    bordered
    :width="300"
    :breakpoint="500"
  >
    <q-list dense>
      <q-item-label
        header
        class="text-black text-bold text-h5 row justify-between"
      >
        Videos
        <q-btn
          flat
          color="black"
          icon="mdi-arrow-left"
          label="Atrás"
          @click="leftDrawerOpen = false"
          v-if="$q.platform.is.mobile"
        />
      </q-item-label>
      <q-separator inset />

      <div v-for="c in categorias" :key="c.label">
        <q-item clickable @click="definirCategoria(c.label)">
          <q-item-section>
            <q-item-label>
              <b v-if="c.module != 0"> Módulo {{ c.module }}:</b> {{ c.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </q-drawer>
</template>

<script>
import { defineComponent, ref, computed, onUpdated } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const categorias = ref([
      { module: "0", label: "Todos los videos" },
      { module: "1", label: "Primeros pasos" },
      { module: "2", label: "Trabajando hacia el éxito" },
      { module: "3", label: "Redes Sociales" },
      { module: "4", label: "LLamadas de entrenamiento grabadas" },
    ]);

    const leftDrawerOpen = computed({
      get: () => store.state.example.leftDrawerOpen,
      set: (val) => {
        store.commit("example/setLeftDrawerOpen", val);
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

    onUpdated(() => {
      listarVideosSeccion();
    });

    const definirCategoria = (label) => {
      tipoVideo.value = label;
      leftDrawerOpen.value = false;
      listarVideosSeccion();
    };

    const listarVideosSeccion = () => {
      const list = ref([]);

      // obtener listado de videos a mostrar
      if (tipoVideo.value == "Todos los videos") {
        listadoVideos.value = listadoVideosTodos.value;
      } else {
        for (let index = 0; index < listadoVideosTodos.value.length; index++) {
          if (
            listadoVideosTodos.value[index].attributes.category ===
            tipoVideo.value
          ) {
            list.value.push(listadoVideosTodos.value[index]);
          }
        }
        listadoVideos.value = list.value;
      }
      router.push({ name: "videos" });
    };

    return {
      leftDrawerOpen,
      tipoVideo,
      listadoVideos,
      listadoVideosTodos,
      categorias,
      definirCategoria,
      listarVideosSeccion,
    };
  },
});
</script>

<style>
.my-class {
  background: linear-gradient(
    rgba(33, 63, 233, 0.699),
    transparent,
    rgba(34, 118, 243, 0.705),
    rgb(44, 9, 240)
  );
  color: black;
}
</style>
