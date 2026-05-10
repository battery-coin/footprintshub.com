# Railway Config

## File

`railway.json`

## Current Config

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Notes

- No custom port is needed for this Next.js app.
- Railway should inject `PORT`; `next start` handles the platform port.
- Healthcheck does not require database connectivity.
- Use the Railway temporary domain first. Do not add a custom domain in this pass.

