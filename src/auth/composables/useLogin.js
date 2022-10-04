import { useRouter } from "vue-router";
import { useIdentityPasswordLogin, useAuthState } from "@vueauth/core";
import { api } from "src/boot/axios";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { computed } from "vue";

export default () => {
  const router = useRouter();
  const $q = useQuasar();
  const store = useStore();

  const {
    form,
    loading,
    errors,
    hasErrors,
    validationErrors,
    hasValidationErrors,
    login,
    isReauthenticating,
    resetForm,
    resetErrors,
  } = useIdentityPasswordLogin();

  const { user } = useAuthState();

  const authorization = computed({
    get: () => store.state.example.authorization,
    set: (val) => {
      store.commit("example/setAuthorization", val);
    },
  });

  async function onLoginClicked() {
    resetErrors();
    await login();
    if (!hasErrors.value) {
      autenticarConToken();
      // router.push({name: 'videos'})
    }
  }

  async function autenticarConToken() {
    const { data } = await api.post("/api/auth/local", {
      identifier: form.value.email,
      password: form.value.password,
    });

    $q.localStorage.set("jwt", data.jwt); //para guardar el token

    authorization.value = {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    };

    llenarDatosUser();
  }

  function onForgotPasswordClicked() {
    router.push({ name: "auth.requestPasswordReset" });
  }

  async function llenarDatosUser() {
    await api
      .get(`/api/users/me?populate=*`, authorization.value)
      .then((res) => {
        $q.localStorage.set("favoritos", res.data.favoritos);
        $q.localStorage.set("user", res.data);
        $q.localStorage.set("role", res.data.role.name);
        $q.localStorage.set("favoritos", res.data.favoritos);

        console.log(res.data);
      });
    router.push({ name: "index" });
  }

  /**
   * For some auth providers reauthentication requires an email address.
   * This function prefills the email if possible,
   * thus saving the user from typing it in
   */
  function attemptSetEmailOnForm() {
    if (typeof form.value.email === "string" && user.value?.email) {
      form.value.email = user.value.email;
    }
  }

  return {
    authorization,
    onLoginClicked,
    onForgotPasswordClicked,
    form,
    loading,
    errors,
    hasErrors,
    validationErrors,
    hasValidationErrors,
    login,
    resetForm,
    isReauthenticating,
    attemptSetEmailOnForm,
    autenticarConToken,
    llenarDatosUser,
  };
};
