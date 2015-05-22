# Using ES6 with React

## Getting acquainted

Let's look around first. Some of these files are already filled out for you because they are not the focus of this workshop.

### gulpfile.js

I could spend a whole workshop just talking about builds in JavaScript. Luckily for you, that is not the subject of this workshop. Here we just have a basic build using Browserify and Gulp to package up the app we are about to write all nice and tightly. To be able to be modular, you are either going to have to use either Browserfiy or Webpack; either works well. I just went with Browserify because I have more experience with it.

### index.html & public/style.css

Nothing noteworthy here. We'll be building a index.js using Browserify to stick in `public/` which will be loaded in. Also, here we'll have to do a bit of funny business to font-awesome to work. In *nix environments, it's enough to just to symlink `<project>/node_modules/font-awesome` to `<project>/empty/fa`. If you want to even just copy it there, that works too. So long as font-awesome's whole directory lives at `<project>/empty/fa`.

You'll see I filled out the CSS for you. This isn't a class for CSS so as long as you follow the same class names I'll be using, everything should just be styled automagically for you.

### fake-omdb-client.js

Being that at the conferences I'll presenting don't often have good wifi, this module is a drop in replacement for the npm module `omdb-client` that just pulls in local JSON data and randomly spits it back out at you. If the Internet is working, feel free to just use the normal `omdb-client`. If not, replace every reference of `omdb-client` to `./fake-omdb-client.js`.

### movies.json & netflix.json

Dummy data. netflix.json is also used to populate the base screen with the Netflix Originals.

### baseTemplate.html

This will be used once we get to server-side rendering. Really the only difference is that it has an underscore templating tag in it (more on that later.)

### Other notes

You shouldn't have to create any new files. If you get lost or want to see the completed project, feel free to sneak a a gander at the completed folder. That app should be working as is.

It also bears mentioning that I'm not really going for code organization here, but rather simplicity. Due to the fact this project is pretty limited in scope, it does not make a ton of sense to go into how to organize this project. Plus whatever works for me probably doesn't work for you.

## Getting started

We're not going to be using node/iojs right away. Instead, we're going to just use a simple http server. You could even use the file:/// protocol and that would work just fine. My weapon of choice is node's `http-server .` but you could equally well use php 5.5+ `php -S` and Python's `SimpleHTTPServer`. Run your server, and access it now in the browser.

You should get a red page, taunting you with "not rendered lol." Good, the browser's mocking fuels us. Let's quiet its assholery by rendering the hell out of something.

At this point, feel free to throw on `gulp watch` in the `empty/` in the empty directory. This way our project will continuely rebuild as we go. Otherwise you'll have to `gulp scripts` after every save.

### jsx/index.jsx

```javascript
var React = require('react');

class App extends React.Component {
  render() {
    return(
      <h1>lol nailed it</h1>
    );
  }
}

module.exports = App;
```

About as basic as you can get with React here. We're just creating a basic component and then exporting it for use. Couple of ES6 things worth noting here:

- Yeah, the class syntax. It's not a whole lot more than sugar for putting those methods on the prototype but it is way easier (and cleaner) to write classes. Fits nicely with React.
- No function keyword with the method. You'll notice an overarching theme of ES6 is to never write the word function ever again.
- Though you don't see it yet, when writing classes, you don't follow the various methods with commas. These are not object literals.

### jsx/clientApp.jsx

```javascript
var React = require('react');
var App = require('./index');
React.render(<App />, window.document.querySelector("#target"));
```

- That's it. This file won't change for the rest of the project. So why this file? Why not just do that in the `index.jsx` file? If we weren't doing server-side rendering, it would not be a big deal. However, since we will, we need to be able to separate the construction of the markup and the actual code targeting the DOM. If you're doing server-side rendering, you can't use the `window` or `document` objects anywhere, or at least not without a lot of struggle to do so.
- No, you don't need `window` in `window.document`. Force of habit.
- Okay, let's try. Should do something.

### jsx/index.jsx

```javascript
// start at the top
var preload = require('./netflix');
var _ = require('lodash');
// end at the top

// start in App class
constructor(props) {
  super(props)

  this.state = {
    results: _.clone(preload.Search)
  };
}
// end in App class

// start replace render() in App
render() {
  return (
    <div className="app-container">
      <div className="movies-list">
        {this.state.results.map((el) => {
          return (
            <h1>{el.Title}</h1>
          );
        })}
      </div>
    </div>
  );
}
// end replace render() in App
```

- Sweet! After this we should see the names of ten different Netflix series. Let's talk about what's new here.
- Pulling in preloaded data here from the OMDb database. I chose Netflix because … reasons. Also pulling lodash for not wanting to rewrite already written stuff.
- If you've written any React previously, the ES6 notation does not have a `getInitialState` lifecycle method, instead opting to use the class's constructor. If you do set a constructor, you __must__ call super with the props or React will throw a tantrum. In any case, this is where you set your initial state for your component.
- Notice we have to use `className` instead of `class` for HTML elements. This is due to the fact that 1. className is actually the name of the property of the DOM element and 2. class is already used in JS and they didn't want to overload it.
- Notice the single `{}` in the markup. This is how you tell JSX/React that you're about to give it an expression for it to interpret.
- `.map` should be known; it's from ES5. However, arrow functions are kinda neat. They're another way of writing functions with one important caveat: they immediately bind to whatever context they're in. In this case, we need the `this` in this context to be the React component and not the array (which is typically the context of this when you call map on an array.) For this purpose, it is very similar to having `function() {…}.bind(this)`. Arrow functions just make that shorter (and continue our trend of not writing function anywhere.)

### jsx/MovieContainer.jsx

```javascript
var React = require('react');
var omdb = require('omdb-client');
// var omdb = require('./fake-omdb-client');

class MovieContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {movie:{}};
  }

  componentDidMount() {
    omdb.get({id:this.props.id}, (err, data) => {
      this.setState({movie:data});
    });
  }

  render() {
    return (
      <img src={this.state.movie.Poster} />
    );
  }
}

module.exports = MovieContainer;
```

- Most of note here would be `componentDidMount` method. This method is a React lifecycle method that is called immediately after the component is run for the first time. Why do we make the AJAX call only after the component has rendered? Otherwise you're stuck waiting on AJAX calls that block your page from rendering. This gives you a faster perceived loading time. You can do things like throw up spinners to let people know that work is still being done behind the scenes.
- This is going to throw some 404s because at first img's source is undefined. Obviously not a good idea, but we'll fix it here in a sec.

### index.jsx

```javascript
// start at top with other requires
var MovieContainer = require('./MovieContainer');
// end at top with other requires

// start inside .map of render
return (
  <MovieContainer
    id={el.imdbID}
    key={el.imdbID}
  />
);
// end inside .map of render
```

- Awesome. Should be seeing a bunch of show posters now. If you look at your network tab (and you're not using `fake-omdb-client`) you should see a bunch of network requests. This is obviously a very inefficient way for us to request data; we're doing it this way because we want the movie posters for each movie. In real life, you'd figure out some better way to batch this. No worries, I talked to the owner of OMDb and he says we're cool to make a bunch of requests today to it. I also donated a bit to hopefully offset any costs we incur him.
- Notice we have key as well. React wants to be as efficient as possible. Here we're giving React a unique key so that it knows that when it re-renders, that this is the same object so if it has re-order them, it's not creating and destroying or anything like that, but simply re-arranging existing DOM nodes. Plus if you don't give it a key, it gives you noisy console warnings.

### jsx/MovieTileLayout.jsx

```javascript
var React = require('react');

class MovieTileLayout extends React.Component {

  render() {
    var img = (this.props.Poster && this.props.Poster !== 'N/A') ? this.props.Poster : `public/img/fake${Math.floor(Math.random()*5) + 1}.jpg`
    return (
      <div className="movie-tile">
        <div className="movie-tile__img-container">
          <div className="movie-tile__img" style={{'backgroundImage': `url(${img})`}} />
        </div>
        <div className="movie-tile__info">
          <h1 className="movie-tile__title">{this.props.Title}</h1>
          <h2 className="movie-tile__year">({this.props.Year})</h2>
          <div className="movie-tile__stars">
            STAR
          </div>
        </div>
      </div>
    );

  }

}

module.exports = MovieTileLayout;
```

- Okay, so now we're going to get serious about making our movies look nice. This is the layout we'll be using for the movies. Why are we not putting this markup in `MovieContainer`? You'll see soon but the short answer is that we're separating behavior from presentation which allows you to swap presentation and maintain the same logic.
- Notice we have no constructor. If you're not doing anything with state then you don't have to have it.
- ES6 template strings! So rad. Love them. These are already present in other languages but essentially it allows you to avoid the awful syntax of concatenating strings together. The format is having back-ticks instead of single or double quotes. Inside of these template strings, you can use ${} to denote where you want to put any sort of JavaScript expression. In ours, as you can see, we're putting a random number between 1 and 5.

### jsx/index.jsx

```javascript
// start with other require statements
var MovieTileLayout = require('./MovieTileLayout');
// end with other require statements

// start inside the render function
<MovieContainer
  id={el.imdbID}
  key={el.imdbID}
  layout={MovieTileLayout}
/>
// end inside the render function
```

- Passing the layout down into the movie container. A useful abstraction because we can now pass whatever layout we want the movie container to use!

### jsx/MovieContainer.jsx

```javascript
// replace render function
render() {
  return (
    <this.props.layout
      {...this.state.movie}
    />
  );
}
```

- Couple of cool things here: first is that we're using an 'anonymous component'™ (don't know if they're actually called that.) Something of note is that React expects all custom components to be CaptialCase and all normal tags (like div, span, ul, etc.) to be lowercase, except in this case where we have a period and it's obviously a custom tag.
- We're using the spread operator! While ES6 does have spread operator which is super cool, this is actually the JSX flavor of the spread operator. It takes all the keys and values and passes them down as props. `var x = {y:1,z:2}; comp = <Thing {...x}/>` is equal to `<Thing y={1} z={2} />.
- Try it now. You should have a more informational looking layout. Let's knock out the star ratings real quick.

### jsx/RatingStars.jsx

```javascript
var React = require('react');

class RatingStars extends React.Component {

  render() {
    var filled = Math.floor(this.props.score);
    var hasHalf = this.props.score - filled > .5;
    var empty = this.props.max - filled;

    var stars = [];

    for (var i = 0; i < filled; i++) {
      stars.push(
        <i className="fa fa-star" />
      );
    }
    if (hasHalf) {
      empty--;
      stars.push(
        <i className="fa fa-star-half-o" />
      );
    }
    for (var i = 0; i < empty; i++) {
      stars.push(
        <i className="fa fa-star-o" />
      );
    }
    return (
      <div className="rating-stars">
        {stars.map( (el) => el )}
      </div>
    );
  }

}

module.exports = RatingStars;
```

- Should be straight forward here. We're creating a bunch of star icons (courtesy of Font Awesome,) sticking it in an array, and then rendering the array.
- Perhaps the only novel thing here is the arrow function that has no return statement. Pretty neat little feature here. Because we only have one statement, the return is implicit on the function. So what's really happening, using the old syntax is `function(el) { return el; }`. Cool.
- Let's go implement it in `MovieTileLayout`.

### jsx/MovieTileLayout.jsx

```javascript
// start with other require statements
var RatingStars = require('./RatingStars');
// end with other require statements

// start replace STAR in render
<RatingStars
  max={10}
  score={this.props.imdbRating}
/>
// end replace STAR in render
```

- If you haven't symlinked in font awesome, go do that real quick. From the `empty/` directory, this should do the trick: `ln -s ../node_modules/font-awesome/ fa`. If not, go ahead and just copy (not cut) and paste the font-awesome directory from node_modules directory.
- I get asked occasionally of why I have that funny spacing on tags, and using new lines. It is so much easier to read when you have twenty props you're passing down (of which there are times there are legitimate reasons to do so.) So I just always do it.
- Take a look, you should see some star ratings using stars. Cool!
- That's it for the tile layout. Let's start working for the ability to swap layouts to a more list-like approach, but first we need a header to put the control to swap the layout.

## Swapping layouts

### jsx/Header.jsx

```javascript
var React = require('react');

class Header extends React.Component {
  render() {
    return (
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-header__title">Fluentflix</h1>
          <select value={this.props.layout} className="app-header__display-select">
            <option value="tile">Tile</option>
            <option value="list">List</option>
          </select>
        </div>
      </header>
    );
  }
}

module.exports = Header;
```

- Here we're giving the value of this.props to the select. This way you know it will always reflect what it's given via props. *Note:* this is not two-way data binding. You must explicitly handle the events. We'll see what that means here in a sec.

### jsx/index.jsx

```javascript
// start with other requires
var Header = require('./Header');
// end with other requires

// start in render function, in .app-container, before .movies-list
<Header
  layout={this.state.layout}
/>
// end in render function, in .app-container, before .movies-list

// start in constructor, replace state declaration
this.state = {
  layout: 'tile',
  results: _.clone(preload.Search, true)
};
// end in constructor, replace state declaration
```

- Should all look familiar to you. The only thing worth noting is go ahead and try to change the select to be List instead of Tile. It shouldn't work. That's because we haven't given React the way to change its internal data to respond to user input. We need to do a little bit of event handling before that works. Otherwise it all should look familiar! Let's keep going.

### jsx/Header.jsx

```javascript
// start method inside Header class
handleLayoutEvent(e) {
  this.props.changeLayout(e.target.value);
}
// end method inside Header class

// start replace <select></select> inside render method
<select value={this.props.layout} onChange={this.handleLayoutEvent.bind(this)} className="app-header__display-select">
  <option value="tile">Tile</option>
  <option value="list">List</option>
</select>
// end replace <select></select> inside render method
```

- Here you see a few commonly observed patterns in React. First is handling events. It should feel familiar even if you haven't used React before. You declare on the pertitent markup an event handler for a type of event (onClick, onChange, onSubmit, etc.) that maps to an event handler.
- A bit of Brian Holt Advice: always handle in the same component and then in the handlers call out to the parent methods. This inherently makes the parents not tied to events and makes them re-useable programatically without doing anything lame like mocking events.
- If you're familiar with React, you may be curious about the `.bind(this)` on the event handler. React used to do auto-binding of the context for you… sometimes. Most of the time. They no longer do it because the times they didn't autobind for you was really, really confusing. Instead they're making you bind it yourself every time so hopefully you just get in the habit.
- We're observing another common pattern here: passing callbacks from the parent to the child so that the child can modify the parent's state. This is what I really like about React: one-way data flow. If that layout variable is ever wrong and you need to debug it, you know that it _must_ be in that changeLayout function. If you've ever debugged a medium-to-large Angular 1.X app, you know that if you're not fairly disciplined about writing, finding out where data is modified can be a serious chore.
- Let's go add that handler in index.

### jsx/index.jsx

```javascript
// start method in App
changeLayout(layout) {
  this.setState({layout:layout});
}
// end method in App

// start replace <Header/>
<Header
  layout={this.state.layout}
  changeLayout={this.changeLayout.bind(this)}
/>
// end replace <Header/>
```

- Adding the correct method in and then passing it down. Notice we're also binding the correct context too; that wasn't necessary in the previous version of React but it is here!
- Give it a try; now you should be able to change the drop down. You won't see it do anything yet but it is modifying the internal state. If you have the Chrome extension for React, you can investigate the internal state and see it change. Let's go add the next context to see what that looks like.

### jsx/MovieListLayout.jsx

```javascript
var React = require('react');
var RatingStars = require('./RatingStars');

class MovieListLayout extends React.Component {

  render() {
    var img = (this.props.Poster && this.props.Poster !== 'N/A') ? this.props.Poster : `public/img/fake${Math.floor(Math.random()*5) + 1}.jpg`
    return (
      <div className="movie-row">
        <div className="movie-row__img-container">
          <div className="movie-row__img" style={{'backgroundImage': `url(${img})`}} />
        </div>
        <div className="movie-row__info">
          <h1 className="movie-row__title">{this.props.Title}</h1>
          <h2 className="movie-row__year">({this.props.Year})</h2>
        </div>
        <div className="movie-row__desc">
          {this.props.Plot}
        </div>
        <RatingStars
          max={10}
          score={this.props.imdbRating}
        />
      </div>
    );
  }

}

module.exports = MovieListLayout;
```

- Nothing here should look unfamiliar. We're using the `Plot` too in this layout for a little more detail, but otherwise it's just structural and class name changes from the Tile layout. Presenting the same info differently.

### jsx/index.jsx

```javascript
// start with other requires
var MovieListLayout = require('./MovieListLayout');
// end with other requires

// start in render before return
var layout;
if (this.state.layout === 'tile') {
  layout = MovieTileLayout;
}
else {
  layout = MovieListLayout;
}
// end in render before return

// start replace <MovieContainer/>
<MovieContainer
  id={el.imdbID}
  key={el.imdbID}
  layout={layout}
/>
// end replace <MovieContainer />
```

- Nothing here should be groundbreaking, but the effect is really cool. Go to the app and change the dropdown to be list. Everything should change to be a list layout instead. This is what so cool about the container/layout paradigm! We didn't have have to add any additional behavior to MovieListLayout: it's able to share that retrieving of data with MovieTileLayout. Hopefully you can imagine some applications of this. Go beyond even just thinking about changing the layout of the list: imagine if we had another page entirely that was just details of one movie/show; we could totally reuse MovieContainer then too. If we had some way to submit our own rating to OMDb, that could live in MovieContainer. There's a lot of ways to get creative with it! Pretty exciting.

## Search

This is a section in large part to show that once the foundation is in place, it's really easy to make high-level changes. We're going to add the ability to search for other titles. Let's start with a header search box.

### jsx/Header.jsx

```javascript
// start method in Header
constructor(props) {
  super(props);

  this.state = {
    term: ""
  };
}
// end method in Header

// start right after <select></select>
<form>
  <input value={this.state.term} className="app-header__search" type="text" placeholder="Search" />
</form>
// end right after <select></select>
```

- This should get the input on the page. We're putting it in a form and you'll see in a sec why, but it's so we can listen on submit events.
- You should now have an input box that you cannot type in! Yay! This is the same issue we saw with the drop down. Let's fix it.

```javascript
// start method on Header
handleTermEvent(e) {
  this.setState({term:e.target.value});
}
// end method on Header

// start replace input
<input value={this.state.term} onChange={this.handleTermEvent.bind(this)} className="app-header__search" type="text" placeholder="Search" />
// end replace input
```

- You can type now. Neat. Let's use it as a search term now.

### jsx/index.jsx

```javascript
// start with other requires
var omdb = require('omdb-client');
// var omdb = require('./fake-omdb-client');
// end with other requires

// start initial state declaration in constructor – replace
this.state = {
  layout: 'list',
  results: _.clone(preload.Search, true),
  term: ""
};
// end initial state declaration in constructor – replace

// start App method
search(term) {
  this.setState({term:term});
  omdb.search({query:term}, (err, data) => {
    this.setState({results: data.Search});
  });
}
// end App method

// start replace <Header/>
<Header
  changeLayout={this.changeLayout.bind(this)}
  layout={this.state.layout}
  term={this.state.term}
  search={this.search.bind(this)}
/>
// end replace <Header/>
```

- You'll need to pull in the API client here. Pull whatever one in you're using (offline or online.)
- Notice we have two `term`s we're addressing here. If it's clearer to you, you can name them differently. One refers to the term that the parent is using to make queries, and one refers to the internal state of the input, and are not intended to be kept in sync. We don't want React to re-search on every key press. Which brings me to a tangent: never try to sync states across components. They will inevitably fall out of sync. A great programming practice is to always have one single source of truth for every fact you need to track in your app.

### jsx/Header.jsx

```javascript
// start Header method
handleTermSubmit(e) {
  e.preventDefault();

  this.props.search(this.state.term);
  this.setState({term: ""});
}
// end Header method

// start replace <form></form>
<form onSubmit={this.handleTermSubmit.bind(this)}>
  <input value={this.state.term} onChange={this.handleTermEvent.bind(this)} className="app-header__search" type="text" placeholder="Search" />
</form>
// end replace <form></form>
```

- Should work now! Try searching for "Tron" or something. You'll notice that some of the pictures aren't great, and other ones are pulling in fake posters that act as placeholders.
- We're listening for the onSubmit so we can capture the user hit return. We also need to prevent the form from submitting, hence the `.preventDefault()`
- Cool, let's add a meaningful way to clear your search.

```javascript
// start Header method
handleClearEvent(e) {
  this.props.clearTerm();
}
// end Header method

// start in render before return
var searchBox;
if (this.props.term) {
  searchBox = (
    <h3 className="app-header__term">
      {this.props.term} <a onClick={this.handleClearEvent.bind(this)} href='#'><i className="fa fa-times"/></a>
    </h3>
  );
}
else {
  searchBox = (
    <form onSubmit={this.handleTermSubmit.bind(this)}>
      <input value={this.state.term} onChange={this.handleTermEvent.bind(this)} className="app-header__search" type="text" placeholder="Search" />
    </form>
  );
}
// end in render before return

// start replace <form></form> in render
{searchBox}
// end replace <form></form> in render
```

- This hopefully shows you a little bit of how to do conditionals in React. It's a little clunky in my opinion; I wish there was a more declarative, expressive way to do it but for now this works.
- Let's go wire up the parent method.

### jsx/index.jsx

```javascript
// start App method
clearTerm() {
  this.setState({term:"", results: _.clone(preload.Search, true)});
}
// end App method

// start replace <Header/>
<Header
  changeLayout={this.changeLayout.bind(this)}
  layout={this.state.layout}
  term={this.state.term}
  search={this.search.bind(this)}
  clearTerm={this.clearTerm.bind(this)}
/>
// end replace <Header/>
```

## Server-side rendering

Hooray! The client app is done. You have now written a fairly representative React app. We've left out routing and Flux but neither one pose the same learning curve that React initially does.

Now we're going to get in to using iojs (or node) to do some server-side pre-rendering of the app. Let's start filling it out. Cancel your http-server.

### app.js (not in jsx/)

```javascript
require("babel/register");

var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var mount = require('koa-mount');
var React = require('react');
var _ = require('lodash');
var fs = require('fs');

var baseTemplate = fs.readFileSync('./baseTemplate.html');
var ClientApp = require('./jsx/index.jsx');

var app = koa();

app.use(mount('/fa', serve('../node_modules/font-awesome')));
app.use(mount('/public', serve('./public')));

app.use(route.get('/', function *() {
  var rendered = React.renderToString(React.createElement(ClientApp));
  this.body = _.template(baseTemplate)({body:rendered});
}));

app.listen(3000);
```

- Kinda going all-in at once, since it doesn't really work without all the parts and this isn't a server-side JS workshop so I'm not going to explain the ins and outs of it.
- The `require('babel/register')` at the top is so we can require JSX and ES6 type files in node without blowing up the server. It makes babel run on every incoming required file.
- We're using koa but this code would nearly work as is with Express. For those who don't know koa, it's written by the same guy who did Express, TJ Holowaychuck, and functions very similarly, only it uses ES6 generators instead of callbacks for its middleware. It's super cool and really simple to use.
- We read in a basic lodash template (`basicTemplate.html`) and use that with lodash to stick the markup we're about to render there. There are a few ways to go about doing this but I've found this to be the simplest.
- We're also taking advantage of koa's static and mount modules to get our font-awesome and CSS/JS files mounted in the correct places. Static just serves every file in that directory with the proper headers (kinda like how PHP servers can do it) and mount just mounts whatever middleware's action that follows it to that URL. Pretty cool.
- Inside the get method we use React's `renderToString` method to get React to spit out its first render. Notice that the componentDidMount method will not run yet because it actually hasn't mounted on the DOM yet. So we won't see the movies yet as those APIs will be made on the client. If you want those to show, you need to get a bit more fancy about it but we're not going to do so here.
- You can take this a lot of places. Our page is pretty ugly because we don't have a lot of good data without calling out to the API so you can give it better place holders or spinners to let people know it's loading. You can also take this markup (because right now the initial markup won't change unless we change it ourselves) and stick it in the cache and always serve that instead of making React doing it on every request. All beyond the scope of the class but things you should be thinking about for your apps.
- So let's give it a shot. Run `node app.js` from the CLI to see if it starts up. It should be listening on port 3000. Notice the header is there and you'll likely also see the other posters this time before it renders (they were there before too, they just usually get rendered out before you saw them.)
- Also note that React may yell at you for the random numbers generated for the placeholder images. You probably shouldn't use random numbers; you should use some sort of action that will reliably give you the same sequence of answers every time.

## Fin

That's it! You should have a React with ES6 app working that is getting server-side pre-rendered! Hooray!
