To watch files:

```bash
npx gulp
```

This watches for changes to CSS and icons. On changes to CSS [PostCSS](https://postcss.org/) and plugins ([postcss-import](https://github.com/postcss/postcss-import), [postcss-preset-env](https://preset-env.cssdb.org/), [tailwindcss](https://tailwindcss.com), [cssnano](https://cssnano.co/)) are run. On icon changes, the SVG icon sprite is remade. These processes can be run without watching via `npx gulp css` and `npx gulp icons`.

Icons are used like so: `<svg><use xlink:href="#<filename>" /></svg>`. Eg. to use the search.svg icon, you use `<svg><use xlink:href="#search" /></svg>`.

Note: Unless you are making significant changes to the design, you probably won't need these processes. Most styling is done through [Tailwind's](https://tailwindcss.com) utility classes.
