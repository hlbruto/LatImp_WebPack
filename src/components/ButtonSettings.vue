<template>
  <div>
    <q-btn icon="mdi-cogs" flat>
      <q-menu
        anchor="bottom right"
        self="top right"
        transition-show="flip-right"
        transition-hide="flip-left"
        auto-close
      >
        <q-list style="min-width: 100px">
          <q-item clickable @click="dialogoUploaderVideo = true">
            <q-item-section side>
              <q-icon size="xs" name="mdi-video-outline" />
            </q-item-section>
            <q-item-section>Videos</q-item-section>
          </q-item>
          <q-item clickable @click="dialogoUploaderPodcast = true">
            <q-item-section side>
              <q-icon size="xs" name="mdi-microphone-outline" />
            </q-item-section>
            <q-item-section>Podcast</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable to="/usuarios">
            <q-item-section side>
              <q-icon size="xs" name="mdi-account-plus-outline" />
            </q-item-section>
            <q-item-section>Distribuidores</q-item-section>
          </q-item>
          <q-item clickable to="/clientes">
            <q-item-section side>
              <q-icon size="xs" name="mdi-account-group-outline" />
            </q-item-section>
            <q-item-section>Clientes</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <DialogoUploaderVideo />
    <DialogoUploaderPodcast />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import AuthAccountMenu from "src/auth/components/AccountMenu/AccountMenu.vue";
import DialogoUploaderVideo from "src/components/dialogs/UploaderMedia";
import DialogoUploaderPodcast from "src/components/dialogs/UploaderPodcast";

const $q = useQuasar();
const store = useStore();
const router = useRouter();

const dialogoUploaderVideo = computed({
  get: () => store.state.example.dialogoUploaderVideo,
  set: (val) => {
    store.commit("example/updateDialogUploaderVideo", val);
  },
});

const dialogoUploaderPodcast = computed({
  get: () => store.state.example.dialogoUploaderPodcast,
  set: (val) => {
    store.commit("example/updateDialogUploaderPodcast", val);
  },
});
</script>
