<template>
  <div>
    <q-dialog v-model="dialogClient">
      <q-card>
        <q-toolbar class="row items-center q-pb-none">
          <q-toolbar-title>Adicionar Cliente </q-toolbar-title>

          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-md">
          <div class="q-gutter-md" style="max-width: 300px">
            <q-input
              v-model="id_client"
              type="number"
              label="ID"
              :rules="[
                (val) => !!val || 'Campo requerido',
                (val) => (val && val.length > 0) || 'Escribe algo',
              ]"
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
        </q-card-section>

        <q-card-actions align="right">
          <!-- <q-btn flat label="Cancelar" color="text-primary" v-close-popup /> -->
          <q-btn
            flat
            label="Guardar"
            color="primary"
            v-close-popup
            @click="comprobarDatos()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted, computed } from "vue";
import { exportFile, useQuasar } from "quasar";
import { useStore } from "vuex";
import { api } from "src/boot/axios";

export default defineComponent({
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const id = ref(null);
    const id_client = ref(null);
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

    const onMounted = () => {
      id_client.value = "";
      nombre.value = "";
      email.value = "";
      dialogClient = true;
    };

    const listarClientes = () => {
      api.get(`/api/clients`, authorization.value).then((res) => {
        listadoClientes.value = res.data.data.reverse();
      });
    };

    const comprobarDatos = () => {
      data.value.id_client = id_client.value;
      data.value.name = nombre.value;
      data.value.email = email.value;
      crearCliente();
    };

    const crearCliente = async () => {
      const a = {
        data: data.value,
      };
      console.log("a", a);
      console.log("a", a);
      try {
        await api.post(`/api/clients`, a, authorization.value).then((res) => {
          $q.notify({
            type: "info",
            message: "El cliente se guardó correctamente.",
          });
          listarClientes();
        });
      } catch (error) {
        $q.notify({
          type: "warning",
          icon: "warning",
          message: "Ha ocurrido un error. Revise su conexión.",
        });
      }
    };

    return {
      dialogClient,
      listadoClientes,
      id,
      id_client,
      nombre,
      email,
      data,
      authorization,
      listarClientes,
      comprobarDatos,
      crearCliente,
    };
  },
});
</script>
