# Licon

A small package for fetching site favicons & nicely displaying them inline.

[Test Links](https://gist.github.com/DanteASC4/11dcfaf81a8f8cd2717b24e799aeb0bd)

## Features

...

## Installation

...

## Usage

...

## License

...

## Contributing

...

## Future considerations / Potential features

- [ ] Add support for links within non anchor tags
- [ ] Add support for links within anchor tags that don't have an href attribute
- [ ] Add support for links within anchor tags that have an href attribute but no value?
- [ ] Fix the cors issue and add an option to 'check' icons before displaying them & fallback to a default icon if they don't exist
- [ ] Async version that does check for the default bad icon from ddg and will swap to google if it doesn't exist
- [ ] Mini version that's the same as normal but won't grab all links, instead will just take an element and link and act on that
  - [ ] This would also cover SSR if I have it just return the resulting element
- [ ] Importable css instead of injected