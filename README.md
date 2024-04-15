# Edge-CSRF

Edge-CSRF is a CSRF protection library that runs on the [edge runtime](https://edge-runtime.vercel.app/).

This library implements the [signed double submit cookie pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended) using the crypto logic from [pillarjs/csrf](https://github.com/pillarjs/csrf) except it only uses edge runtime dependencies so it can be used in both node environments and in edge functions (e.g. [Vercel Edge Functions](https://vercel.com/docs/functions/runtimes/edge-runtime), [Cloudflare Page Functions](https://developers.cloudflare.com/pages/functions/)). It comes with easy-to-use integrations for Next.js and SvelteKit as well as a lower-level API for more custom implementations.

## Features

- Runs on both node and edge runtimes
- Includes a Next.js integration ([see here](src/nextjs))
- Includes a SvelteKit integration ([see here](src/sveltekit))
- Includes a low-level API for custom integrations ([see below](#api))
- Gets token from HTTP request header (`X-CSRF-Token`) or from request body field (`csrf_token`)
- Handles form-urlencoded, multipart/form-data or json-encoded HTTP request bodies
- Supports Server Actions via form and non-form submission
- Customizable cookie options

## Install

To use Edge-CSRF, just add it as a dependency to your app:

```console
npm install edge-csrf
# or
pnpm add edge-csrf
# or
yarn add edge-csrf
```

## Integrations

For details about each integration see:

* [Next.js README](src/nextjs)
* [SvelteKit README](src/sveltekit)

Here are some [examples](examples) in this repository:

| Framework                 | Implementation                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Next.js 13 (app router)   | [HTML form](examples/next13-approuter-html-submission)                                  |
| Next.js 13 (app router)   | [JavaScript (dynamic)](examples/next13-approuter-js-submission-dynamic)                 |
| Next.js 13 (app router)   | [JavaScript (static)](examples/next13-approuter-js-submission-static)                   |
| Next.js 13 (pages router) | [HTML form](examples/next13-pagesrouter-html-submmission)                               |
| Next.js 14 (app router)   | [HTML form](examples/next14-approuter-html-submission)                                  |
| Next.js 14 (app router)   | [JavaScript (dynamic)](examples/next14-approuter-js-submission-dynamic)                 |
| Next.js 14 (app router)   | [JavaScript (static)](examples/next14-approuter-js-submission-static)                   | 
| Next.js 14 (app router)   | [Sentry](examples/next14-approuter-sentry)                                              |
| Next.js 14 (app router)   | [Server action (form)](examples/next14-approuter-server-action-form-submission)         |
| Next.js 14 (app router)   | [Server action (non-form)](examples/next14-approuter-server-action-non-form-submission) |
| Next.js 14 (pages router) | [HTML form](examples/next14-pagesrouter-html-submission)                                |
| SvelteKit (vercel)        | [HTML form](examples/sveltekit-vercel)                                                  |
| SvelteKit (cloudflare)    | [HTML form](examples/sveltekit-cloudflare)                                              |

## API

```
createSecret(length) - Create new secret (cryptographically secure)

  * @param {int} length - Byte length of secret
  * @returns {Uint8Array} - The secret

createToken(secret, saltByteLength) - Create new CSRF token (cryptographically insecure salt hashed with secret)

  * @param {Uint8Array} secret - The secret
  * @param {int} saltByteLength - Salt length in number of bytes
  * @returns {Promise<Uint8Array>} - A promise returning the token in Uint8Array format

getTokenString(request) - Get the CSRF token from the request

  * @param {Request} request - The request object
  * @returns {Promise<string>} - A promise returning the token in string format

verifyToken(token, secret) - Verify CSRF token

  * @param {Uint8Array} token - The CSRF token
  * @param {Uint8Array} secret - The CSRF secret
  * @returns {Promise<boolean>} - A promise returning result of verification

utoa(input) - Encode Uint8Array as base64 string

  * @param {Uint8Array} input - The data to be converted from Uint8Array to base64
  * @returns {string} The base64 encoded string

atou(input) - Decode base64 string into Uint8Array

  * @param {string} input - The data to be converted from base64 to Uint8Array
  * @returns {Uint8Array} - The Uint8Array representing the input string
```

## Development

### Get the code

To develop edge-csrf, first clone the repository then install the dependencies:

```console
git clone git@github.com:kubetail-org/edge-csrf.git
cd edge-csrf
pnpm install
```

### Run the unit tests

Edge-CSRF uses jest for testing (via vitest). To run the tests in node, edge and miniflare environments, use the `test-all` command:

```console
pnpm test-all
```

The test files are colocated with the source code in the `src/` directory, with the filename format `{name}.test.ts`.

### Build for production

To build Edge-CSRF for production, run the `build` command:

```console
pnpm build
```

The production files will be located in the `dist/` directory.
