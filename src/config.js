module.exports = {
  proxies: [
    {
      allowedDomains:
        process.env.NODE_ENV === 'development'
          ? ['http://localhost:8080']
          : ['https://www.mauriciorobayo.com'],
      route: '/weather',
      target: 'https://api.openweathermap.org/data/2.5/weather',
      allowedMethods: ['GET'],
      queryparams: {
        appid: process.env.WEATHER_API_KEY,
      },
    },
    {
      allowedDomains:
        process.env.NODE_ENV === 'development'
          ? ['http://localhost:8080']
          : ['https://www.mauriciorobayo.com'],
      route: '/ipinfo',
      target: 'https://ipinfo.io/',
      allowedMethods: ['GET'],
      queryparams: {
        token: process.env.IPINFO_API_KEY,
      },
    },
  ],
}
