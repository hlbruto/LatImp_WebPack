<template>
  <div>
    <q-toggle
      v-model="darkMode"
      color="black"
      size="sm"
      checked-icon="mdi-weather-night"
      unchecked-icon="mdi-white-balance-sunny"
      v-if="$q.platform.is.desktop"
    />
    <q-toggle
      v-model="darkMode"
      color="black"
      size="xs"
      checked-icon="mdi-weather-night"
      unchecked-icon="mdi-white-balance-sunny"
      v-else
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const darkMode = ref(false);

    watch(darkMode, (darkMode) => {
      $q.dark.set(darkMode);
      $q.localStorage.set("darkMode", darkMode);
    });

    onMounted(() => {
      const darkModeIsActive = $q.localStorage.getItem("darkMode");
      if (darkModeIsActive) {
        darkMode.value = true;
      }
    });

    return { darkMode };
  },
});
</script>

<style></style>
