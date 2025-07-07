## This repo is for use with supabase edge functions
It is to act as a server side middleware to:
1) Transform garmin user data from garmin servers into supabase table format
2) Manage oauth flow

## Run dev server locally:
supabase start

supabase functions serve exchange-garmin-token --env-file=.env --no-verify-jwt

supabase stop

Note: Requires docker: https://docs.docker.com/desktop/setup/install/mac-install/

## Deploy to supabase
...?