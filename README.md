## Intension

This repos is for a basic client-server communication app

### Features

- Real time connection between client-server
- Ability to have private and public channel
- Separate API for channels
- Caching for pubic and private channel
- Typescript supported

### Installation

First install all packages, after cloning the repo in your local

```
npm i
```

Then run the project

```
npm run dev
```

### Process

Set base url of your local host. It should be same for both socket and server. We are using

```
http://localhost:8080
```

### API

after setting everything you will have 2 **APIs**

```
http://{{yourlocalhost}}/api/v1/messages/public
```

```
http://{{yourlocalhost}}/api/v1/messages/private
```

And another for health check

```
http://{{yourlocalhost}}/api/v1/health
```

This will return your **Server is UP**
