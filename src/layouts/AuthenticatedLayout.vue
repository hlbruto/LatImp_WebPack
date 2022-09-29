<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-9" elevated>
      <q-toolbar>
        <q-btn
          round
          icon="mdi-movie-open-play-outline"
          aria-label="Menu"
          size="sm"
          @click="toggleLeftDrawer"
          v-if="$q.platform.is.mobile"
        />
        <q-btn
          round
          icon="mdi-movie-open-play-outline"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-else
        />

        <q-toolbar>
          <q-toolbar-title class="text-primary">
            <strong v-if="$q.platform.is.desktop">Latinos Imparables</strong>
            <small v-else>LatImpar</small>
          </q-toolbar-title>
        </q-toolbar>

        <ToggleDarkMode />

        <q-btn
          flat
          icon="mdi-home-outline"
          href="#/index"
          v-if="$q.platform.is.desktop"
          @click="leftDrawerOpen = false"
        />

        <q-btn
          flat
          icon="mdi-heart-outline"
          href="#/favoritos"
          v-if="$q.platform.is.desktop"
          @click="leftDrawerOpen = false"
        />

        <!-- <q-btn
          flat
          icon="mdi-movie-open-play-outline"
          href="#/videos"
          @click="tipoVideo = 'Todos los videos'"
          v-if="$q.platform.is.desktop"
        /> -->

        <q-btn
          flat
          icon="mdi-microphone-outline"
          href="#/podcast"
          v-if="$q.platform.is.desktop"
          @click="leftDrawerOpen = false"
        />

        <!-- <q-btn icon="search" flat v-if="$q.platform.is.desktop" /> -->

        <ButtonSettings v-if="roleUser == 'admin'" />

        <AuthAccountMenu />
      </q-toolbar>
    </q-header>

    <DrawerMenu />

    <q-footer
      class="bg-white text-grey-9 row justify-evenly"
      elevated
      v-if="$q.platform.is.mobile"
    >
      <q-btn
        flat
        icon="mdi-home-outline"
        href="#/index"
        @click="leftDrawerOpen = false"
      />

      <q-separator vertical inset />

      <q-btn
        flat
        icon="mdi-heart-outline"
        href="#/favoritos"
        @click="leftDrawerOpen = false"
      />

      <q-separator vertical inset />

      <!-- <q-btn flat icon="mdi-movie-open-play-outline" href="#/videos" />

      <q-separator vertical inset /> -->

      <q-btn
        flat
        icon="mdi-microphone-outline"
        href="#/podcast"
        @click="leftDrawerOpen = false"
      />
      <!-- <q-separator vertical inset />

      <q-btn flat icon="search" /> -->
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { getDefaultProvider } from "@vueauth/core";
import AuthAccountMenu from "src/auth/components/AccountMenu/AccountMenu.vue";
import ButtonSettings from "src/components/ButtonSettings.vue";
import ToggleDarkMode from "src/components/ToggleDarkMode.vue";
import DrawerMenu from "src/components/DrawerMenu.vue";
import { tipoVideo } from "../store/module-example/getters";

export default {
  components: {
    AuthAccountMenu,
    ToggleDarkMode,
    ButtonSettings,
    DrawerMenu,
  },

  setup() {
    const store = useStore();
    const $q = useQuasar();

    const leftDrawerOpen = computed({
      get: () => store.state.example.leftDrawerOpen,
      set: (val) => {
        store.commit("example/setLeftDrawerOpen", val);
      },
    });

    const roleUser = $q.localStorage.getItem("role");

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

    const toggleLeftDrawer = () => {
      tipoVideo.value = "Todos los videos";
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const authProvider = getDefaultProvider();
    const authProviderUpperFirst =
      authProvider.charAt(0).toUpperCase() + authProvider.slice(1);

    return {
      leftDrawerOpen,
      roleUser,
      tipoVideo,
      listadoVideosTodos,
      listadoVideos,
      authProvider,
      authProviderUpperFirst,
      toggleLeftDrawer,
    };
  },
};
</script>
