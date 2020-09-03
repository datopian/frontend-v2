# Theming frontend

In this article, we explain how you can create a theme and develop it.

If you prefer learning from examples, jump to [this section](#examples).

## Introduction

Theming is extremely easy. Remember the Next Gen frontend is just an express app. Themes are just a folder in the themes directory with templates plus an `index.js`. The `index.js` receives the Express app object which means a theme can also extend the core app with routes and/or middleware. If you aren't familiar with Express or Express routes, you may want to get up to speed: https://expressjs.com/en/guide/

Templating is done by default with [Nunjucks][]. It is essentially a node.js port of [jinja2](http://jinja.pocoo.org/docs/) which is the templating engine for CKAN Classic which makes it both familiar and extremely easy to port existing template code from Classic.

[Nunjucks]: https://mozilla.github.io/nunjucks/templating.html

## Getting started

To add a theme, create a folder in the `/themes` directory. At very least you must add a `index.js` file with the following code in it:

```javascript
module.exports = function (app) {
  // no-ops
}
```

The app object is the express app. We can extend this object to add routes to our application, to provide middleware layers, or to do anything that express allows us to do.

For instance, we can add a custom route with a simple message:

```javascript
module.exports = function (app) {
  app.get('/hello', (req, res) => {
    console.log('example route')
    res.render('example.html', {
      title: 'Example Theme route',
      content: {hello: 'Hello from my theme!'}
    })  
  })  
}
```

If you have worked with Express.js, this will look quite familiar. For more on working with Express.js, see the [complete documentation here](https://expressjs.com/en/5x/api.html).

Note that the first argument to the `res.render` function is the name of a template. We can define this template in our themes folder at `themes/mytheme/views/example.html`:

```html
{% extends "base.html" %}

{% block bodyclass %}dash{% endblock %}
{% block content %}
<div class="pt-6">
    {{ content.foo }}
</div>
{% endblock %}
```

By default, the frontend app uses DataHub theme which contains of templates (`/views/`) and assets (`/public/`).

If you need to customize the design of the site, you can create your own theme in the `/themes/` directory. E.g., we can create a theme called `example` with `public` and `views` directories so that they override default assets in `/public/` and templates in `/views/`:

```
/themes/example/public
/themes/example/views
```

::: warning
**NOTE**

The default assets and templates are used, if a file isn't found in your theme. This allows you to change specific part of the templates or assets.
:::

## Extending core controller

The controllers are called in the following order:

1. Plugins - e.g., WordPress plugin controller is called prior to theme and core controllers.
2. Theme - you can either extend or override a controller here.
3. Core - finally, core controller is called.

Below we have couple of examples of how would you extend the controllers.

### Home controller

Imagine you need to pass some more variables to home template. For example, you need to display featured groups/collections:

```javascript
// your index.js
module.exports = function (app) {
  const config = app.get('config')
  const dms = app.get('dms')
  const DmsModel = new dms.DmsModel(config)

  app.get('/', async (req, res, next) => {
    const collections = await DmsModel.getCollections()
    // You probably want to display only 3-4 collections. You can filter them here.
    // The template now has 'collections' variable:
    res.locals.collections = collections.slice(0, 3)
    next()
  })
}
```

### Showcase (dataset) controller

The showcase page is mostly rendered from a `datapackage` object so you might want to make some tweaks to it before it gets passed to the template. You always can override the controller but if you only want to make small tweaks, you can extend it:

```javascript
module.exports = function (app) {
  const config = app.get('config')
  const dms = app.get('dms')
  const DmsModel = new dms.DmsModel(config)

  app.get('/:owner/:name', async (req, res, next) => {
    res.locals.datapackage = await DmsModel.getPackage(req.params.name)
    // Now you can alter `datapackage` for your needs:
    res.locals.datapackage.title = 'My title'
    next()
  })
}
```

## Theme naming convention

Key points are:

* first part of the name is `frontend-{project name}`
* keep it short but meaningful
* use lower case
* use hyphens instead of underscores

Examples:

* frontend-company
* frontend-city

## Variables available in each page

### Macros (helpers)

All default macros are located at `/views/_snippets.html`.

Importing macros in a template:

```html
{% import '_snippets.html' as snippets %}
```

Use it:

```html
{{ snippets.package_list_show(packages) }}
```

#### List data packages

Example on search page:

![](https://i.imgur.com/jECzGkG.png)

* Macros: `package_list_show`
* Parameters:
  * list of data packages
* Returns: list of HTML elements. Each element is sort of a summary card for a data package.

#### List data package licenses or sources

Example:

![](https://i.imgur.com/Wa3yMQc.png)


* Macros: `listify`
* Parameters:
  * list of standard data package licenses or sources
* Returns: HTML anchor tag or span element

### Home page

Bespoke ...

### Search page

```javascript
{
  title: 'Search',
  result: [list of data packages],
  query: {q: '', size: '', from: '', sort: ''},
  pages: [list of pages to display in pagination]
}
```

### Showcase page

```javascript
{
  title: ...,
  dataset: datapackage, // a standard data package ...
  owner: {
    name: "rufuspollock"
    title: "Rufus Pollock",
    avatar: "...." // url to image for this
    route: "/rufuspollock",
  }
}
```

In standard Data package we have `created` and `modified` fields which is a timestamp and it isn't human readable (`2019-01-01 00:00:00`). We want to show it as `January 1, 2019`. The easiest would be to convert in controller and pass it through. E.g., in template if you access `dataset.created` it would print nicely formatted date.

### Organization page

```javascript
{
  // org
  title: 'owner name',
  owner (name): 'owner name',
  description: 'description from profile',
  avatar: 'url to image',
  joinDate: 'eg, June 2019',

  // misc ...
  result: [list of data packages],
  query: {q: '', size: '', from: '', sort: ''},
  pages: [list of pages to display in pagination]
}
```

### Collections page

List of collections page.

```javascript
{
  title: 'Dataset Collections',
  description: 'Catalogue of datasets ...',
  collections: [
    {
      name: '',
      title: '',
      summary: '',
      image: ''
    },
    ... // more collection objects
  ]
}
```

### Individual collection page

```javascript
{
  title: 'title of collection',
  item: {
    name: '',
    title: '',
    summary: '',
    image: ''
  },

  // Misc
  result: [list of data packages],
  query: {q: '', size: '', from: '', sort: ''},
  pages: [list of pages to display in pagination]
}
```

### Blog

List of posts.

```javascript
{
  posts: [{post}, ...]
}
```

``{post}`` object is a WP post object containing all available metadata. Below is main stuff that we use:

```javascript
{
  title: '',
  slug: '',
  content: '',
  date: ''
  modified: ''
}
```

### Article / post page

```javascript
{
  title: '',
  content: '',
  published: 'formatted published date',
  modified: 'formatted modified date'
}
```

## i18n

### Configure

Define location of translation files. We recommend creating `i18n` directory in your theme:

```
TRANSLATIONS=/themes/example/i18n
```

List of available locales then auto detected by filenames.

Use `defaultLocale` cookie to set the site's locale. E.g., if `defaultLocale=en`, then `/themes/example/i18n/en.json` file is used.

### i18n of the site

In your templates:

```html
{{ __('Hello world!') }}
{{ __('Hi %s', 'you') }} // Hi you
{{ __('Hi {{ name }}', { name: 'you' }) }} // Hi you
```

This will add a phrase/word to your translation file if it is unknown.

Plurals translation:

```html
{{ __n('%s dog', 1) }} // 1 dog
{{ __n('%s dog', 3) }} // 3 dogs
```

In your translation file:

```json
{
  "%s dog": {
    "one": "%s dog",
    "other": "%s dogs"
  }
}
```

### i18n of the content

You can have a page in WordPress with the same slug as original page plus locale at the end. E.g., for `/about` page we would have two pages on WP, `about` (English) and `about-da` (Danish). When fetching a content we can check the user's locale and get content in his/her language.

## Theme distribution and installation

We recommend either having your theme in a git repository or publish it to NPM.

### Theme is in a git repo

If your theme is not published to NPM but it is available in a git repo, you can install it from there:

```bash
# From gitlab repo and datopian org:
$ yarn add git+https://git@gitlab.com/datopian/repo-name.git

# From github repo and datopian org:
$ yarn add git+https://git@github.com/datopian/repo-name.git
```

### Theme is on NPM

If the theme is on NPM you can install it as a regular NPM package:

```bash
$ yarn add my-theme-name
```

### Enable it

Once you've installed the theme, you need to enable it via `.env` config file:

```
THEME=my-theme-name
THEME_DIR=node_modules
```

Done! Start the server and checkout how your theme looks like :wave:

## Examples

### Open Data Denmark

Technologies and plugins used:

* CSS framework: Tailwind
* CMS: WordPress
* DMS: CKAN Classic
* Other plugins: proxy

Features and functionalities implemented in the theme:

* Search in static content
  * Searches in WordPress instance
  * Has a dedicated search page: `/search/content`
* Search box with the dropdown with 2 options for searching data and content
* Displaying random groups on the front page
* Categories for blog posts and ability to filter by category
* Displaying featured posts

Useful links:

* Site: https://frontend-v2-openddk.herokuapp.com/
* Repo: https://github.com/datopian/frontend-v2/tree/master/themes/opendk

### Energinet

Technologies and plugins used:

* CSS framework: Tailwind
* CMS: WordPress
* DMS: CKAN Classic
* Other plugins: proxy, google-analytics, mailer

Features and functionalities implemented in the theme:

* TODO

Useful links:

* Site: https://frontend-v2-eds.herokuapp.com/
* Repo: https://gitlab.com/datopian/eds/frontend-eds
* NPM: https://www.npmjs.com/package/@datopian/eds

### Montreal

Technologies and plugins used:

* CSS framework: Tailwind
* CMS: CKAN Pages
* DMS: CKAN Classic
* Other plugins: carto, dashboard, applications-showcase, disqus

Features and functionalities implemented in the theme:

* TODO

Useful links:

* Site: http://montreal.ckan.io/
* Repo: https://gitlab.com/datopian/clients/ckan-montreal
* NPM: https://www.npmjs.com/package/@datopian/ckan-montreal

### Department of Education

Technologies and plugins used:

* CSS framework: Tailwind (based on Open Data Denmark)
* CMS: TODO
* DMS: CKAN Classic
* Other plugins: TODO

Features and functionalities implemented in the theme:

* TODO

Useful links:

* Site: https://us-ed-ng.ckan.io/
* Repo: https://gitlab.com/datopian/dept-ed-frontend

### Axenit

Technologies and plugins used:

* CSS framework: TODO
* CMS: TODO
* DMS: TODO
* Other plugins: TODO

Features and functionalities implemented in the theme:

* TODO

Useful links:

* Site: TODO
* Repo: https://gitlab.com/datopian/clients/axenit-theme
