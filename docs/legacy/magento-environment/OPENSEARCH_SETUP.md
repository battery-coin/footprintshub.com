# OpenSearch Setup

Audit date: 2026-05-08

Magento 2.4 requires Elasticsearch or OpenSearch. For this Windows/Laragon setup, local OpenSearch should run through Docker Desktop.

## Docker Status

Docker CLI is installed:

- Docker version: 27.4.0
- Docker Compose version: v2.31.0-desktop.2

OpenSearch is now responding at `http://localhost:9200`.

Observed local version:

- OpenSearch 2.19.5

Container:

- `footprintshub-opensearch`

## Local Compose File

The repository includes `docker-compose.opensearch.yml` for local development.

`docker compose -f docker-compose.opensearch.yml config` succeeds. Docker Compose warns that the top-level `version` attribute is obsolete in modern Compose, but the file is still valid.

Start Docker Desktop if needed, then run:

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
