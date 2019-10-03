The proxy plugin ships with frontend-v2. To enable it via `.env` file:

```
PLUGINS=proxy other_plugins
```

Use `PROXY_DATASTORE` and `PROXY_FILESTORE` environment variables to indicate host of your datastore and filestore:

```
PROXY_DATASTORE=demo.ckan.org
PROXY_FILESTORE=
```

Now you can request datastore by `/proxy/datastore/{path}`.
