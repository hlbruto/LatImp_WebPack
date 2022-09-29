<template>
  <q-page padding>
    <q-toggle
      class="q-mt-lg q-ml-md"
      dense
      v-model="cardList"
      :val="cardList"
      :label="label"
    />
    <UsersCardTable v-if="cardList == false" />

    <UsersTable v-else />

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

<script>
import { ref, defineComponent, onMounted, computed } from "vue";
import { exportFile, useQuasar } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import UsersTable from "src/components/users/UsersTable";
import UsersCardTable from "src/components/users/UsersCardTable";

export default {
  components: { UsersTable, UsersCardTable },

  setup() {
    const store = useStore();
    const $q = useQuasar();
    const cardList = ref(false);
    const label = ref("Listado");

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
    });

    return {
      cardList,
      label,
      authorization,
    };
  },
};
</script>
