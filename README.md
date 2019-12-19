# API Key Proxy Server

A dead easy proxy server to remove the API keys from your front-end code.

## Table of contents

- [How it works](#how-it-works)
- [Deploying your own proxy server to Heroku](#deploying-your-own-proxy-server-to-heroku)
- [Test it with the Open Weather Api](#test-it-with-the-open-weather-api)
- [Contributing](#contributing)
- [Show your support](#show-your-support)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## How it works

Once you have it setup and deployed, redirect your API calls to the proxy server, this will handle the requests to the API service using your API key and give you back the response if you are an allowed origin.

You are able to set up as many API services as you like by providing different endpoints to each one of them.

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
git clone https://github.com/MauricioRobayo/api-key-proxy-heroku.git
```

### 2. Move into the repository and create a new Heroku app

```sh
cd api-key-proxy-heroku
heroku create
```

### 3. Include your API keys

Include your API keys on the Heroku app. On the dashboard go to `Settings` and look up for the `Config Vars` section. Copy and paste your API keys there using the same variable name you are using to retrieve it on each proxy service on the [proxies](./src/proxies) folder. For example, in the case of the [Open Weather Api proxy](./src/proxies/weather-proxy.js) that is included with the code, the variable name is `WEATHER_API_KEY`.

### 4. Allow the domains you want to request to the proxy

Check the [proxies](./src/proxies) folder and modify the `allowedDomains` array on each proxy service to include the domains that you want to allow to connect to the proxy.

```js
const allowedDomains = [
  'https://username.github.io',
  'https://someapp.com',
  'https://another.domain.com',
]
```

**Do not include pathnames:**

- Wrong: `https://example.com/some-path` ❌
- Right: `https://example.com` ✔

**Do not include trailing slash:**

- Wrong: `https://example.com/` ❌
- Right: `https://example.com` ✔

### 5. Include the proxies you need

Make sure to include the proxies you want on [`app.js`](./src/app.js) by using:

```js
const express = require('express')
const debug = require('debug')('express:server')
const weatherProxy = require('./proxies/weather-proxy')
const ipinfoProxy = require('./proxies/ipinfo-proxy')
const yourProxy = require('./proxies/some-api-proxy') // Include as many proxies as you need

require('dotenv').config()

const app = express()

app.use(weatherProxy)
app.use(ipinfoProxy)
app.use(yourProxy) // Don't forget to tell express to use your new proxy
```

The code already includes the proxies for the Open Weather Api and for the IPinfo Api, so if you are using any of those services, you don't need to do anything here.

### 6. Commit your changes and deploy to Heroku

```sh
git commit -am"Update proxy settings"
git push heroku
```

Finally, you can use your Proxy server to redirect the requests from your front end code. For example:

```js
// Original request
const apiService = 'https://api.openweathermap.org/data/2.5/weather'
fetch(`${apiService}?q=${city}&units=${units}&appid=${apiKey}`)
  .then(response => response.json)
  .then(json => handleData(json))
```

```js
// Request using your proxy
const apiProxy = 'https://calm-horse-55245.herokuapp.com/weather'
fetch(`${apiProxy}?q=${city}&units=${units}`)
  .then(response => response.json)
  .then(json => handleData(json))
```

## Test it with the Open Weather Api

The code already includes two API services you can test drive it:

- [./src/proxies/weather-proxy](./src/proxies/weather-proxy.js) → https://openweathermap.org
- [./src/proxies/ipinfo-proxy](./src/proxies/ipinfo-proxy.js) → https://ipinfo.io

To test it on your local machine or for development purposes:

### 1. Clone the repository and install dependencies

```sh
git clone https://github.com/MauricioRobayo/api-key-proxy-heroku.git
cd api-key-proxy-heroku
npm install
```

### 2. Allow the domains on the proxy

Modify the `allowedDomains` array inside each proxy configuration inside the `proxies` folder to include the domains you want to allow. For example, if you are developing a front-end app on `http://localhost:8080` and you want to allow requests from that domain to the proxy:

```js
const allowedDomains = [
  'http://localhost:8080', // no trailing slash!
]
```

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

## Contributing

🤝 Contributions are welcome!

## Show your support

Give it a ⭐️ if you like this project!

## Acknowledgments

[![Matheus Approved](https://img.shields.io/badge/Mat-Approved-green)](https://github.com/matheus-fls/weather-app)

All the heavy lifting is done by the [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) module.

The server is handled by [Express](https://expressjs.com/).

## License

This project is [MIT](LICENSE) licensed.
