<script setup>
import { QInput, QForm } from "quasar";

defineProps({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  validationErrors: {
    required: false,
    type: Object,
    default() {
      return {};
    },
  },
});

const isPwd = false;

const emit = defineEmits(["update:email", "update:password"]);
</script>

<template>
  <q-form>
    <slot name="top" />
    <q-input
      filled
      dense
      label="Correo electrónico"
      :model-value="email"
      :error="!!validationErrors?.['email']"
      :error-message="validationErrors?.['email']?.[0]"
      class="q-mb-md"
      hide-bottom-space
      @update:model-value="(value) => emit('update:email', value)"
    />
    <q-input
      filled
      dense
      :type="isPwd ? 'password' : 'text'"
      label="Contraseña"
      :model-value="password"
      :error="!!validationErrors?.['password']"
      :error-message="validationErrors?.['password']?.[0]"
      class="q-mb-sm"
      hide-bottom-space
      @update:model-value="(value) => emit('update:password', value)"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <slot name="bottom" />
  </q-form>
</template>
