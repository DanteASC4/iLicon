# iLicon

<p align="center">
  <img width="300" height="300" src="https://i.imgur.com/7seC3yn.png">
</p>

A small package for fetching site favicons & nicely displaying them inline.

## Quick Demo

An embedded github gist, containing some anchor tags:
![iLicon no call demo](https://i.imgur.com/rDuYEhR.png)

After calling `iLicon` with `0` config on the same page:
![iLicon call demo](https://i.imgur.com/GXqnUxp.png)

## Table of Contents

- [iLicon](#ilicon)
  - [Quick Demo](#quick-demo)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Node](#node)
    - [CDN](#cdn)
  - [Usage](#usage)
    - [Options](#options)
    - [Default Styles](#default-styles)
    - [Transformer](#transformer)
  - [Contributing](#contributing)
  - [Future considerations / Potential features](#future-considerations--potential-features)

## Features

Automatically fetches favicons for links and displays them inline. With plenty of configuration options and some potential future features.

## Installation

`iLicon` installation should hopefully be pretty straight forward, but if you run into any issues let me know.

### Node

For usage in bundlers, note that `iLicon` is currently client side only, more info below.

```bash
# npm
npm install ilicon

# yarn
yarn add ilicon

# pnpm
pnpm add ilicon
```

### CDN

```html
<script src="unpkg/jsdelivr link once published"></script>
```

## Usage

The automatic, no-config version of `iLicon` is pretty simple, just import it and call it with no arguments. This will:

- Find all links on the page
- Insert a small favicon of the link in the `href` before the text of each anchor tag

```ts
import { iLicon } from 'ilicon';

...

// Somewhere browser-side:
iLicon({
  // Options
});
```

### Options

**NOTE:** All options are **optional!**

| Option               | Type                                 | Default              | Description                                                                                                                                                                                                                                                        |
| -------------------- | ------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `root`               | `HTMLElement`                        | `document.body`      | The element to start traversal from. By default `iLicon` will search the whole document, but if that's not needed you can set the starting element, from which `iLicon` will search from, including all descendants.                                               |
| `skipIDs`            | `string[]`                           | `undefined`          | An array of strings representing element **IDs** to skip checking links for. Skipping an element will **also skip all descending elements**, so this will likely dramatically improve performance.                                                                 |
| `skipClasses`        | `string[]`                           | `undefined`          | Similar to the above `skipIDs` this is an array of strings representing element **classes** to skip checking links for. Skipping an element will **also skip all descending elements**, so this will likely dramatically improve performance.                      |
| `injectiLiconStyles` | `boolean`                            | `true`               | If `true` will call a funtion injecting a `<style>` tag with about `~10` lines into the page's `<head>` **if it doesn't already exist.** This will not create multiple style tags if called more than once. See [default styles](#default-styles) & classes below. |
| `wrapperClass`       | `string`                             | `ilicon_wrapper`     | Class applied to the wrapping `<a>` tag, used for basic alignment.                                                                                                                                                                                                 |
| `imgClass`           | `string`                             | `ilicon_img`         | Class applied to the generated `<img>` tag, used for sizing & basic alignment.                                                                                                                                                                                     |
| `setIcons`           | `{ domain: string, icon: string }[]` | `undefined`          | An array of objects containing the domain name (ex: google.com) and the specified icon to use for that domain (ex: /some_icon.png or .ico or base64) instead of using duckduckgo's supplied favicon.                                                               |
| `position`           | `'start' \| 'end'`                   | `'start'`            | Decides whether the favicon is inserted before or after the link text.                                                                                                                                                                                             |
| `transformer`        | `Function`                           | `defaultTransformer` | The transformer function, expanded below is what every found anchor element is passed to. This is what takes the anchor tag on the page and spits out the version with a favicon.                                                                                  |
| `target`             | `string[]`                           | `undefined`          | **Experimental.** Instead of the default behavior giving `iLicon` a list of links via the `target` parameter will return the duckduckgo favicon links for all given URLs.                                                                                          |

### Default Styles

<a name="default-styles"></a>

```css
.ilicon_wrapper {
  display: inline-flex;
  align-items: center;
  height: 1cqmax;
}
.ilicon_img {
  width: 100%;
  height: 100%;
  margin: 0 0.25rem;
}
```

### Transformer

This is the current default transformer:

```ts
function defaultTransformer(
  element: HTMLElement,
  url: string,
  pos = 'start',
  wrapperClass = 'ilicon_wrapper',
  imgClass = 'ilicon_img'
) {
  const isAnchor = element.nodeName === 'A';
  if (isAnchor) {
    element.classList.add(wrapperClass);
    const img = document.createElement('img');
    img.classList.add(imgClass);
    img.src = url;
    if (pos === 'start') {
      element.insertAdjacentElement('afterbegin', img);
    } else {
      element.insertAdjacentElement('beforeend', img);
    }
  }
}
```

**Breakdown:**

- `element` is the current anchor tag we're working with
- `url` is the url of the favicon to use (favicons are obtained before transforming anchor tags)
- `pos` is the position of the favicon relative to the anchor tag's text, either `'start'` or `'end'` for before or after respectively
- `wrapperClass` is the class applied to the wrapping `<a>` tag, used for basic alignment
- `imgClass` is the class applied to the generated `<img>` tag, used for sizing & basic alignment
- `isAnchor` is a boolean representing whether the current element is an anchor tag or not
  - This is just a quick check to make sure we're working with an anchor tag, and later on will be used to work with non-anchor tags

If you want to use your own transformer, you can pass it into `iLicon` via the `transformer` option. It will be called with the same arguments as the default transformer, and you can use the default transformer as a reference for how to write your own. Ex:

```ts
iLicon({
  transformer: (element, url, pos, wrapperClass, imgClass) => {
    // Do something with the element
  },
});
```

## Contributing

I've not managed an open-source project before, so I'm not sure what the best way to go about this is. But if you have any suggestions or want to contribute, feel free to open an issue or PR and I'll take a look!

## Future considerations / Potential features

- [ ] Tests
  - Currently just been testing in a browser with the dist but some more formal and automated tests would be nice
- [ ] Add support for links within non anchor tags
- [ ] Add support for links within anchor tags that don't have an href attribute
- [ ] Add support for links within anchor tags that have an href attribute but no value?
- [ ] Fix the cors issue and add an option to 'check' icons before displaying them & fallback to a default icon if they don't exist
- [ ] Async version that does check for the default bad icon from ddg and will swap to google if it doesn't exist
- [ ] Mini version that's the same as normal but won't grab all links, instead will just take an element and link and act on that
  - [ ] This would also cover SSR if I have it just return the resulting element
- [ ] Importable css instead of injected
- [ ] Support relative links
