import { config } from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  config({ path: `${process.cwd()}/src/config/env/.env-test` });
} else {
  config({ path: `${process.cwd()}/.env` });
}

export default () => ({
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3100'),
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  defaultPaginationLimit: process.env.PAGINATION_DEFAULT_LIMIT || 15,
  sql_logging: !(process.env.SQL_LOGGING === 'false'),
  keycloak: {
    url: process.env.KEYCLOAK_URL,
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET,
  },
});
