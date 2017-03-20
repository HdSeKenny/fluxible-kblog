import React from 'react';

/**
 * build general structure of whole app
 * <link href="http://localhost:3000/favicon.ico?v=2" rel="icon" />
 * <script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
 * <link href="/styles/css/navbar/skins/menuzord-shadow.css" rel="stylesheet" type="text/css"/>
 * <script src="/styles/js/jquery.sticky.js"></script>
 * <script src="/styles/js/menuzord.js"></script>
 * <link href="/styles/css/admin-less/react-admin.min.css" rel="stylesheet" />
 */
export default React.createClass({

  displayName: 'Html',

  propTypes: {
    assets: React.PropTypes.object,
    exposed: React.PropTypes.string,
    markup: React.PropTypes.string
  },

  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Kenny"s Blog</title>
          <meta name="viewport" content="width=device-width,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, initial-scale=1" />
          <link href="/styles/main.css" rel="stylesheet" />
          <link href="/styles/css/navbar/font-awesome.css" rel="stylesheet" />
          <link href="/styles/css/navbar/menuzord.css" rel="stylesheet" />
          <link href="/styles/blog.css" rel="stylesheet" />
          <link href="/styles/sweetalert/sweetalert.css" rel="stylesheet" />
        </head>
        <body>
          <div id="main" dangerouslySetInnerHTML={{ __html: this.props.markup }}></div>
          <script dangerouslySetInnerHTML={{ __html: this.props.exposed }}></script>
          <script src={this.props.assets.common}></script>
          <script src={this.props.assets.main}></script>
          <script src="/styles/sweetalert/sweetalert.min.js"></script>
          {this.props.assets.essentials && (<script src={this.props.assets.essentials}></script>)}
        </body>
      </html>
    );
  }
});
