# Owner Bootstrap

Set:

```txt
PLATFORM_OWNER_EMAIL=david@example.com
```

Then run after David's user exists in the database:

```bash
npm run role:bootstrap-owner
```

The script:

- finds the user by `PLATFORM_OWNER_EMAIL`
- assigns the `owner` role
- reactivates the owner role if it was revoked
- writes an `owner.bootstrap` audit log

It does not create fake users and does not store secrets.
