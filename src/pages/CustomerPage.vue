<template>
  <q-page padding class="q-pa-md flex-center">
    <q-toggle dense v-model="cardList" :val="cardList" :label="label" />

    <ClientCardTable v-if="cardList == false" />
    <ClientTable v-else />

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
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import { exportFile, useQuasar } from "quasar";
import ClientTable from "src/components/customers/ClientTable.vue";
import ClientCardTable from "src/components/customers/ClientCardTable.vue";

const columns = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "email",
    required: true,
    label: "Correo",
    align: "left",
    field: "email",
    sortable: true,
  },
  {
    name: "phone",
    required: true,
    label: "Teléfono",
    align: "left",
    field: "phone",
    sortable: true,
  },
  {
    name: "city",
    required: true,
    label: "Ciudad",
    align: "left",
    field: "city",
    sortable: true,
  },
  {
    name: "actions",
    required: true,
    label: "Editar",
    align: "left",
    field: "actions",
    sortable: false,
  },
];

const rows = [];

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export default {
  components: { ClientTable, ClientCardTable },

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
