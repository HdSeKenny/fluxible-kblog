/* eslint-disable all, camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { routerShape } from 'react-router';
import { sweetAlert, format, jsUtils, env } from '../../utils';
import { Row, Col } from './Layout';
import { BlogActions } from '../../actions';
import { UserStore, BlogStore } from '../../stores';

export default class PinItem extends React.Component {

  static displayName = 'PinItem';

  static contextTypes = {
    router: routerShape.isRequired,
    executeAction: PropTypes.func
  };

  static propTypes = {
    pin: PropTypes.object,
    index: PropTypes.number,
    onSelect: PropTypes.func,
    currentUser: PropTypes.object,
    disabledClick: PropTypes.bool,
    specialClass: PropTypes.string,
    showImage: PropTypes.bool,
    readMore: PropTypes.bool
  };

  static statics = {
    storeListeners: [UserStore, BlogStore]
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser
    };
  }

  goToUserCenter(author) {
    $('#pinModal').modal('hide');
    this.context.router.push(`/${author.username}`);
  }

  goToArticlePage(pin) {
    this.context.router.push(`/${pin.id_str}/details`);
  }

  onViewPinItem() {
    const { pin } = this.props;
    this.props.onSelect(pin.id_str);
  }

  pinTextActions(pin) {
    const isMoment = pin.type !== 'article';
    if (this.props.disabledClick) {
      return;
    }

    if (isMoment) {
      this.onViewPinItem();
    }
    else {
      this.goToArticlePage(pin);
    }
  }

  checkCurrentUser() {
    sweetAlert.alertWarningMessage('Login first !');
  }

  cancelThumbsUpBlog(currentUserId, blogId) {
    this.context.executeAction(BlogActions.CancelThumbsUpBlog, { currentUserId, blogId });
  }

  thumbsUpBlog(currentUserId, blogId) {
    this.context.executeAction(BlogActions.ThumbsUpBlog, { currentUserId, blogId });
  }

  onAddAndCancelThumbs(currentUser, blog, isThumbedUp) {
    if (!currentUser) {
      this.checkCurrentUser();
      return;
    }
    if (isThumbedUp) {
      this.cancelThumbsUpBlog(currentUser.id_str, blog.id_str);
    }
    else {
      this.thumbsUpBlog(currentUser.id_str, blog.id_str);
    }
  }

  preloadPintemImage(url) {
    // eslint-disable-next-line
    const newImage = new Image();
    newImage.src = url;
  }

  _renderPinitemImage(pin) {
    const imageUrls = pin.images;
    const displayImgUrl = imageUrls[0];
    if (env.is_client) this.preloadPintemImage(displayImgUrl);
    return (
      <div className="pin-image" onClick={() => this.pinTextActions(pin)}>
        <img src={displayImgUrl} alt="pin-bc" />
      </div>
    );
  }

  _renderPinUserInfo(pin) {
    const { author, created_at } = pin;
    const { image_url, firstName, lastName, username } = author;
    const fromNow = format.fromNow(created_at);
    return (
      <div className="pin-header">
        <div className="pin-moment-user">
          <span className="user-img pull-left mr-10" onClick={() => this.goToUserCenter(author)}>
            <img alt="pin" src={image_url} />
          </span>
          <div className="author">
            <span className="name" onClick={() => this.goToUserCenter(author)}>{firstName} {lastName}</span>
            <small className="from-now fr">{fromNow}</small>
          </div>
          <p className="text-muted text-xs mt-5">{username}</p>
        </div>
      </div>
    );
  }

  _renderTextPin(pin, readMore) {
    const isArticle = pin.type === 'article';
    return (
      <div className="pin-body-text mt-5" onClick={() => this.pinTextActions(pin)}>
        {isArticle && <h3 className="pin-article-title m-0 mb-5">{pin.title}</h3>}
        {this._renderDisplayNumberText(pin, readMore, isArticle)}
      </div>
    );
  }

  _renderDisplayNumberText(pin, readMore, isArticle) {
    const display40Text = jsUtils.shorten(pin.text, 40);
    const display70Text = jsUtils.shorten(pin.text, 70);
    if (isArticle) {
      if (readMore) {
        return <p className="article">{display40Text}</p>;
      }
      else {
        return <p className="moment">{display70Text}</p>;
      }
    }
    else if (readMore) {
      return <p className="moment">{display70Text}</p>;
    }
    else {
      return <p className="moment">{pin.text}</p>;
    }
  }

  _renderPinFooterIcons(pin) {
    const { currentUser } = this.state;
    const { likers, comments } = pin;
    const isThumbedUp = currentUser ? likers.includes(currentUser.id_str) : false;
    const faThumbsIcon = isThumbedUp ? 'fa fa-thumbs-up' : 'fa fa-thumbs-o-up';
    const thumbsUpBallon = isThumbedUp ? 'cancel this?' : 'thumbs up!';
    return (
      <Row className="pin-footer-icons">
        <Col size="3 p-0"></Col>
        <Col size="9 p-0 tar">
          <div
            className="icon-span"
            data-balloon="share!"
            data-balloon-pos="top">
            <i className="fa fa-share-square-o" />
            <span className="ml-5">0</span>
          </div>
          <div
            className="icon-span"
            onClick={() => this.pinTextActions(pin)}
            data-balloon="add comment!"
            data-balloon-pos="top">
            <i className="fa fa-comments-o" />
            <span className="ml-5">{comments.length}</span>
          </div>
          <div
            className="icon-span"
            onClick={() => this.onAddAndCancelThumbs(currentUser, pin, isThumbedUp)}
            data-balloon={thumbsUpBallon}
            data-balloon-pos="top">
            <i className={faThumbsIcon} />
            <span className="ml-5">{likers.length}</span>
          </div>
        </Col>
      </Row>
    );
  }

  _renderPinitemContent(pin, showImage, readMore) {
    return (
      <div className="">
        {showImage && <Row className="mb-15">{this._renderPinitemImage(pin)}</Row>}
        <Row className="mb-10">{this._renderPinUserInfo(pin)}</Row>
        <Row className="mb-10">{this._renderTextPin(pin, readMore)}</Row>
        <Row className="">{this._renderPinFooterIcons(pin)}</Row>
      </div>
    );
  }

  render() {
    const { pin, showImage, specialClass, readMore } = this.props;
    const pinStyle = specialClass ? `pin ${specialClass}` : 'pin';
    return (
      <div className={`${pinStyle}${readMore ? ' mb-20' : ' mb-10'}`}>
        <div className="pin-body p-0">{this._renderPinitemContent(pin, showImage, readMore)}</div>
      </div>
    );
  }
}
