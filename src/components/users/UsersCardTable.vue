<template>
  <div class="q-pa-md">
    <q-table
      v-model="selected"
      grid
      title="Distribuidores"
      hide-header
      :rows="listadoUsuarios"
      :columns="columns"
      row-key="name"
      :dense="$q.platform.is.mobile"
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
          @click="dialog = true"
        />
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 row justify-center"
        >
          <q-card class="my-card-user">
            <q-card-section>
              <q-item-label class="q-mb-sm">
                ID:
                <strong>{{ props.row.id_user }}</strong>
              </q-item-label>

              <q-separator />
              <q-list dense>
                <q-item
                  v-for="col in props.cols.filter((col) => col.name !== 'desc')"
                  :key="col.name"
                >
                  <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{ col.value }}</q-item-label>
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
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>

    <!-- Para adicionar  -->
    <DialogUser />

    <!-- Para editar  -->
    <q-dialog v-model="dialogo">
      <q-card>
        <q-toolbar class="row items-center q-pb-none">
          <q-toolbar-title>Editar Distribuidor </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-md">
          <div class="q-gutter-md" style="max-width: 300px">
            <q-input
              v-model="id_user"
              type="number"
              label="ID"
              :rules="[(val) => !!val || 'Campo requerido']"
              lazy-rules
            />
          </div>
          <div class="q-gutter-md" style="max-width: 300px">
            <q-input
              v-model="nombre"
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

          <div class="q-gutter-md" style="max-width: 300px">
            <q-input
              v-model="contrasenna"
              label="Contraseña"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                (val) =>
                  (val && val.length > 8) ||
                  'La contraseña debe ser mayor de 7 caracteres',
              ]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions align="between">
          <q-toggle size="sm" label="Activo" :val="activo" v-model="activo" />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            v-close-popup
            @click="editUser()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, defineComponent } from "vue";
import { exportFile, useQuasar } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import DialogUser from "src/components/dialogs/AddUser";

const columns = [
  {
    name: "activo",
    required: true,
    label: "Activo",
    align: "left",
    field: (row) => !row.blocked,
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
    label: "",
    align: "left",
    field: "email",
    sortable: true,
  },
];

const rows = [
  {
    username: "Frozen Yogurt1",
    name: "Frozen Yogurt",
    lastname: "Frozen Yogurt",
  },
  {
    username: "F2t",
    name: "Frozen Yogurt",
    lastname: "Frozen Yogurt",
  },
  {
    username: "3",
    name: "Frozen Yogurt",
    lastname: "Frozen Yogurt",
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
  components: { DialogUser },

  setup() {
    const $q = useQuasar();
    const store = useStore();
    const loading = ref(true);
    const filter = ref("");

    const selected = ref("");
    const distribuidores = ref([]);

    const dialogo = ref(false);
    const idUsuario = ref("");
    const id_user = ref("");
    const activo = ref(true);
    const nombre = ref("");
    const email = ref("");
    const contrasenna = ref("");
    const isPwd = ref(true);
    const data = ref({});

    const dialog = computed({
      get: () => store.state.example.dialog,
      set: (val) => {
        store.commit("example/updateDialogState", val);
      },
    });

    const listadoUsuarios = computed({
      get: () => store.state.example.listadoUsuarios,
      set: (val) => {
        store.commit("example/setListadoUsuarios", val);
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
      contrasenna.value = "";
      listarDistribuidores();
    });

    const listarDistribuidores = async () => {
      const list = ref([]);
      const idUser = $q.localStorage.getItem("user");
      try {
        await api.get(`/api/users`, authorization.value).then((res) => {
          loading.value = false;

          for (let index = 0; index < res.data.length; index++) {
            if (res.data[index].id !== idUser.id && res.data[index].id !== 2) {
              list.value.push(res.data[index]);
            }
          }
          listadoUsuarios.value = list.value.reverse();
        });
      } catch (error) {
        $q.notify({
          type: "warning",
          message: "Ha ocurrido un error. Contacte al administrador.",
        });
      }
    };

    const abrirDialogo = (usuario) => {
      idUsuario.value = usuario.id;
      if (usuario.blocked) {
        activo.value = false;
      } else {
        activo.value = true;
      }
      id_user.value = usuario.id_user;
      nombre.value = usuario.name;
      email.value = usuario.email;
      data.value.password = usuario.password;
      contrasenna.value = "";
      dialogo.value = true;
    };

    const editUser = () => {
      data.value.confirmed = true;
      data.value.id_user = id_user.value;
      data.value.name = nombre.value;
      data.value.email = email.value;
      if (contrasenna.value !== "") {
        data.value.password = contrasenna.value;
      }
      // modificar usuario
      if (activo.value) {
        data.value.blocked = false;
      } else {
        data.value.blocked = true;
      }
      factoryUpload();
    };

    const factoryUpload = async () => {
      try {
        await api
          .put(`/api/users/` + idUsuario.value, data.value, authorization.value)
          .then((res) => {
            $q.notify({
              type: "info",
              message: "El usuario se modificó correctamente.",
            });
            listarDistribuidores();
          });
      } catch (error) {
        $q.notify({
          type: "warning",
          message: "Ha ocurrido un error. Contacte al administrador.",
        });
      }
    };

    return {
      dialog,
      listadoUsuarios,
      authorization,
      loading,
      filter,
      columns,
      selected,
      distribuidores,

      //dialogo
      dialogo,
      idUsuario,
      id_user,
      activo,
      nombre,
      email,
      contrasenna,
      isPwd,
      data,

      listarDistribuidores,
      abrirDialogo,
      editUser,
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
            message: "No se pudo descargar el archivo...",
            color: "negative",
            icon: "warning",
          });
        }
      },
    };
  },
});
</script>

<style lang="sass" scoped>
.my-card-user
  width: 100%
  max-width: 250px
</style>
