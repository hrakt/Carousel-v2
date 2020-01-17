# ui-playground

This application is built using [NextJS](https://github.com/zeit/next.js/).

**Please read their docs before reading this.**

<!-- TOC -->

-   ui-playground
    -   [Basics](#basics)
        -   [Development](#development)
            -   [Run locally](#run-locally)
            -   [Run in Docker](#run-in-docker)
        -   [Production](#production)
    -   [Pages](#pages)
        -   [File Structure](#file-structure)
    -   [Components](#components)
        -   [Import example](#import-example)
        -   [File Structure](#file-structure-1)
    -   [CSS/SCSS](#cssscss)
        -   [style-utils](#style-utils)
        -   [Configuration](#configuration)
    -   [Routing](#routing)
    -   [Testing](#testing)
    -   [Type checking](#type-checking)

<!-- /TOC -->

## Basics

### Development

To run in dev mode you can run either

#### Run locally

```bash
npm run dev
```

#### Run in Docker

```bash
./dev.sh
```

### Production

The following with build and start a production build

```bash
npm run build && npm start
```

## Pages

### File Structure

Each page should be built with the following structure

```tree
pages
  | - page-name
  | | - index.js
  | | - PageName.scss
```

If you have multiple components that live under one page make sure that whatever Next is going to render for a page's route is the default export from `index.js`

Since we are using [CSS Modules](https://github.com/css-modules/css-modules) with scoped classnames **you must name your CSS/SCSS file after the component**. This ensures that the classnames are human readable and give developers context as to where the class is defined. Naming it `style.scss` results in all your classes looking like this `style__some-class-name_c29tZXRoaW5nDQo=`.

## Components

### Import example

```js
import Component1 from 'components/path/to/Component1';
import Component2 from 'components/path/to/Component2';
import Component3 from 'components/path/to/Component3';
```

### File Structure

Components share a similar structure to `pages` and live in the `components` folder

```tree
components
  | - ui
  | | - component-name
  | | | - index.js
  | | | - ComponentName.scss
```

## CSS/SCSS

### style-utils

There are a set of `styles` for common values and mixins.

```scss
@import 'styles/animations.scss';
@import 'styles/breakpoints.scss';
@import 'styles/colors.scss';
@import 'styles/fonts.scss';
@import 'styles/utilities.scss';
```

-   `animations.scss` which contains timings and easings variables.
-   `breakpoints.scss` which contains mixins for each breakpoint and variables for their viewport widths.
-   `colors.scss` contains variables for each color used in an app's theme.
-   `fonts.scss` contains variables for font sizings, baseline height, typographic elements, faces and weights.
-   `utilities.scss` contains classes, functions, etc that are used throughout the styles.

Each of these exports values using `:exports` for CSS modules so any SCSS file these are imported to will add those values to the `style` object so you can use them inline in JS if needed. All exports are `string` types so parse accordingly.

### Configuration

This app is configured to use CSS Modules and scoped classnames. It also will **automagically convert hyphenated classnames to camelCase in the `style` object**. No need to write camel cased class names. For example:

```scss
.some-class-name {
    // awesome style properties here
}
```

**becomes:**

```js
styles.someClassName;
```

## Routing

Because we are using [Next-Routes](https://github.com/fridays/next-routes), **all routes must be defined in our `routes.js` file** Relying on the Next "magic" routes will result in the server sending a 404 and the client flashing it and resolving the component on the client side.

No bueno.

In `routes.js` you can add each route config object to `routeConfigs`. Each object has the following options:

```js
  {
      name: 'landing',
      pattern: '/',
      page: '/',
  },
```

Please reference the `next-routes` docs for what each of those arguments does and their defaults.

## Testing

This app uses [Jest](https://jestjs.io/) and [react-testing-library](https://github.com/kentcdodds/react-testing-library) for unit tests and [Cypress.io](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) for e2e tests. Please read the documentation for these and write tests for as much as possible. Strive to cover any critical features and user paths. [jest-dom](https://github.com/gnapse/jest-dom#readme) is also available to use for DOM related assertions

## Type checking

This app uses [Flow](https://flow.org/) for static type checking. Please strive to type check your code. Flow only includes files that include the `//@flow` pragma at the top of the file.
