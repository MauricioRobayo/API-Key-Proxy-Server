# API KEY PROXY - HEROKU

A dead easy proxy server to remove the API keys from your front end code.

## How it works

Once you have it setup and deployed, redirect your API calls to the proxy server, this will handle the request to the API service using your API key and give you back the response if you are an allowed origin.

You are able to set up as many API services as you like by providing different endpoints to each one of them.

For example, let say you are using the [Open Weather Api](https://openweathermap.org/), so on your code you have a request that looks something like this:

```js
const endpoint = 'https://api.openweathermap.org/data/2.5/weather'
fetch(`${endpoint}?appid=${apiKey}&q=${city}`)
  .then(response => response.json)
  .then(json => handleData(json))
```

After setting your proxy server you can call your new endpoint withou the API key:

```js
const endpoint = 'https://calm-horse-55245.herokuapp.com/weather'
fetch(`${endpoint}?q=${city}`)
  .then(response => response.json)
  .then(json => handleData(json))
```

Once the proxy gets the request, it will pass it to the Open Weather Api including the API key, and return to you with the response from the API.

You have to tell the proxy server to allow the domain it is getting the request from, in this case, the domain for your Weather app.

## Getting Started

To get your proxy server up and running:

1. Clone the repository

```sh
git clone https://github.com/MauricioRobayo/api-key-proxy-heroku
```

2. Move into the repository and create a new Heroku app:

```sh
heroku create
```

3. Include your API keys on the Heroku app. On the dashboard go to `Settings` and look up for the `Config Vars` section. Copy and paste your API keys there using the same variable name you are using to retrieve it on each proxy service on the [proxies](./proxies) folder.

4. Check the [proxies](./proxies) folder and modify the `allowedDomains` array on each proxy service to include the domains that you want to allow to connect to the proxy.

```js
const allowedDomains = [
  'https://example.com',
  'https://my-weather-app.github.io',
  'https://any-other-domain.com',
]
```

5. Make sure to include the proxies you want on `app.js` by using:

```js
app.use(yourProxy)
```

6. Commit your changes and deploy to Heroku:

```sh
git commit -am"Update proxy settings"
git push heroku
```

Finally, you can use your Proxy server to redirect the requests from your front end code.

## 🤝 Contributing

Contributions are welcome!

## Show your support

Give a ⭐️ if you like this project!

## 📝 License

This project is [MIT](LICENSE) licensed.
