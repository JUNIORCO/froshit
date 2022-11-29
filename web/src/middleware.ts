import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { PATH_AUTH } from './routes/paths';

export const config = {
  matcher: ['/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)'],
};

// todo use supabase-js library instead of prisma as prisma is unsupported in the browser
function checkValidSubdomain(subdomain: string) {
  const validSubdomains = [
    'demo',
    'mcgill',
    'concordia',
    'uoft',
  ];
  return validSubdomains.includes(subdomain);
}

const unprotectedPages = [PATH_AUTH.login, PATH_AUTH.register, PATH_AUTH.resetPassword];

const hostIsSubdomain = (host: string) => host !== process.env.ROOT_DOMAIN;

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const hostname = req.headers.get('host') || process.env.ROOT_DOMAIN;
  if (!hostname) {
    throw Error('[Middleware] No hostname');
  }
  const currentHost = hostname.replace(`.${process.env.ROOT_DOMAIN}`, '');

  if (hostIsSubdomain(currentHost)) {
    if (checkValidSubdomain(currentHost)) {
      if (unprotectedPages.includes(url.pathname)) {
        url.pathname = `/_subdomains/${currentHost}${url.pathname}`;
      } else if (session?.user) {
        // inject user profile into header
        const userId = session.user.id;
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('id', userId)
          .single();

        if (!profile) {
          console.error(`[Middleware] No profile found for session ${userId}`);
          await supabase.auth.signOut();
          url.pathname = `${PATH_AUTH.login}`;
          return NextResponse.redirect(url);
        }

        // rewrite url to correct page
        url.pathname = `/_subdomains/${currentHost}${url.pathname}`;

        // clone the request headers and set a new header that has user profile
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('profile', JSON.stringify(profile));
        const response = NextResponse.rewrite(url, {
          request: {
            headers: requestHeaders,
          },
        });

        // set a new response header with the user profile
        response.headers.set('profile', JSON.stringify(profile));
        return response;
      } else {
        // User is not authenticated, redirect to login
        url.pathname = `/_subdomains/${currentHost}${PATH_AUTH.login}`;
      }
    } else {
      url.pathname = `/_subdomains/${currentHost}/404`;
    }
    return NextResponse.rewrite(url);
  }
}
