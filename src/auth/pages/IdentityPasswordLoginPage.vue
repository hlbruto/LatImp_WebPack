<script setup>
import AuthLoginCard from "src/auth/components/LoginCard.vue";
</script>

<template>
  <div class="row justify-center" style="min-height: 100vh" padding>
    <div class="text-center">
      <img class="q-mt-lg q-mb-lg" src="logo.jpg" alt="logo" :width="250" />
      <!-- <h5 class="q-mb-md">Sign In</h5> -->
      <AuthLoginCard />
      <!-- <q-btn
        class="full-width q-mt-md"
        color="grey-6"
        label="olvidaste tu contraseña?"
        flat
        :to="{ name: 'auth.requestPasswordReset' }"
      /> -->
    </div>
  </div>
  <!-- <div class="absolute-top-right q-pa-md">
    <div>Necesitas una ?</div>
    <q-btn
      no-caps
      label="register"
      flat
      class="full-width"
      :to="{ name: 'auth.register' }"
    />
  </div> -->
</template>
