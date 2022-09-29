import { useQuasar } from "quasar";

export default function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (message) => {
    $q.notify({
      type: "positive",
      message: message || "Todo bien",
      icon: "warning",
    });
  };

  const notifyError = (message) => {
    $q.notify({
      type: "negative",
      message: message || "Fallido",
      icon: "warning",
    });
  };

  return {
    notifySuccess,
  };
}
