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

const unprotectedPages = [PATH_AUTH.login, PATH_AUTH.register];

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
        // inject user profile into cookies
        const userId = session.user.id;
        const { data: user } = await supabase
          .from('profile')
          .select('*')
          .eq('id', userId)
          .single();
        url.pathname = `/_subdomains/${currentHost}${url.pathname}`;
        const response = NextResponse.rewrite(url);
        response.cookies.set('profile', JSON.stringify(user));
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
