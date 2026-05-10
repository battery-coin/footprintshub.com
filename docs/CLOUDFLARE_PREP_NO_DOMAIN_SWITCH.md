# Cloudflare Prep Without Domain Switch

## Goal

Prepare Cloudflare without changing SiteGround nameservers and without connecting the real FootprintsHub domain to Railway yet.

## Baby Steps

1. Create or log into Cloudflare.
2. Add site `footprintshub.com`.
3. Let Cloudflare scan current DNS records from SiteGround.
4. Review records only.
5. Confirm Cloudflare sees current records:
   - root record
   - `www`
   - MX records if email exists
   - TXT/SPF/DKIM/DMARC records if email exists
   - future Resend records if used
6. Do not change nameservers yet.
7. Do not activate Cloudflare yet.
8. Stop until the Railway temporary URL passes testing.

## Later

After the Railway temporary URL works:

1. Add the Railway custom domain.
2. Copy Railway CNAME/TXT verification records.
3. Add those records in Cloudflare.
4. Switch nameservers only when ready.
5. Add a redirect rule from `footprintshub.com` to `https://www.footprintshub.com` if desired.

