<template>
  <div class="q-pa-md">
    <q-table
      v-model="selected"
      grid
      title="Clientes"
      hide-header
      :dense="$q.platform.is.mobile"
      :rows="listadoClientes"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :loading="loading"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
          style="width: 75px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="grey-8"
          icon="archive"
          flat
          round
          dense
          no-caps
          @click="exportTable()"
        />

        <q-btn
          flat
          round
          icon="person_add"
          color="white"
          text-color="primary"
          @click="dialogClient = true"
        />
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 row justify-center"
        >
          <q-card>
            <q-card-section>
              <q-item-label class="q-mb-sm">
                ID:
                <strong class="q-ml-md">{{
                  props.row.attributes.id_client
                }}</strong>
              </q-item-label>

              <q-separator />
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label>Nombre:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{ props.row.attributes.name }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>Email:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{
                      props.row.attributes.email
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                size="sm"
                color="primary"
                label="Editar"
                icon="edit"
                @click="abrirDialogo(props.row)"
            /></q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="dialogo">
      <q-card>
        <q-toolbar class="row items-center q-pb-none">
          <q-toolbar-title>Editar Cliente </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-md">
          <div class="q-gutter-md" style="max-width: 300px">
            <q-input
              v-model="id_client"
              type="number"
              label="ID"
              :rules="[(val) => !!val || 'Campo requerido']"
              lazy-rules
            />
          </div>
          <div class="q-gutter-md" style="max-width: 300px">
            <q-input
              v-model="nombre"
              type="text"
              label="Nombre"
              :rules="[
                (val) => !!val || 'Campo requerido',
                (val) => (val && val.length > 0) || 'Escribe algo',
              ]"
              lazy-rules
            />
          </div>

          <div class="q-gutter-md" style="max-width: 300px">
            <q-input
              v-model="email"
              type="email"
              label="Email"
              :rules="[
                (val) => !!val || 'Campo requerido',
                (val) =>
                  (val && val.length > 8) ||
                  'El nombre de usuario debe ser mayor de 7 caracteres',
                (val) => /.+@.+\..+/.test(val) || 'El correo debe ser válido',
              ]"
              lazy-rules
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <!-- <q-btn flat label="Cancelar" color="text-primary" v-close-popup /> -->
          <q-btn
            flat
            label="Guardar"
            color="primary"
            v-close-popup
            @click="editClient()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <DialogClient />
  </div>
</template>

<script>
import { ref, computed, onMounted, defineComponent } from "vue";
import { exportFile, useQuasar } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import DialogClient from "src/components/dialogs/AddClient";

const columns = [
  {
    name: "id_client",
    required: true,
    label: "ID",
    align: "left",
    field: (row) => row.id_client,
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
    name: "actions",
    required: true,
    label: "Editar",
    align: "left",
    field: "actions",
    sortable: false,
  },
];

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

export default defineComponent({
  components: { DialogClient },

  setup() {
    const $q = useQuasar();
    const store = useStore();
    const loading = ref(true);
    const filter = ref("");

    const selected = ref("");
    const clientes = ref([]);

    const dialogo = ref(false);
    const id = ref("");
    const id_client = ref("");
    const nombre = ref("");
    const email = ref("");
    const data = ref({});

    const dialogClient = computed({
      get: () => store.state.example.dialogClient,
      set: (val) => {
        store.commit("example/updatedialogClientState", val);
      },
    });

    const listadoClientes = computed({
      get: () => store.state.example.listadoClientes,
      set: (val) => {
        store.commit("example/setListadoClientes", val);
      },
    });

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
      listarClientes();
    });

    const listarClientes = () => {
      api.get(`/api/clients`, authorization.value).then((res) => {
        listadoClientes.value = res.data.data.reverse();
        loading.value = false;
      });
    };

    const abrirDialogo = (usuario) => {
      data.value.id = usuario.id;
      id_client.value = usuario.attributes.id_client;
      nombre.value = usuario.attributes.name;
      email.value = usuario.attributes.email;
      dialogo.value = true;
    };

    const editClient = () => {
      data.value.id_client = id_client.value;
      data.value.name = nombre.value;
      data.value.email = email.value;
      factoryUpload();
    };

    const factoryUpload = async () => {
      const a = {
        data: data.value,
      };
      try {
        await api
          .put(`/api/clients/` + data.value.id, a, authorization.value)
          .then((res) => {
            $q.notify({
              type: "info",
              message: "El usuario se modificó correctamente.",
            });
            listarClientes();
          });
      } catch (error) {
        $q.notify({
          type: "warning",
          message: "Ha ocurrido un error. Contacte al administrador.",
        });
      }
    };

    return {
      loading,
      dialogClient,
      listadoClientes,
      authorization,
      filter,
      columns,
      selected,
      clientes,

      //dialogo
      dialogo,
      id,
      id_client,
      nombre,
      email,
      data,

      listarClientes,
      abrirDialogo,
      editClient,
      factoryUpload,

      exportTable() {
        // naive encoding to csv format
        const content = [columns.map((col) => wrapCsvValue(col.label))]
          .concat(
            rows.map((row) =>
              columns
                .map((col) =>
                  wrapCsvValue(
                    typeof col.field === "function"
                      ? col.field(row)
                      : row[col.field === void 0 ? col.name : col.field],
                    col.format,
                    row
                  )
                )
                .join(",")
            )
          )
          .join("\r\n");

        const status = exportFile("table-export.csv", content, "text/csv");

        if (status !== true) {
          $q.notify({
            message: "Browser denied file download...",
            color: "negative",
            icon: "warning",
          });
        }
      },
    };
  },
});
</script>
