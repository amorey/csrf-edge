import type { NextRequest, NextResponse } from 'next/server';

import { Config } from './config';
import type { ConfigOptions } from './config';
import {
  createSecret,
  getTokenString,
  createToken,
  verifyToken,
  utoa,
  atou,
} from './util';

type CSRFMiddlewareFunction = {
  (request: NextRequest, response: NextResponse): Promise<Error | null>;
};

export function createMiddleware(opts?: Partial<ConfigOptions>): CSRFMiddlewareFunction {
  const config = new Config(opts || {});

  return async (request, response) => {
    // check excludePathPrefixes
    for (const pathPrefix of config.excludePathPrefixes) {
      if (request.nextUrl.pathname.startsWith(pathPrefix)) return null;
    }

    // get secret from cookies
    const secretStr = request.cookies.get(config.cookie.name)?.value;

    let secret: Uint8Array;

    // if secret is missing, create new secret and set cookie
    if (secretStr === undefined) {
      secret = createSecret(config.secretByteLength);
      const cookie = { ...config.cookie, value: utoa(secret) };
      response.cookies.set(cookie);
    } else {
      secret = atou(secretStr);
    }

    // verify token
    if (!config.ignoreMethods.includes(request.method)) {
      const tokenStr = await getTokenString(request, config.token.value);

      if (!await verifyToken(atou(tokenStr), secret)) {
        return new Error('csrf validation error');
      }
    }

    // create new token for response
    const newToken = await createToken(secret, config.saltByteLength);
    response.headers.set(config.token.responseHeader, utoa(newToken));

    return null;
  };
}
