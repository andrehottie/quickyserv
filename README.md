# QuickyServ

This is a tool to quickly generate custom (super basic) node server.

# Quick Start

#### Install QuickyServ

```
npm install -g quickyserv
```

#### Create your server folder

```
mkdir MyServer && cd MyServer
```

#### Run QuickyServ

```
quickyserv
```

[![](https://i.postimg.cc/TwMySS5q/Schermata-2020-09-18-alle-15-33-33.png)](https://postimg.cc/XZL7Bs8p)

# More

- **Simple Node Server**:
  Generate a simple _server.js_ file with a node server at _0.0.0.0:3000_.

- **Simple Node With HTML**:
  Generate a simple _server.js_ file with a node server at _0.0.0.0:3000_ that returns HTML.

- **Simple Node Single Page**:
  Generate _server.js_ and _index.html_ files hosted at _0.0.0.0:3000_.

- **Server with Routes [to JS]**:
  You need to type the routes endpoints separated by **pipe** and it will generate a _server.js_ file with all your routes.

Example:

```
list|create|edit/{id}|delete/{id}
```

- **Server with Router [to HTML]**:
  You need to type the routes endpoints and filename separated by **pipe** and it will generate a _server.js_ with your routes and all the _.html_ files.
  Routes format needs to be: `{route}->{filename}`

Example:

```
home->index|contacts->contacts|faq->faq
```

# That's all!

Now just run `node server` and your server will works!
