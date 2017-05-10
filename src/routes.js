import React from 'react';
import { Route, IndexRoute, History } from 'react-router';
import config from './configs';
import Mode from './utils/mode';
import env from './utils/env';
import { UserActions } from './actions';
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
  UserFollows,
  List
} from './components';

const path = config.path_prefix === '' ? '/' : config.path_prefix;
const { isPublic } = Mode;

const createRoutes = (context) => {
  const requireLogin = (nextState, replace, cb) => {
    // do nothing for public visists
    if (isPublic) {
      cb();
      return;
    }

    // only load session to store on server side for isNotPublic visits
    if (env.SERVER) {
      context.executeAction(UserActions.LoadKennyUser).then(() => {
        cb();
      });

      context.executeAction(UserActions.LoadSessionUser).then(() => {
        cb();
      });
    } else {
      cb();
    }
  };

  return (
    <Route history={History} component={App} path={path} onEnter={requireLogin}>
      <IndexRoute component={Home} />
      <Route path="/" component={Home} />
      <Route path="list" component={List} />

      <Route path=":blogId/details" component={Details} />
      <Route path=":user/home" component={UserHome} />
      <Route path=":user/list" component={UserBlogs} />
      <Route path=":user/add" component={AddBlog} />
      <Route path=":user/info" component={UserInfo} />
      <Route path=":user/change-password" component={ChangePassword} />

      <Route path="user-more/:userId" component={UserMore} />
      <Route path="user-messages/:userId" component={UserMessages} />
      <Route path="user-follows/:userId" component={UserFollows} />

      <Route path="*" component={NotFound} />
    </Route>
  );
};

module.exports = createRoutes;
