import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)'],
};

function checkValidSubdomain(subdomain: string) {
  const validSubdomains = [
    'demo',
    'mcgill',
    'concordia',
    'uoft',
  ];
  return validSubdomains.includes(subdomain);
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || process.env.ROOT_DOMAIN;

  if (!hostname) {
    throw Error('Middleware -> No hostname');
  }

  const currentHost = hostname.replace(`.${process.env.ROOT_DOMAIN}`, '');

  if (currentHost !== process.env.ROOT_DOMAIN) {
    // const isValid = await checkValidSubdomain(currentHost);
    if (checkValidSubdomain(currentHost)) {
      url.pathname = `/_subdomains/${currentHost}${url.pathname}`;
    } else {
      url.pathname = `/_subdomains/${currentHost}/404`;
    }
  }

  return NextResponse.rewrite(url);
}
