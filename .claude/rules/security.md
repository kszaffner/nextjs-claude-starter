---
description: Validation, auth, secrets, and server/client exposure rules.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Security

WHAT must be true.

## Input validation

- Validate all untrusted input at the boundary: Server Action arguments,
  route handler bodies, query/search params, headers. Never assume the
  client sent well-formed data, even if the UI only ever sends valid
  shapes.
- Re-validate on the server even when the client already validated —
  client-side validation is UX, not a security control.

## Authentication & authorization

- Authentication answers "who is this"; authorization answers "can they
  do this." Check both, separately, for every mutation and every access
  to non-public data.
- Authorization must be re-checked in the Server Action/route handler
  itself — never rely on a hidden button or disabled UI control as the
  only gate.

## Secrets & server-only code

- Secrets live in environment variables, never hardcoded, never sent to
  the client.
- Mark server-only modules (DB clients, secret-consuming code, internal
  API calls) with the `server-only` package so an accidental client import
  fails at build time instead of leaking at runtime.
- Anything exported from a module's public API (`index.ts`) can end up in
  a client bundle if a client component imports it — double-check what a
  module's `index.ts` actually exports.

## XSS

- Never use `dangerouslySetInnerHTML` with unsanitized input. If HTML
  must be rendered from untrusted content, sanitize it first with a
  vetted library.
- React escapes text content by default — don't defeat that by
  constructing HTML strings manually.

## CSRF

- Server Actions and route handlers that mutate state should not rely
  solely on cookie presence for trust when the request could be
  triggered cross-site; use the framework's built-in Server Action
  protections and same-site cookies where applicable.

## Sensitive data exposure

- Don't return more data from a server function than the caller needs
  (e.g. don't return a full user record when only `id` and `name` are
  used) — it's easy for extra fields to leak into a client component's
  props.
- Error messages returned to the client should not leak stack traces,
  internal identifiers, or query details.
