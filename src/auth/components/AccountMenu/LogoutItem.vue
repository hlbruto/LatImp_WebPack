<script setup>
import useLogout from "auth/composables/useLogout";

const { loading, onLogoutClicked } = useLogout();
</script>

<template>
  <q-item clickable @click="onLogoutClicked">
    <q-item-section side>
      <q-icon size="xs" v-if="!loading" name="logout" />
      <q-spinner v-else size="xs" color="text-primary" />
    </q-item-section>
    <q-item-section> Salir </q-item-section>
  </q-item>
</template>
