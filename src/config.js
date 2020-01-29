module.exports = {
  proxies: [
    {
      allowedDomains:
        process.env.NODE_ENV === 'production'
          ? ['https://www.mauriciorobayo.com']
          : ['http://localhost:8080'],
      route: '/weather',
      target: 'https://api.openweathermap.org/data/2.5/weather',
      allowedMethods: ['GET'],
      queryparams: {
        appid: process.env.WEATHER_API_KEY,
      },
    },
    {
      allowedDomains:
        process.env.NODE_ENV === 'production'
          ? ['https://www.mauriciorobayo.com']
          : ['http://localhost:8080'],
      route: '/ipinfo',
      target: 'https://ipinfo.io/',
      allowedMethods: ['GET'],
      queryparams: {
        token: process.env.IPINFO_API_KEY,
      },
    },
  ],
}
