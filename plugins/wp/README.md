## Setup

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

## How it works

The plugin adds/changes the following routes:

* `/` - your home view now receives `posts` variable with the latest 3 blog posts from your WP instance;
* `/news` - your blog view now receives `posts` variable with the latest 10 blog posts;
* `/news/:page` - renders individual post page - `post.html` view;
* `/:page` and `/:parent/:page` - if slug is found in your WP instance, renders static page view (`static.html`).
