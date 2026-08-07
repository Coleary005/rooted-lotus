# Pointing the domain at the site

The site is hosted on GitHub Pages and is already live at
<https://coleary005.github.io/rooted-lotus/>. Everything below is about
swapping that URL for the real domain.

Replace `YOURDOMAIN.com` throughout with the actual domain.

There are two halves: DNS records the domain owner adds at their registrar,
and a setting on the GitHub side. **Do the DNS first** — GitHub checks the
records when the domain is saved, and saving too early just means redoing it.

---

## Part 1 — For the domain owner (at the registrar)

Log in wherever the domain was bought (GoDaddy, Namecheap, Squarespace,
Google Domains, etc.) and find the DNS settings. It's usually labelled
"DNS", "Manage DNS", "DNS Records", or "Advanced DNS".

Add these records. Leave anything unrelated (like MX records for email)
exactly as it is — removing those breaks email.

### Four A records

All four are needed. Same host, four different values:

| Type | Host / Name | Value           |
|------|-------------|-----------------|
| A    | `@`         | 185.199.108.153 |
| A    | `@`         | 185.199.109.153 |
| A    | `@`         | 185.199.110.153 |
| A    | `@`         | 185.199.111.153 |

`@` means the bare domain (`YOURDOMAIN.com`). Some registrars want the field
left blank instead, or want the full domain typed out — they all mean the
same thing.

### Four AAAA records (IPv6)

Optional but recommended — these serve visitors on IPv6 networks.

| Type | Host / Name | Value                 |
|------|-------------|-----------------------|
| AAAA | `@`         | 2606:50c0:8000::153   |
| AAAA | `@`         | 2606:50c0:8001::153   |
| AAAA | `@`         | 2606:50c0:8002::153   |
| AAAA | `@`         | 2606:50c0:8003::153   |

### One CNAME record for `www`

| Type  | Host / Name | Value                  |
|-------|-------------|------------------------|
| CNAME | `www`       | `coleary005.github.io` |

Note the value is `coleary005.github.io` with **no repository name on the
end**. This is the single most common thing to get wrong.

### Then wait

DNS changes take anywhere from a few minutes to a few hours to propagate.
Some registrars say up to 48 hours; in practice it's usually well under one.

---

## Part 2 — On the GitHub side (repo owner)

Once the DNS records are in and have had time to propagate:

1. Go to the repo → **Settings** → **Pages**.
2. Under **Custom domain**, enter `YOURDOMAIN.com` and click **Save**.
   - This automatically commits a `CNAME` file to the root of `master`.
     That file is what tells Pages which domain to answer for — don't
     delete it, and pull it down before making further local commits.
3. GitHub runs a DNS check. A green check means it worked. An error usually
   means the records haven't propagated yet — wait and hit save again.
4. **Enforce HTTPS** becomes available once the certificate is issued. This
   can take up to 24 hours. Tick it as soon as it's selectable.

Until that box is ticked the site is reachable over plain HTTP, which
browsers flag as "Not secure" — not a good look for a counseling practice,
so it's worth checking back the next day if it isn't available immediately.

---

## Verifying it worked

Once DNS has propagated and the custom domain is saved:

- `https://YOURDOMAIN.com` loads the site
- `https://www.YOURDOMAIN.com` also loads it (GitHub redirects one to the other)
- The padlock icon shows in the address bar with no warnings
- The contact form still submits — it posts to FormBackend directly, so the
  domain change doesn't affect it, but it's worth one live test afterward

To check DNS from a terminal before the site resolves:

```sh
dig YOURDOMAIN.com +short          # expect the four 185.199.x.153 addresses
dig www.YOURDOMAIN.com +short      # expect coleary005.github.io
```

---

## Things worth knowing

- **The repo is public.** GitHub Pages on a free account requires it. There's
  nothing sensitive in it — it's a static marketing site — but it does mean
  the source is viewable by anyone.
- **Deploys are automatic.** Any push to `master` rebuilds the live site
  within a minute or two. There's no separate deploy step.
- **Email is unaffected.** These records only control where the website
  points. If the domain has email set up, its MX records are separate and
  should be left alone.
