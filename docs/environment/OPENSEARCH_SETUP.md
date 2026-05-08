# OpenSearch Setup

Audit date: 2026-05-08

Magento 2.4 requires Elasticsearch or OpenSearch. For this Windows/Laragon setup, local OpenSearch should run through Docker Desktop.

## Docker Status

Docker CLI is installed:

- Docker version: 27.4.0
- Docker Compose version: v2.31.0-desktop.2

Docker Desktop Linux engine is not currently running.

Observed error:

```text
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified
```

OpenSearch is not responding at `http://localhost:9200`.

## Local Compose File

The repository includes `docker-compose.opensearch.yml` for local development.

`docker compose -f docker-compose.opensearch.yml config` succeeds. Docker Compose warns that the top-level `version` attribute is obsolete in modern Compose, but the file is still valid.

Start Docker Desktop, then run:

```powershell
docker compose -f docker-compose.opensearch.yml up -d
```

Test:

```powershell
curl http://localhost:9200
```

or:

```powershell
Invoke-WebRequest http://localhost:9200 -UseBasicParsing
```

## Production Warning

The local compose file disables OpenSearch security for development convenience.

Do not use `plugins.security.disabled=true` in production.

Production OpenSearch must use authentication, TLS, network restrictions, monitoring, backups, and least-privilege access.
