import * as dotenv from 'dotenv';
import * as Joi from 'joi';

// Cargar .env
dotenv.config();

// Validación con Joi
const envSchema = Joi.object({
  // # App Environment
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().default(3000),
  // # DB Config
  DB_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),
  // # JWT Config
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required(),
  JWT_ROUNDS: Joi.string().required(),
  // # METABASE
  METABASE_SITE_URL: Joi.string().required(),
  METABASE_SECRET_KEY: Joi.string().required(),
}).unknown();

const { error, value: ev } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Error de configuración del entorno: ${error.message}`);
}

export const envConfig = {
  isDev: ev.NODE_ENV === 'development',
  port: ev.PORT,
};

export const dbConfig = {
  port: ev.DB_PORT,
  host: ev.DB_HOST,
  user: ev.DB_USERNAME,
  pass: ev.DB_PASSWORD,
  name: ev.DB_NAME,
};

export const jwtConfig = {
  secret: ev.JWT_SECRET,
  expires: ev.JWT_EXPIRES,
  rounds: ev.JWT_ROUNDS,
};

export const metabaseConfig = {
  url: ev.METABASE_SITE_URL,
  secret: ev.METABASE_SECRET_KEY,
};
