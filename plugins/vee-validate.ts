// plugins/vee-validate.ts

import { defineRule, configure } from 'vee-validate';
import { required, email, min, confirmed } from '@vee-validate/rules';

export default defineNuxtPlugin(() => {
  // Define the validation rules globally
  defineRule('required', required);
  defineRule('email', email);
  defineRule('min', min);
  defineRule('confirmed', confirmed);

  // Configure the default error messages to be more user-friendly
  configure({
    generateMessage: (context) => {
      const messages: Record<string, string> = {
        required: `The ${context.field} field is required.`,
        email: `The ${context.field} field must be a valid email.`,
        min: `The ${context.field} field must be at least ${context.rule?.params?.[0]} characters.`,
        confirmed: `The ${context.field} field confirmation does not match.`,
      };

      const message = messages[context.rule?.name ?? '']
        ? messages[context.rule?.name ?? '']
        : `The ${context.field} field is invalid.`;

      return message;
    },
    // This allows VeeValidate to automatically bind to the v-model event
    validateOnInput: true,
  });
});