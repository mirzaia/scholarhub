# Manual PostgreSQL credential rotation

Status: the exposed credential was removed from the local `.env` file. The code
and container configuration changes do not revoke it. **Provider-side rotation
and deployment verification remain pending.** Complete the steps below with an
account that can manage the affected database and deployments.

## 1. Identify affected consumers

Identify the Neon project, branch, database, and role used by ScholarHub. Use the
existing deployment settings or secret manager; the credential has been removed
from this workspace. List every application, CI job, local environment, and
preview deployment using this role. Have access to their settings before resetting
the password, since applications may fail until they receive the replacement.

Do not paste either credential into an issue, PR, chat, log, or shell command.

## 2. Reset the Neon password

Open the [Neon Console](https://console.neon.tech), select the affected project
and branch, then open **Postgres database > Roles**. In the affected role's menu,
choose **Reset password** and confirm. Open **Connect** to obtain the replacement
connection URL for the correct database and role. Store it in your secret manager.
Repeat for other affected Neon branches: resets apply to one branch at a time.

The previous password stops authenticating new connections immediately, so
complete the deployment updates promptly. See [Neon's password reset documentation](https://neon.com/docs/manage/roles#reset-a-password).

## 3. Update deployments and local development

For Vercel, open the ScholarHub project's environment variables and replace
`DATABASE_URL` in every affected environment (Production, Preview, Development,
and any branch overrides). Save, then redeploy each active deployment that needs
database access. Repeat for other projects sharing the credential. Existing
deployments retain their previous values; saving a variable alone is insufficient.
See [Vercel's rotation guide](https://vercel.com/docs/environment-variables/rotating-secrets).

For local development, inject the new `DATABASE_URL` through your secret manager
or a hidden terminal prompt. This example is for the workspace's zsh shell:

```zsh
read -rs 'DATABASE_URL?Paste the new database URL (hidden): '
print
export DATABASE_URL
npm run dev
# After stopping the development server:
unset DATABASE_URL
```

Leave `DATABASE_URL` empty in the repository's `.env`. Restart any other running
process that used the old environment. Preserve the provider's required TLS
settings when copying the replacement URL.

## 4. If you also use the local Docker PostgreSQL database

This step applies only if that separate database also needs password rotation.
Resetting Neon does not rotate a local Docker database.

For an existing volume, connect as the database administrator and use psql's
interactive password command. With the default Compose role and database:

```bash
docker compose exec db psql -U postgres -d scholarhub
```

Inside psql, enter `\password postgres`, supply the new password at the prompts,
then enter `\q`. Substitute your actual role and database if customized. Supply
the existing required Compose environment variables before invoking Compose.

Update the injected `POSTGRES_PASSWORD` and `DATABASE_URL` to match the new
password, using `db:5432` as the app's database host. URL-encode the password in
the URL. Recreate the containers with `docker compose up -d --force-recreate`.
Changing the environment alone does not change a password stored in an existing
database volume. Keep the volume and its application data.

## 5. Verify and close the incident

1. Open a new database connection using the replacement credential and run
   `SELECT 1;`. Confirm the expected database and role.
2. If the previous password is still available in an authorized secret store,
   try it on a fresh connection to the same endpoint and role. Enter it through
   a password prompt. Expect an authentication rejection; a timeout does not
   prove revocation. If unavailable, record that this direct check was not done.
3. Open the deployed scholarship catalog, university directory, and application
   tracker. Verify a normal application update persists after refresh. Check
   deployment logs for database authentication errors without logging the URL.
4. Review active database sessions with the database administrator. Password
   changes alone should not be treated as proof that existing sessions ended;
   investigate and terminate suspicious sessions through the provider's tools.
5. Re-run the secret scanner and remove stale copies from local secret files,
   logs, or build artifacts. Record the rotation time, affected role/branches,
   deployments updated, and verification outcome without recording passwords.

No schema migration, database reset, or data reseeding is required for this fix.
