<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="row justify-center">
        <img
          alt="Latinos Imparables"
          src="/logo.jpg"
          style="width: 300px; height: 270px"
      /></q-card-section>

      <q-card-section
        class="row justify-center text-center"
        v-if="$q.platform.is.mobile"
      >
        <p>
          <b> Bienveni@ </b>
          a nuestra plataforma de entrenamiento. <br />
          Somos <strong class="text-primary"> Latinos Imparables</strong>, un
          equipo que, con tu esfuerzo y nuestros consejos, te ayudará a
          convertirte en una persona exitosa e imparable... Esfuérzate,
          supérate, trabaja; el sacrificio de hoy es el éxito de mañana!
        </p>
      </q-card-section>

      <q-card-section class="row justify-center text-center" v-else>
        <p>
          <b> Bienveni@ </b>
          a nuestra plataforma de entrenamiento. <br />
          Somos <strong class="text-primary"> Latinos Imparables</strong>, un
          equipo que, <br />
          con tu esfuerzo y nuestros consejos,
          <br />te ayudará a convertirte en una persona exitosa e imparable...
          <br />
          Esfuérzate, supérate, trabaja; el sacrificio de hoy es el éxito de
          mañana!
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";

const $q = useQuasar();
</script>
