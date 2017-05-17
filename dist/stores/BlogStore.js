'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createStore = require('fluxible/addons/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import store from '../utils/sessionStorage';
const BlogStore = (0, _createStore2.default)({

  storeName: 'BlogStore',

  handlers: {
    'LOAD_BLOGS_SUCCESS': 'loadBlogsSuccess',
    'DELETE_BLOG_SUCCESS': 'deleteBlogSuccess',
    'DELETE_BLOG_FAIL': 'deleteBlogFail',
    'ADD_BLOG_SUCCESS': 'addBlogSuccess',
    'ADD_BLOG_FAIL': 'addBlogFail',
    'EDIT_BLOG': 'editBlog',
    'CANCEL_EDIT_BLOG': 'cancelEditBlog',
    'UPDATE_BLOG_SUCCESS': 'updateBlogSuccess',
    'CONFIRM_DELETE_BLOG': 'confirmDeleteBlog',
    'CANCEL_DELETE_BLOG': 'cancelDeleteBlog',
    'THUMBS_UP_BLOG_SUCCESS': 'thumbsUpBlogSuccess',
    'CANCEL_THUMBS_UP_BLOG_SUCCESS': 'cancelThumbsUpBlogSuccess',
    'ADD_COMMENT_SUCCESS': 'addCommentSuccess',
    'DELETE_COMMENT_SUCCESS': 'deleteCommentSuccess',
    'UPLOAD_IAMGE_SUCCESS': 'uploadImageSuccess'
  },

  initialize: function () {
    this.blogs = null;
    this.comments = null;
    this.currentBlog = null;
    this.deletedBlog = null;
    this.showLoading = true;
    this.listKeyNumber = 0;
    this.isUpdated = false;
    this.isThumbedUp = false;
  },
  loadBlogsSuccess: function (res) {
    this.blogs = res;
    this.emitChange();
  },


  // Blogs comments
  addCommentSuccess: function (res) {
    const resObj = { msg: 'COMMENT_SUCCESS', blogId: res.blogId, data: res };
    this.blogs.forEach((blog, index) => {
      if (blog.id_str === res.blogId) {
        this.blogs[index].comments.push(res);
      }
    });
    this.emitChange(resObj);
  },
  deleteCommentSuccess: function (res) {
    const resObj = { msg: 'DELETE_COMMENT_SUCCESS', blogId: res.blogId, data: res.deletedCommentId };
    this.blogs.forEach((blog, bIdx) => {
      if (blog.id_str === res.blogId) {
        blog.comments.forEach((comment, cIdx) => {
          if (comment.id_str === res.deletedCommentId) {
            this.blogs[bIdx].comments.splice(cIdx, 1);
          }
        });
      }
    });
    this.emitChange(resObj);
  },
  getAllComments: function () {
    return this.comments;
  },

  /* Blogs comments end*/

  addBlogSuccess: function (res) {
    const resObj = {
      msg: 'CREATE_BLOG_SUCCESS',
      newBlog: res
    };
    this.blogs.push(res);
    this.emitChange(resObj);
  },
  addBlogFail: function () {
    const resObj = {
      msg: 'ADD_BLOG_FAIL'
    };
    this.emitChange(resObj);
  },
  getAllBlogs: function () {
    return this.blogs;
  },
  getUserBlogsWithFocuses: function (isCurrentUser, user) {
    const displayUserBlogs = [];
    if (this.blogs) {
      this.blogs.forEach(blog => {
        if (isCurrentUser) {
          if (user.focuses.length > 0) {
            user.focuses.forEach(focus => {
              if (blog.author.id_str === focus.id_str) {
                displayUserBlogs.push(blog);
              }
            });
          }
        }
        if (blog.author.id_str === user.id_str) {
          displayUserBlogs.push(blog);
        }
      });
    }
    return displayUserBlogs;
  },
  changeShowCommentsState: function (blog) {
    this.blogs.forEach((b, idx) => {
      if (b.id_str === blog.id_str) {
        this.blogs[idx].show_comments = blog.show_comments;
      }
    });
    this.emitChange();
  },
  getBlogsByUserId: function (userId) {
    const displayUserBlogs = [];
    if (this.blogs) {
      this.blogs.forEach(blog => {
        if (blog.author.id_str === userId) {
          displayUserBlogs.push(blog);
        }
      });
    }
    return displayUserBlogs;
  },
  deleteBlogSuccess: function (res) {
    const resObj = {
      resCode: 200,
      msg: 'DELETE_BLOG_SUCCESS'
    };
    this.blogs = this.blogs.filter(blog => blog.id_str !== res.deletedBlogId);
    this.deletedBlog = null;
    this.emitChange(resObj);
  },
  deleteBlogFail: function (err) {
    this.emitChange(err);
  },
  getBlogById: function (blogId) {
    return this.blogs.find(blog => blog.id_str === blogId);
  },
  getSearchedBlogs: function (searchText) {
    const searchedBlogs = [];
    this.blogs.forEach(blog => {
      if (blog.title) {
        if (blog.title.toLocaleLowerCase().indexOf(searchText) !== -1 || blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
          searchedBlogs.push(blog);
        }
      } else if (blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
        searchedBlogs.push(blog);
      }
    });
    return searchedBlogs;
  },
  getSearchedBlogsWithUser: function (searchText, user) {
    const searchedBlogs = [];
    this.blogs.forEach(blog => {
      if (blog.author.id_str === user.id_str) {
        if (blog.title) {
          if (blog.title.toLocaleLowerCase().indexOf(searchText) !== -1 || blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
            searchedBlogs.push(blog);
          }
        } else if (blog.content.toLocaleLowerCase().indexOf(searchText) !== -1) {
          searchedBlogs.push(blog);
        }
      }
    });

    return searchedBlogs;
  },
  getSortedBlogs: function (sortText) {
    return sortText === 'all blogs' ? this.blogs : this.blogs.filter(blog => blog.type === sortText);
  },
  getSortedBlogsWithUser: function (sortText, user) {
    const thisUserBlogs = this.blogs.filter(blog => blog.author.id_str === user.id_str);
    const sortedBlogs = this.blogs.filter(blog => blog.type === sortText && blog.author.id_str === user.id_str);
    return sortText === 'all blogs' ? thisUserBlogs : sortedBlogs;
  },
  editBlog: function (blog) {
    const resObj = {
      msg: 'EDIT_BLOG'
    };
    const currentBlog = this.blogs.find(item => item.id_str === blog.id_str);
    this.currentBlog = currentBlog;
    this.deletedBlog = null;
    this.listKeyNumber += 1;
    this.emitChange(resObj);
  },
  cancelEditBlog: function () {
    const resObj = {
      msg: 'CANCEL_EDIT_BLOG'
    };
    this.currentBlog = null;
    this.emitChange(resObj);
  },
  getCurrentBlog: function () {
    return this.currentBlog;
  },
  getDeletedBlog: function () {
    return this.deletedBlog;
  },
  getIsUpdated: function () {
    return this.isUpdated;
  },
  updateBlogSuccess: function (newBlog) {
    const blogs = _lodash2.default.cloneDeep(this.blogs);
    blogs.forEach((item, index) => {
      if (_lodash2.default.isEqual(item.id_str, newBlog.id_str)) {
        blogs[index] = newBlog;
      }
    });
    const resObj = {
      blogs: blogs,
      msg: 'UPDATE_BLOG_SUCCESS'
    };
    this.currentBlog = null;
    this.blogs = blogs;
    this.isUpdated = true;
    this.emitChange(resObj);
  },
  confirmDeleteBlog: function (blog) {
    const resObj = {
      msg: 'CONFIRM_DELETE_BLOG'
    };
    this.deletedBlog = blog;
    this.emitChange(resObj);
  },
  cancelDeleteBlog: function () {
    const resObj = {
      msg: 'CANCEL_DELETE_BLOG'
    };
    this.deletedBlog = null;
    this.emitChange(resObj);
  },
  thumbsUpBlogSuccess: function (newBlog) {
    const resObj = {
      msg: 'THUMBS_UP_BLOG_SUCCESS'
    };
    this.blogs.forEach((blog, index) => {
      if (blog.id_str === newBlog.id_str) {
        this.blogs[index].likers = newBlog.likers;
      }
    });
    this.emitChange(resObj);
  },
  cancelThumbsUpBlogSuccess: function (newBlog) {
    const resObj = {
      msg: 'CANCEL_THUMBS_UP_BLOG_SUCCESS'
    };
    this.blogs.forEach((blog, index) => {
      if (blog.id_str === newBlog.id_str) {
        this.blogs[index].likers = newBlog.likers;
      }
    });
    this.emitChange(resObj);
  },
  uploadImageSuccess: function (newUser) {
    this.blogs.forEach((blog, idx) => {
      if (blog.author.id_str === newUser.id_str) {
        this.blogs[idx].author.image_url = newUser.image_url;
      }
    });
    this.emitChange();
  },
  dehydrate: function () {
    return {
      blogs: this.blogs,
      currentBlog: this.currentBlog,
      deletedBlog: this.deletedBlog,
      isUpdated: this.isUpdated,
      isThumbedUp: this.isThumbedUp,
      comments: this.comments
    };
  },
  rehydrate: function (state) {
    this.blogs = state.blogs;
    this.currentBlog = state.currentBlog;
    this.deletedBlog = state.deletedBlog;
    this.isUpdated = state.isUpdated;
    this.isThumbedUp = state.isThumbedUp;
    this.comments = state.comments;
  }
});

exports.default = BlogStore;
module.exports = exports['default'];
