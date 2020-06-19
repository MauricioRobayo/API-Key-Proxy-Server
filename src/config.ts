import { Options } from 'http-proxy-middleware';

export interface Proxy extends Options {
  route: string;
  allowedMethods: string[];
  queryparams?: {};
  allowedDomains?: string[];
}

export interface Config {
  allowedDomains: string[];
  proxies: Proxy[];
}

const config: Config = {
  allowedDomains:
    process.env.NODE_ENV === 'development'
      ? ['http://localhost:8080']
      : ['https://www.mauriciorobayo.com'],
  proxies: [
    {
      route: '/weather',
      allowedMethods: ['GET'],
      target: 'https://api.openweathermap.org/data/2.5/weather',
      queryparams: {
        appid: process.env.WEATHER_API_KEY,
      },
    },
    {
      route: '/ipinfo',
      allowedMethods: ['GET'],
      target: 'https://ipinfo.io/',
      queryparams: {
        token: process.env.IPINFO_TOKEN,
      },
    },
    {
      route: '/github',
      allowedMethods: ['GET'],
      target: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Token ${process.env.GITHUB_TOKEN}`,
      },
    },
  ],
};

export default config;
