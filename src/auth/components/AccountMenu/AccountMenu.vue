<script setup>
import AuthUpdatePasswordDialog from "src/auth/components/dialogs/UpdatePasswordDialog.vue";
import { ref } from "vue";
import { useQuasar } from "quasar";
import AuthChangePasswordItem from "src/auth/components/AccountMenu/ChangePasswordItem.vue";
import AuthLogoutItem from "src/auth/components/AccountMenu/LogoutItem.vue";

const showUpdatePasswordDialog = ref(false);
const $q = useQuasar();
const roleUser = $q.localStorage.getItem("role");
</script>

<template>
  <!-- <q-menu
    transition-show="flip-right"
    transition-hide="flip-left"
    auto-close
    v-if="roleUser == 'admin'"
  >
    <q-list dense>
      <AuthLogoutItem />
      <AuthChangePasswordItem @click="showUpdatePasswordDialog = true" />
    </q-list>
  </q-menu> -->

  <AuthLogoutItem dense />
  <AuthUpdatePasswordDialog v-model="showUpdatePasswordDialog" />
</template>
