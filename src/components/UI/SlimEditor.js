/*
 * Slim v4.6.3 - Image Cropping Made Easy
 * Copyright (c) 2017 Rik Schennink - http://slimimagecropper.com
 */
// Necessary React Modules
import React from 'react';
import ReactDOM from 'react-dom';

// Slim (place slim CSS and module js file in same folder as this file)
import { Slim } from '../../plugins';

// React Component
export default class SlimEditor extends React.Component {

  static propTypes = {
    children: React.PropTypes.object
  };

  componentDidMount() {
    this.instance = Slim ? Slim.create(ReactDOM.findDOMNode(this), this.props) : null;
  }

  render() {
    console.log(this.props.children);
    return <div className="slim" >{this.props.children}</div>;
  }
}
