import { z } from 'zod';

// Replace the plain Zod schema export with a Zod schema + Joi-compatible adapter.
const environmentZodSchema = z.object({
  environment: z
    .enum(['development', 'production', 'staging'])
    .default('development'),
  apiVersion: z.string().default('1.0'),
});

const environmentSchema = {
  // Mimic Joi's `validate` API used by ConfigModule
  validate(input: Record<string, unknown>) {
    const result = environmentZodSchema.safeParse(input);
    if (result.success) {
      return { value: result.data };
    }
    const message = result.error.issues
      .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
      .join('; ');
    return { error: new Error(message) };
  },
};

export default environmentSchema;
