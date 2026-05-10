# Railway CLI Optional

## Status

`railway --version` was checked locally and Railway CLI is not installed.

## Install Later

Use the Railway dashboard path as the primary deployment path for now. If you later want CLI deployment:

```bash
npm install -g @railway/cli
railway login
railway link
railway up
railway logs
```

Do not run `railway up` until the project, service, branch, and variables are intentionally selected.

## Variables

Prefer setting secrets in the Railway dashboard Variables tab for the first deployment. This avoids accidental shell history exposure.

