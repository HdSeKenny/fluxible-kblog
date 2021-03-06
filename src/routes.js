import React from 'react';
import { Route, IndexRoute, History } from 'react-router';
import config from './configs';
import Mode from './configs/mode';
import env from './utils/env';
import { UserActions, BlogActions } from './actions';
import { UserFollows, UserPhotos } from './components/Users';
import {
  App,
  NotFound,
  Home,
  AddBlog,
  Details,
  UserHome,
  UserBlogs,
  UserInfo,
  ChangePassword,
  UserMore,
  UserMessages,
  UserMoments,
  About,
  Signup
} from './components';

const path = config.path_prefix === '' ? '/' : config.path_prefix;

const createRoutes = (context) => {
  const requireLogin = (nextState, replace, cb) => {
    // do nothing for public visists
    if (Mode.isPublic) {
      return cb();
    }

    // only load session to store on server side for isNotPublic visits
    if (env.is_server) {
      context.executeAction(UserActions.LoadKennyUser)
        .then(() => cb());
      context.executeAction(UserActions.LoadSessionUser)
        .then(() => cb());
    } else {
      // if (state.location.pathname !== nextState.location.pathname) {
      //   context.executeAction(UserActions.LoadKennyUser)
      //   .then(() => cb());
      //   context.executeAction(UserActions.LoadSessionUser)
      //     .then(() => cb());
      // } else {
        cb();
      // }
    }
  };

  const onRouterChange = (state, nextState, replace, callback) => {
    $('.loading').removeClass('hide');
    if (state.location.pathname !== nextState.location.pathname) {
      setTimeout(() => {
        callback();
      }, 300);
    } else {
      callback();
    }
  };

  return (
    <Route history={History} component={App} path={path} onEnter={requireLogin} onChange={onRouterChange}>
      <IndexRoute component={Home} />
      <Route path="/" component={Home} />
      <Route path="signup" component={Signup} />
      <Route path="about" component={About} />

      <Route path=":blogId/details" component={Details} />
      <Route path=":username" component={UserHome} >
        <IndexRoute component={UserMoments} />
        <Route path="mine" component={UserBlogs} />
        <Route path="create" component={AddBlog} />
      </Route>

      <Route path=":username/Personal" component={UserInfo} />
      <Route path=":username/changepassword" component={ChangePassword} />

      <Route path=":username/more" component={UserMore} />
      <Route path=":username/messages" component={UserMessages} />
      <Route path=":username/follows" component={UserFollows} />
      <Route path=":username/photos" component={UserPhotos} />

      <Route path="*" component={NotFound} />
    </Route>
  );
};

module.exports = createRoutes;
