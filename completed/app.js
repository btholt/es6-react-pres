import koa from 'koa';
import route from 'koa-route';
import serve from 'koa-static';
import mount from 'koa-mount';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
import fs from 'fs';
import ClientApp from './jsx/index.jsx';

const baseTemplate = fs.readFileSync('./baseTemplate.html');
const templateFn = _.template(baseTemplate);
const PORT = 3000;

const app = koa();

app.use(mount('/fa', serve('../node_modules/font-awesome')));
app.use(mount('/public', serve('./public')));
app.use(mount('/statics', serve('../statics')));

app.use(route.get('/', function *() {
  const rendered = ReactDOMServer.renderToString(React.createElement(ClientApp));
  this.body = templateFn({body:rendered});
}));

console.log('listening on port', PORT)
app.listen(PORT);
