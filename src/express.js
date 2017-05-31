import express from 'express';
import session from 'express-session';
import useragent from 'express-useragent';
import connectMongo from 'connect-mongo';
import path from 'path';
import cors from 'cors';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import serialize from 'serialize-javascript';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
// import './polyfills';
import createRoutes from './routes';
import fetchData from './utils/fetchData';
import app from './app';
import CustomFluxibleComponent from './components/CustomFluxibleComponent';
import { blogs as BlogService, users as UserService, comments as CommentService } from './services';
import Html from './components/Html';
import config from './configs';
import assets from './utils/assets';
import serverConfig from './configs/server';
import htmlToPdf from './plugins/pdfDownloader/HtmlToPdf';

export default (server) => {
  const env = server.get('env');

  // view engine setup
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'pug');

  if (serverConfig.server.logEnable && env !== 'production') {
    // server.use(morgan(':date[iso] :method :url :status :response-time ms'));
    server.use(morgan(':method :url :status :response-time ms'));
  }
  if (env === 'development') {
    server.use(express.static(path.join(serverConfig.server.root, '.tmp')));
  }

  // limit size of json object less than 20M for extracting metadata
  server.use(bodyParser.json({ limit: '20mb' }));

  // limit size of json object less than 20M for extracting metadata
  server.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
  server.use(cookieParser());
  server.use(favicon(`${__dirname}/public/styles/images/favicon.ico`));
  server.use(cors());
  server.use(`${config.path_prefix}/`, express.static(path.join(__dirname, 'public')));
  server.use(useragent.express());

  const MongoStore = connectMongo(session);
  server.use(session({
    secret: 'secret',
    store: new MongoStore(serverConfig.mongo.session),
    resave: false,
    saveUninitialized: false
  }));

  const fetchrPlugin = app.getPlugin('FetchrPlugin');
  // fetchrPlugin.registerService(LanguageService);
  fetchrPlugin.registerService(BlogService);
  fetchrPlugin.registerService(UserService);
  fetchrPlugin.registerService(CommentService);

  server.use('/api/upload', require('./plugins/upload'));
  server.use('/api/download', htmlToPdf);
  server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());
  server.use((req, res) => {
    const context = app.createContext({
      req,
      res,
      config,
      authenticated: req.session.user && req.session.user.authenticated
    });
    const routes = createRoutes(context);

    match({ routes, location: req.url }, (error, redirectLocation, routerState) => {
      if (error) {
        res.send(500, error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (routerState) {
        fetchData(context, routerState, (err) => {
          if (err) { throw err; }
          const exposed = `window.__DATA__=${serialize(app.dehydrate(context))}`;
          const doctype = '<!DOCTYPE html>';
          const markup = renderToString(React.createElement(
            CustomFluxibleComponent, { context: context.getComponentContext() }, <RouterContext {...routerState} />
          ));
          const html = renderToStaticMarkup(<Html assets={assets} markup={markup} exposed={exposed} />);

          res.send(doctype + html);
        });
      }
      else {
        res.send(404, 'Not found');
      }
    });
  });
};
