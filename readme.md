To run migrations:

- Create a `.env` file in packages/db with the following variables:

  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_DATABASE_ID`
  - `CLOUDFLARE_D1_TOKEN`

- Run `pn --filter @ebola/api db:migrate`

- Run api locally
  `pn --filter @ebola/api dev:remote --env production --test-scheduled`

TODO: Complete this readme
