import React from 'react';
import PropTypes from 'prop-types';

/**
 * build general structure of whole app
 * <link href="http://localhost:3000/favicon.ico?v=2" rel="icon" />
 * <link href="http://fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" />
 * <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,400italic,500,600,700" rel="stylesheet" />
 * link href="http://fonts.googleapis.com/css?family=Roboto%3A700%2C300" rel="stylesheet" property="stylesheet" media="all" />
 */
export default class Html extends React.Component {

  static displayName = 'Html';

  static propTypes = {
    assets: PropTypes.object,
    exposed: PropTypes.string,
    markup: PropTypes.string
  };

  render() {
    const { assets, markup, exposed } = this.props;
    const { style, main, common, essentials } = assets;
    const markupHtml = { __html: markup };
    const exposedHtml = { __html: exposed };
    const stylesheets = [
      '/css/font-awesome.min.css',
      '/css/sweetalert2.min.css',
      '/css/slim.min.css',
      '/css/emoji.css',
      '/slick/slick.min.css',
      '/slick/slick-theme.min.css',
      style
    ];

    const scripts = [
      '/js/jquery.min.js',
      '/js/bootstrap.min.js'
    ];

    return (
      <html lang="en" className="no-js">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <title>Sweeter</title>
          <meta name="author" content="Kenny" />
          <meta name="viewport" content="width=device-width,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, initial-scale=1" />
          {stylesheets.map(styleUrl => <link key={styleUrl} href={styleUrl} rel="stylesheet" />)}
          {scripts.map(scriptUrl => <script key={scriptUrl} src={scriptUrl} />)}
        </head>
        <body>
          <div className="loading"><div className="loader"></div></div>
          <div id="main" dangerouslySetInnerHTML={markupHtml}></div>

          <script dangerouslySetInnerHTML={exposedHtml}></script>
          <script src={common}></script>
          <script src={main}></script>
          <script src="/js/sweetalert2.min.js"></script>
          {essentials && <script src={essentials}></script>}
        </body>
      </html>
    );
  }
}
