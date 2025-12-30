import * as Joi from "joi";

const environmentSchema = Joi.object({
  environment: Joi.string()
    .valid("development", "production", "staging")
    .default("development"),
});

export default environmentSchema;
