# Hello world!

Now you will learn how to customize the home page. We've prepared an `example` theme (located in `./themes/` directory) that you can use to get started with theming frontend app. Let's customize the home page -- our "Hello World"!

Enable the theme in your `.env` file (read more about configs [here](/frontend/configs/)):

```
THEME=example
```

## Changing template

In order to override the home page template we first need to copy it to the `views` folder of our `example` theme

```bash
$ cp views/home.html themes/example/views/
```

Use a text editor to edit the `themes/example/views/home.html` file and find the `<div>` containing the home page `<h1>` heading and replace the text so that it resembles the following:

``` html{2,3}
<div class="left-sec">
  <h1>Hello World</h1>
  <p>Hello world, how are you?</p>
```

Save the file. If you're running the app in [dev mode](/frontend/#installation), it should re-load automatically, and show you the update to the home page template.

![Hello world!](../../../img/hello_world.png)

Congratulations :tada:

## Changing styles

Default stylesheets are imported in the `views/base.html` so you can either extend them or replace it by creating your own `base.html` template. Let's replace `home.html` and `base.html` so we can see how you can add your own CSS:

Let's make `themes/example/views/home.html` minimal so we can easily track changes:

``` html
{% extends "base.html" %}

{% block title %}
Welcome - Home
{% endblock %}

{% block bodyclass %}home{% endblock %}

{% block content %}
<div class="container">
  <h1>Hello World</h1>
  <p>Hello world, how are you?</p>
</div>
{% endblock %}
```

Your `themes/example/views/base.html` should have the following content:

``` html{10}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>
      {% block title%}{{title}}{% endblock %}
    </title>
    <meta name="author" content="Datopian">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" media="screen" href="/static/stylesheets/main.css">
  </head>
  <body class="{% block bodyclass %}{{bodyclass}}{% endblock %}">
    {% block content %}{{content}}{% endblock %}
  </body>
</html>
```

Notice the highlighted line - this is where we include your CSS asset. It's served from `/static/stylesheets/` directory and asset name is `main.css`. Note that the `static` directory is a virtual path prefix so it doesn't exist in the file system. We serve static files from directory called `public`. At the moment, it doesn't exist so you need to create it:

``` bash
mkdir themes/example/public
mkdir themes/example/public/stylesheets
touch themes/example/public/stylesheets/main.css
```

If you update the home page, you can see that it doesn't have any styles yet:

![No CSS](../../../img/no-css.png)

Now you can start adding your CSS in `themes/example/public/stylesheets/main.css` file, e.g., let's do something so we can see the difference:

``` css
body {
  background-color: gray;
}
```

Now you can see:

![Basic CSS](../../../img/basic-css.png)

## Add assets

The created `themes/example/public/` directory is the place to put all your assets including images, CSS files and JavaScript modules. We suggest organizing them in the following structure:

```
public
  js/
  stylesheets/
  img/
```

You can then add them in your template via virtual `/static/` path, e.g., `/static/img/logo.png`.
