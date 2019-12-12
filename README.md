## cats-pwa

Simply shows cute cat pics


How to run:

As we have no server, let's use the python inbuilt http server, so go into the project dir and then run,

```
    python -m SimpleHTTPServer
```

it will run your corrent dir on port 8000, now thing would be accessible on localhost:8000.


Open `localhost:8000`, you should see cute cat pics.

Go and check `application` tab in chrome to see if service worker is installed/working and caching stuff.

Now if you go offline, you can still see your app working.


Also:

On chrome, you will see `+` icon on the right corner of the address bar, telling you to install the app, as it is a PWA, it can be installed as a desktop app, and same happens on mobile.

Install it and try it out.
