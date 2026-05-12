# Ad Creative Submission

Advertisers can submit creative at:

- `/advertise/campaigns`
- `/advertise/campaigns/[id]`
- `/advertise/campaigns/[id]/creative`

The MVP supports image URL, video URL, headline/title, text/social copy, target URL, alt text, and notes.

Target URLs must be valid `http` or `https` URLs. Unsafe URL schemes are rejected.

File upload can be added through Cloudflare R2 using the existing media storage patterns.
