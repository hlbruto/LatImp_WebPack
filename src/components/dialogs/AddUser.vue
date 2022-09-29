<template>
  <div>
    <q-dialog v-model="dialog">
      <q-card>
        <q-toolbar class="row items-center q-pb-none">
          <q-toolbar-title> Adicionar Distribuidor </q-toolbar-title>

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
                (val) => !!val || 'Campo requerido',
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

        <q-card-actions align="right">
          <!-- <q-btn flat label="Cancelar" color="text-primary" v-close-popup /> -->
          <q-btn
            flat
            label="Guardar"
            color="primary"
            v-close-popup
            @click="validarDatos()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, defineComponent, onMounted, computed } from "vue";
import { exportFile, useQuasar } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";

const store = useStore();
const $q = useQuasar();

const idUsuario = ref("");
const id_user = ref("");
const activo = ref(true);
const nombre = ref("");
const email = ref("");
const contrasenna = ref("");
const isPwd = ref(false);
const data = ref({});

const roleUser = $q.localStorage.getItem("role");

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

const validarDatos = () => {
  // !PENDIENTE!!
  // OJO -- validar que el username tiene que ser mayor de 8 caracteres
  data.value.confirmed = true;
  const aux = email.value.split("@");
  data.value.username = aux[0];
  data.value.id_user = id_user.value;
  data.value.name = nombre.value;
  data.value.email = email.value;
  data.value.password = contrasenna.value;
  // adic usuario
  data.value.blocked = false;
  crearUser();
};

const crearUser = async () => {
  try {
    await api
      .post(`/api/users`, data.value, authorization.value)
      .then((res) => {
        $q.notify({
          type: "info",
          message: "El distribuidor se guardó correctamente.",
        });
        listarDistribuidores();
      });
  } catch (error) {
    $q.notify({
      type: "warning",
      message: "Ha ocurrido un error. Revise su conexión.",
    });
  }
};

const listarDistribuidores = async () => {
  const list = ref([]);
  const idUser = $q.localStorage.getItem("user");

  try {
    await api.get(`/api/users`, authorization.value).then((res) => {
      for (let index = 0; index < res.data.length; index++) {
        if (res.data[index].id !== idUser.id) {
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
</script>
