import React from 'react';
import { Link } from 'react-router';
import { Button, Glyphicon } from 'react-bootstrap';
import FluxibleMixin from 'fluxible-addons-react/FluxibleMixin';
import { sweetAlert, format } from '../../utils';
import UserBar from './UserBar';
import { BlogActions } from '../../actions';
import { UserStore, BlogStore } from '../../stores';
import { UserBlogsNav } from '../UserNavs';
import { BlogsWell } from '../UI';
import { BlogEditor } from '../UserControls';

const UserBlogs = React.createClass({

  displayName: 'UserBlogs',

  contextTypes: {
    executeAction: React.PropTypes.func
  },

  propTypes: {
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [BlogStore, UserStore]
  },

  getInitialState() {
    return this.getStatesFromStores();
  },

  getStatesFromStores() {
    const { username } = this.props.params;
    const userStore = this.getStore(UserStore);
    const blogStore = this.getStore(BlogStore);
    const user = userStore.getUserByUsername(username);
    return {
      currentUser: userStore.getCurrentUser(),
      user,
      currentBlog: blogStore.getCurrentBlog(),
      // deletedBlog: blogStore.getDeletedBlog(),
      isUpdated: blogStore.getIsUpdated(),
      isCurrentUser: userStore.isCurrentUser(username),
      displayBlogs: blogStore.getBlogsByUserId(user.id_str)
    };
  },

  onChange(res) {
    const { currentUser } = this.state;
    const { username } = this.props.params;
    if (res.msg === 'COMMENT_SUCCESS' || res.msg === 'DELETE_COMMENT_SUCCESS') {
      sweetAlert.success(res.msg);
      // this.setState({displayBlogs: this.getStore(BlogStore).getBlogsByUserId(currentUser._id)});
    }

    if (res.msg === 'UPDATE_BLOG_SUCCESS') {
      sweetAlert.success(res.msg);
      this.setState({
        displayBlogs: this.getStore(BlogStore).getBlogsByUserId(currentUser._id),
        currentBlog: this.getStore(BlogStore).getCurrentBlog(),
        isUpdated: this.getStore(BlogStore).getIsUpdated()
      });
    }

    if (res.msg === 'EDIT_BLOG' || res.msg === 'CANCEL_EDIT_BLOG') {
      this.setState({ currentBlog: this.getStore(BlogStore).getCurrentBlog() });
    }

    if (res.msg === 'CONFIRM_DELETE_BLOG' || res.msg === 'CANCEL_DELETE_BLOG') {
      // this.setState({deletedBlog: this.getStore(BlogStore).getDeletedBlog()})
    }

    if (res.msg === 'DELETE_BLOG_SUCCESS') {
      sweetAlert.success(res.msg);
      this.setState({
        // deletedBlog: this.getStore(BlogStore).getDeletedBlog(),
        displayBlogs: this.getStore(BlogStore).getBlogsByUserId(username)
      });
    }

    this.setState({
      currentUser: this.getStore(UserStore).getCurrentUser(),
      user: this.getStore(UserStore).getUserByUsername(username),
      isCurrentUser: this.getStore(UserStore).isCurrentUser(username)
    });
  },

  onEditBlog(blog) {
    this.executeAction(BlogActions.EditBlog, blog);
  },

  onCancelEdit() {
    this.executeAction(BlogActions.CancelEditBlog);
  },

  onUpdateBlog(blog) {
    if (!blog.title) {
      sweetAlert.alertErrorMessage('Please enter title !');
      return;
    }

    if (!blog.content) {
      sweetAlert.alertErrorMessage('Please enter content');
      return;
    }
    // eslint-disable-next-line no-param-reassign
    blog.title = `<< ${blog.title} >>`;
    this.executeAction(BlogActions.UpdateBlog, blog);
  },

  onDeleteBlog(blog) {
    sweetAlert.alertConfirmMessage('', () => {
      this.executeAction(BlogActions.DeleteBlog, blog);
    });
  },

  onSearchBlog(e) {
    const searchText = e.target.value.toLocaleLowerCase();
    const { user } = this.state;
    const searchedBlogs = this.getStore(BlogStore).getSearchedBlogsWithUser(searchText, user);
    this.setState({ displayBlogs: searchedBlogs });
  },

  sortByType(e) {
    const sortText = e.target.value.toLocaleLowerCase();
    const { user } = this.state;
    const sortedBlogs = this.getStore(BlogStore).getSortedBlogsWithUser(sortText, user);
    this.setState({ displayBlogs: sortedBlogs });
  },

  changeShowCommentsState() {
    const { userId } = this.props.params;
    this.setState({ displayBlogs: this.getStore(BlogStore).getBlogsByUserId(userId) });
  },

  changeBlogThumbsUpState() {
    this.setState(this.getStatesFromStores());
  },

  _renderMicroBlog(blog, blogDate) {
    return (
      <div key={blog._id} className="well list-blogs micro-blog">
        <div className="row">
          <div className="col-xs-8">
            <div className="blog-title">
              <h5>{blog.content}</h5>
              <h6>{blogDate}</h6>
            </div>
          </div>
          <div className="col-xs-4 blog-manage">
            <Button className="btn btn-danger btn-sm delete-btn" onClick={this.onDeleteBlog.bind(this, blog)}>
              <Glyphicon glyph="trash" /> Delete
            </Button>
          </div>
        </div>
      </div>
    );
  },

  _renderArticle(blog, blogDate) {
    return (
      <div key={blog._id} className="well list-blogs article">
        <div className="row">
          <div className="col-xs-8">
            <div className="blog-title">
              <h4><Link to={`/blog-details/${blog._id}`}>{blog.title}</Link></h4>
              <h6>{blogDate}</h6>
            </div>
          </div>
          <div className="col-xs-4 blog-manage">
            <Button
              className="btn btn-danger btn-sm delete-btn"
              onClick={this.onDeleteBlog.bind(this, blog)}
            >
              <Glyphicon glyph="trash" /> Delete
            </Button>
            <Button
              className="btn btn-primary btn-sm delete-btn"
              onClick={this.onEditBlog.bind(this, blog)}
            >
              <Glyphicon glyph="pencil" /> Edit
            </Button>
          </div>
        </div>
      </div>
    );
  },

  _renderCurrentUserContentLeft(pathname, currentUser, displayBlogs) {
    return <UserBlogsNav path={pathname} currentUser={currentUser} displayBlogs={displayBlogs} />;
  },

  _renderCurrentUserContentRight(displayBlogs) {
    return (
      <div>
        {displayBlogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(blog => {
          const fromNow = format.fromNow(blog.created_at);
          if (blog.type === 'article') {
            return this._renderArticle(blog, fromNow);
          } else {
            return this._renderMicroBlog(blog, fromNow);
          }
        })}
      </div>
    );
  },

  _renderBlogsSearchBar() {
    return (
      <div className="well search-bar">
        <div className="row">
          <div className="col-xs-9 search-query">
            <input type="text" className="form-control" placeholder="Search" onChange={this.onSearchBlog} />
            <i className="fa fa-search"></i>
          </div>
          <div className="col-xs-3 sort-by">
            <select className="form-control" onChange={this.sortByType}>
              <option>All blogs</option>
              <option>Microblog</option>
              <option>Article</option>
            </select>
          </div>
        </div>
      </div>
    );
  },

  render() {
    const {
      currentUser,
      isCurrentUser,
      displayBlogs,
      user,
      currentBlog,
      isUpdated
    } = this.state;
    const { pathname } = this.props.location;
    return (
      <div className="user-blogs-page">
        <UserBar path={pathname} user={user} isCurrentUser={isCurrentUser} currentUser={currentUser} />
        {!isCurrentUser &&
          <div className="user-blogs-content">
            <div className="content-mid">
              {this._renderBlogsSearchBar()}
              <BlogsWell
                displayBlogs={displayBlogs}
                changeShowCommentsState={this.changeShowCommentsState}
                changeBlogThumbsUpState={this.changeBlogThumbsUpState}
              />
            </div>
          </div>
        }
        {isCurrentUser &&
          <div className="user-blogs-content">
            <div className="content-left">
              {this._renderCurrentUserContentLeft(pathname, currentUser, displayBlogs)}
            </div>
            <div className="content-right">
              {this._renderBlogsSearchBar()}
              {this._renderCurrentUserContentRight(displayBlogs)}
            </div>
          </div>
        }
        {currentBlog && (
          <BlogEditor
            show={currentBlog !== null}
            blog={currentBlog}
            onSave={this.onUpdateBlog}
            onCancel={this.onCancelEdit}
            isUpdated={isUpdated}
          />
        )}
      </div>
    );
  }
});

export default UserBlogs;
