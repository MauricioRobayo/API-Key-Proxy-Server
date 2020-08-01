# API Key Proxy Server
[![CodeFactor](https://www.codefactor.io/repository/github/mauriciorobayo/api-key-proxy-server/badge)](https://www.codefactor.io/repository/github/mauriciorobayo/api-key-proxy-server)

A dead easy proxy server to remove your front-end API keys.

## Table of contents

- [How it works](#how-it-works)
- [Deploying your own proxy server to Heroku](#deploying-your-own-proxy-server-to-heroku)
- [Test it with the Open Weather Api](#test-it-with-the-open-weather-api)
- [Contributing](#contributing)
- [Show your support](#show-your-support)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## How it works

Once you have it setup and deployed, redirect your API calls to the proxy server, this will handle the requests to the API service using your authentication method and give you back the response if you are an allowed origin.

You are able to set up as many API services as you like by providing different endpoints to each one of them. Take a look at the [config](src/config.ts) to get an idea on how to setup your API services.

For example, let say you are using the [Open Weather Api](https://openweathermap.org/), so in your code you have a request that looks something like this:

```js
const endpoint = 'https://api.openweathermap.org/data/2.5/weather'
fetch(`${endpoint}?q=${city}&units=${units}&appid=${apiKey}`)
  .then(response => response.json)
  .then(json => handleData(json))
```

👉 **Notice the API key is included in the request:** `&appid=${apiKey}` 😢.

After setting your proxy server you can call your new endpoint without the API key:

```js
const endpoint = 'https://calm-horse-55245.herokuapp.com/weather'
fetch(`${endpoint}?q=${city}&units=${units}`)
  .then(response => response.json)
  .then(json => handleData(json))
```

👉 **Now you can remove the API key from your request:** 😊.

Once the proxy gets the request, it will include your API key and pass it to the Open Weather Api, and return to you with the response from the API if you are an allowed origin.

## Deploying your own proxy server to Heroku

To get your proxy server up and running:

### 1. Clone the repository

```sh
git clone https://github.com/mauriciorobayo/api-key-proxy-server.git
```

### 2. Move into the repository and create a new Heroku app

```sh
cd api-key-proxy-heroku
heroku create
```

### 3. Include your API keys

Include your API keys on the Heroku app. On the dashboard go to `Settings` and lookup for the `Config Vars` section. Copy and paste your API keys there using the same variable name you are using to retrieve it on each proxy service on the [config.ts](./src/config.ts) file. For example, in the case of the [Open Weather Api proxy] that is included with the code, the variable name is `WEATHER_API_KEY`.

### 4. Set up your API proxies

You can include all the API services you want using the [`config.ts`](src/config.ts) file which exports an object with the following options:

**allowedDomains**: An **array** of domains you want to allow to make calls to the proxy server. All the domains not listed here will be rejected with a `cors` error.

**Do not include pathnames**:

- Wrong: `https://example.com/some-path` ❌
- Right: `https://example.com` ✔

**Do not include trailing slash**:

- Wrong: `https://example.com/` ❌
- Right: `https://example.com` ✔

**proxies**: An array with the configuration options for each API service. The config file included provides configurations for [Open Weather API](https://openweathermap.org/api), the [ipinfo API](https://ipinfo.io/), and the [GitHub API](https://developer.github.com/v3/). You can remove or add as many as you need:

```js
[
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
    },
    auth: `${process.env.GITHUB_USERNAME}:${process.env.GITHUB_TOKEN}`,
  },
],
```

The following are the options for each proxy config:

**allowedDomains**: You can include specific allowed domains just for a specific proxy.

**route**: The path on the proxy server. For example, if you set it to `'/weather'`, then you will access that API service through that path on your proxy server: `https://your-proxy-server.heroku.app/weather`.

**allowedMethods**: An array of methods the server will proxy to the API service. It defaults to `'GET'`.

**target**: The API endpoint that's going to be proxied by the proxy server. All request made to the `route` on the proxy server will be proxied to the `target` endpoint.

**headers**: An object with the headers that will be added to the request made to the proxy server.

**auth**: Basic authentication, for example: 'user:password' to compute an Authorization header.

**queryparams**: Additional query params to be added to the request made to the proxy.

### 5. Commit your changes and deploy to Heroku

```sh
git commit -am"Update proxy settings"
git push heroku
```

Finally, you can use your Proxy server to redirect the requests from your front end code. For example:

```js
// Original request
const apiService = 'https://api.openweathermap.org/data/2.5/weather'
fetch(`${apiService}?q=${city}&units=${units}&appid=${apiKey}`)
  .then(response => response.json())
  .then(json => handleData(json))
```

```js
// Request using your proxy
const apiProxy = 'https://calm-horse-55245.herokuapp.com/weather'
fetch(`${apiProxy}?q=${city}&units=${units}`)
  .then(response => response.json())
  .then(json => handleData(json))
```

## Test it on development

The code already includes three API services you can test drive it:

- [Open Weather Api](https://openweathermap.org/api)
- [ipinfo](https://ipinfo.io/)
- [GitHub with personal access tokens](https://developer.github.com/v3/auth/#via-oauth-and-personal-access-tokens)

To test it on your local machine or for development purposes:

### 1. Clone the repository and install dependencies

```sh
git clone https://github.com/MauricioRobayo/api-key-proxy-heroku.git
cd api-key-proxy-heroku
npm install
```

### 2. Allow the domains on the proxy

Modify the `allowedDomains` array inside inside the `config` file to include the domains you want to allow. For example, if you are developing a front-end app on `http://localhost:8080` and you want to allow requests from that domain to the proxy:

```js
allowedDomains: ['http://localhost:8080']
```

You can include as many allowed domains as you want.

**Do not include pathnames:**

- Wrong: `https://example.com/some-path` ❌
- Right: `https://example.com` ✔

**Do not include trailing slash:**

- Wrong: `https://example.com/` ❌
- Right: `https://example.com` ✔

### 3. Provide your API keys

Copy the `.env.sample` file included in the root of the repo to a file named `.env` also in the root of the repo, and include your API keys there.

### 4. Test the proxy server

Start the development server with `npm run start:dev`.

Now you can test drive your proxy server on your local machine for development:

- `http://localhost:5000/weather` will include the `WEATHER_API_KEY` key from your `.env` file and forward the requests to the Open Weather Api.
- `http://localhost:5000/ipinfo` will include the `IPINFO_API_KEY` key from your `.env` file and forward the requests to the IPinfo Api.
- `http://localhost:5000/github` will include the basic authentication from your `.env` file and forward the requests to the GitHub Api.

## Contributing

All contributions are welcome!

## Show your support

Give it a ⭐️ if you like this project!

## Acknowledgments

[![Matheus Approved](https://img.shields.io/badge/Mat-Approved-green)](https://github.com/matheus-fls/weather-app)

All the heavy lifting is done by the [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) module.

The server is handled by [Express](https://expressjs.com/).

## About me

Github: [@mauriciorobayo](https://github.com/MauricioRobayo)
Twitter: [@mauriciorobayo\_](https://twitter.com/MauricioRobayo_)
LinkedIn: [@mauriciorobayo](https://www.linkedin.com/in/MauricioRobayo)

## License

This project is [MIT](LICENSE) licensed.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMauricioRobayo%2Fapi-key-proxy-server.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FMauricioRobayo%2Fapi-key-proxy-server?ref=badge_large)
