# Frontend plugins

Plugins allow you to extend the functionality of the Frontend in all important ways:

* Adding new pages (or overriding existing ones)
* Add or adjust authentication and authorization
* Add functionality to every page e.g. add analytics
* Overriding or adding data sources

## Introduction

Plugins are extremely easy. Remember the Next Gen frontend is just an express app.

Plugins are therefore just vanilla Express!

Plugin files are passed the Express `app` object which they can then extend with middleware or routes. If you aren't familiar with Express or Express middleware, you may  want to get up to speed: https://expressjs.com/en/guide/writing-middleware.html

There are currently two types of plugins: "local" plugins which are added to the `/plugins` directory, and npm plugins, which we install via npm.

There are also a variety of built-in plugins that come with the default system.

## Local Plugins

Create a directory with the plugin's name in the `/plugins` directory.

```bash
$ mkdir plugins/addheader
```

Inside of this directory create a file called `index.js` with the following contents:

```javascript
module.exports = function(app) {
  app.use((req, res, next) => {
    res.header('x-my-custom-header', 1234)
    next()
  })
}
```

If you have worked with express middleware, you may recognize this pattern. For more on working with middleware in Express, see the docs [here](https://expressjs.com/en/guide/writing-middleware.html).

Add the plugin name to your `.env` file:

```
PLUGINS="addheader"
```

Run your application. Web responses from the frontend application should include your custom header.

## NPM Plugins

If an express middleware plugin is available as a standalone module on npm you can install it as-is by installing the package via npm, and adding it to your PLUGINS variable in `.env`

For example, we will install the cookie-parser plugin, alongside our addheader plugin.

Install the npm package:
```
$ yarn add cookie-parser
```

Now add the plugins to your `.env`, alongside the custom `addheader` plugin we created above:
```
PLUGINS="addheader cookie-parser"
```

Cookie-parser will now be applied to all of your requests as express middleware!

(For instance, you could take advantage of this in custom routes, etc)

For more on express middleware: https://expressjs.com/en/guide/using-middleware.html.

## Built-in Plugins

There are a variety of built-in plugins that provide common functionality "out of the box". For example, most of the projects need a CMS solution (most commonly WordPress or CKAN Pages) or analytics system such as Google Analytics. So we've developed number of built-in plugins that you can use in your project and deliver features easily and reliably.

All built-in plugins are located here - https://github.com/datopian/frontend-v2/tree/master/plugins.

We constantly add something new but here is the list of currently available plugins:

* `applications-showcase` - integration of https://github.com/ckan/ckanext-showcase.
* `carto` - provides carto map visualizations via the Carto VL library.
* `ckan_pages` - integration of https://github.com/ckan/ckanext-pages.
* `dashboard` - dashboards based on https://github.com/datopian/dashboard-js/ library.
* `google-analytics` - Google Analytics integration.
* `mailer` - SMTP server in your frontend app.
* `proxy` - a proxy for your frontend app.
* `wp` - WordPress CMS integration plugin.
* `disqus` - Disqus integration.

## How do I enable them?

Simply add a name of a plugin into your list of `PLUGINS` in your [config file](/frontend/configs/):

```
PLUGINS=proxy wp etc
```

## How do I use them?

### Applications showcase

To add applications showcase plugin to your application you need to
enable the plugin in your `.env` file:

```bash
PLUGINS="... applications-showcase ..."
```

Here is the list of well-known services that can be used without setting host and port of your SMTP server: [Supported services](https://nodemailer.com/smtp/well-known/#supported-services).

Then you need to implement `contact.html` template in your theme so that a contact form can be rendered at `/contact`.

### Carto

Provide carto map visualizations via the Carto VL library.

Assumes data is in carto.

#### Geocoding data

Data needs to have a `the_geom` column with a valid geometry object.

See:

https://carto.com/developers/data-services-api/reference/#geocoding-functions

https://carto.com/help/working-with-data/carto-functions/

SELECT CDB_LatLng(float, float)

To encode from lat long:

https://{USER_NAME}.carto.com/api/v2/sql?q=UPDATE {TABLE_NAME} SET the_geom = CDB_LatLng({LAT_COLUMN}, {LON_COLUMN})&api_key={API_KEY_WITH_WRITE_ACCESS}

https://paulwalker-datopian.carto.com/api/v2/sql?q=UPDATE accidents_2012_2017 SET the_geom = CDB_LatLng(loc_lat, loc_long)&api_key=Mef_QoqGyQRspq9AumGvbg

Auth: Note that the token used needs to be associated with an API user with write / update permissions

### CKAN Pages

To use CKAN Pages as your CMS backend, add it to your list of `PLUGINS` in `.env` file:

```
PLUGINS=ckan_pages
```

When enabled, CKAN Pages plugin will use the CKAN `API_URL` environment variable by default.
To configure a different URL for your CKAN Pages backend add `CKAN_PAGES_URL=https://yourckan.com/api/3/action/` to your environment.

For more info about enabling and using CKAN Pages - https://github.com/ckan/ckanext-pages

### Dashboard

Integration of https://github.com/datopian/dashboard-js/ library. Dashboard configurations are fetched from a git repository. You need to set it up via your config file:

```
GIT_BASE_URL=
GIT_OWNER=
```

We've created a tutorial about how to create and use dashboards:

http://tech.datopian.com/dashboards/

### Google analytics

To add Google Analytics enable the plugin in your `.env` file:

```bash
PLUGINS="... google-analytics ..."
```

#### Tracking code

To add tracking code to page templates, set up `GA_ID` env variable:

```bash
GA_ID=UA-000000000-0
```

#### Google Analytics Api

To set up [google analytics API](https://developers.google.com/analytics/devguides/reporting/core/v3/reference):
1. create [Service Account credentials in google developer console](https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/service-py#clientId)
2. use the credentials from the json file for the following env variables:
```bash
GA_CLIENT_EMAIL=<client_email>
GA_PRIVATE_KEY=<private_key, a long string with line breaks, should be inside inside quotes (")>
```
3. find the view id in google analytics, 
  * you can specify it in the env file:
```bash
GA_VIEW_ID=<optional, can be specified in request params>
```
  * or specify it directly in the code later, in case you'll need different views
4. example of the google analytics api object use:
```javascript
...
const view_id = <view id from google analytics>
const gaApi = app.get('ga-api')
const params = {
      'ids': 'ga:' + view_id, //optionally here or in env file
      'start-date': '30daysAgo',
      'end-date': 'today',
      'sort': '-ga:uniquePageviews',
      'dimensions': 'ga:pagePathLevel2',
      'metrics': 'ga:uniquePageviews',
      'max-results': 30,
      'filters': 'ga:pagePathLevel1==/dataset/'
    }
const googleAnalyticsData = gaApi.get(params)
...
```

### Mailer

To enable mailer plugin, you need to update your `.env` as following:

```
PLUGINS="... mailer ..."
SMTP_SERVICE=gmail (optional if you have host and port details)
SMTP_HOST=smtp.example.com (optional if you set 'SMTP_SERVICE')
SMTP_PORT=587 (optional if you set 'SMTP_SERVICE')
EMAIL_FROM=from@example.com
EMAIL_PASSWORD=*****
EMAIL_TO=to@example.com
```

### Proxy

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

### WP

#### Setup

The wordpress plugin (`/plugins/wp`) ships with frontend-v2. To enable it via `.env` file:

```
PLUGINS=wp
```

Use `WP_URL` environment variable to point to your WordPress instance. For example, we have test wordpress blog here https://oddk.home.blog/ so it would be:

```
WP_URL=https://oddk.home.blog/
```

Use `WP_BLOG_PATH` environment variable to configure where your blog should be located in your site - by default, it is at `/news`. To change it, e.g., to `/blog`:

```
WP_BLOG_PATH="/blog"
```

If your blog is private, you can set up `WP_TOKEN` environment variable to pass your access token. To get access token for private WP blog, check out this - https://developer.wordpress.com/docs/oauth2/.

#### How it works

The plugin adds/changes the following routes:

* `/` - your home view now receives `posts` variable with the latest 3 blog posts from your WP instance;
* `/news` - your blog view now receives `posts` variable with the latest 10 blog posts;
* `/news/:page` - renders individual post page - `post.html` view;
* `/:page` and `/:parent/:page` - if slug is found in your WP instance, renders static page view (`static.html`).

### Disqus

We don't have special plugin for this feature as you can simply setup an account on https://disqus.com/ and get a snippet that you can paste in your template. E.g., you can paste it in the `showcase.html` if you need it for every dataset page and so on.

## Where should I look for source code of these plugins?

You can find all plugins here - https://github.com/datopian/frontend-v2/tree/master/plugins.
