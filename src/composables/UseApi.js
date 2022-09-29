import { useQuasar } from "quasar";
import { ref } from "vue";

const $q = useQuasar();

const authorization = ref(null);

export default function useApi() {
  const llenarToken = () => {
    const estaLogueado = $q.localStorage.getItem("jwt");
    if (estaLogueado !== undefined) {
      authorization.value = {
        headers: {
          Authorization: `Bearer ${estaLogueado}`,
        },
      };
    }
  };

  return {
    authorization,
    llenarToken,
  };
}
