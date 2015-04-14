# Using ES6 with React

---

## Summary

The point of this presentation is to:

- Teach you React. It assumes no prior knowledge.
- Teach you JSX. It makes writing React so much more pleasant.
- Teach you (some) ES6. This presentation only assumes ES5 familiarity.
- Teach you React with ES6. It shows you the newer paradigm of coding React using ES6 classes.
- Teach you server-side rendering on React using Koa.
- **Not** teach you Flux. We won't be going over it during this workshop.

## Presented at:

- [FluentConf](http://fluentconf.com/javascript-html-2015/public/schedule/speaker/163080)
- [OSCON](http://www.oscon.com/open-source-2015/public/schedule/detail/42482)

## "Conference WiFi Mode"

WiFi at conferences is notoriously :shit:ty. This presentation is made with that in mind. In order to switch to offline mode (which doesn't really on the omdb API but instead serves dummy data) change all references of `var omdb = require('omdb-client');` to `var omdb = require('./fake-omdb-client');`. You may also have to mess with the paths to images a bit. I intend to fix that.

## OMDB

The example app makes use of the [OMDB API](http://www.omdbapi.com/). I'd encourage you to [donate](https://www.paypal.com/us/cgi-bin/webscr?cmd=_flow&SESSION=kJkypD7V20wEXHjaMvIev-FO98n9ar828jANAN2wDizKaeG_MfF-21yB2iK&dispatch=5885d80a13c0db1f8e263663d3faee8d96f000117187ac9edec8a65b311f447e) to this cool project. I have (or will have before I present this for the first time.)

## License

The project includes some images and info from [Netflix](http://www.netflix.com) shows that retain their original licenses. It also depends on varying projects that also retain their own licenses. For whatever code I have written, or whatever code that others commit and are merged into the project, are released under the MIT license.

## Project Author

[Brian Holt](http://twitter.com/holtbt)