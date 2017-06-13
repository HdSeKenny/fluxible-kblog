import React from 'react';
import PropTypes from 'prop-types';
import { MainSliders, FullScreen } from './UI';
import { BlogActions, UserActions } from '../actions';
import { Navbar, Footer } from './UserControls';

export default class App extends React.Component {

  static displayName = 'App';

  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.object
  };

  static fetchData = (context, params, query, done) => {
    Promise.all([
      context.executeAction(UserActions.LoadUsers, params),
      context.executeAction(BlogActions.LoadBlogs, params)
    ]).then(() => {
      done();
    });
  };

  render() {
    const route = this.props.location.pathname;
    const child = React.cloneElement(this.props.children);
    const showMainSliders = child.type.displayName === 'Home';
    return (
      <FullScreen id="app">
        <Navbar route={route} />
        {showMainSliders && <MainSliders />}
        <div className="content-pages">
          {child}
        </div>
        <Footer />
      </FullScreen>
    );
  }
}
