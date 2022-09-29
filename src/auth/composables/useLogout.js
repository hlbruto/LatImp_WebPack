import { useIdentityPasswordLogout } from "@vueauth/core";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default () => {
  const router = useRouter();
  const $q = useQuasar();

  const { logout, loading } = useIdentityPasswordLogout();

  async function onLogoutClicked() {
    await logout();

    // Eliminar todas las claves
    $q.localStorage.clear();

    router.push("/");
  }

  return { logout, loading, onLogoutClicked };
};
