
type GetSubdomainArgs = {
  subdomain: string;
  path: string;
}
export const getSubdomainUrl = ({ subdomain, path }: GetSubdomainArgs) => `https://${subdomain}.froshit.com${path}`;

export const getFroshitUrl = 'https://froshit.com';
