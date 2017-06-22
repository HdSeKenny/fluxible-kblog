'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createStore = require('fluxible/addons/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserStore = (0, _createStore2.default)({

  storeName: 'UserStore',

  handlers: {
    'USER_REGISTER_SUCCESS': 'registerSuccess',
    'USER_REGISTER_FAIL': 'registerFail',
    'USER_LOGIN_SUCCESS': 'loginSuccess',
    'USER_LOGIN_FAIL': 'loginFail',
    'LOGOUT_SUCCESS': 'logoutSuccess',
    'LOGOUT_FAIL': 'logoutFail',
    'LOAD_SESSION_USER_SUCCESS': 'loadSessionUserSuccess',
    'LOAD_SESSION_USER_FAIL': 'loadSessionUserFail',
    'LOAD_USERS_SUCCESS': 'loadUsersSuccess',
    'LOAD_USERS_FAIL': 'loadUsersFail',
    'IS_LOGGED_IN': 'isLoggedIn',
    'LOAD_KENNY_SUCCESS': 'loadKennySuccess',
    'UPDATE_USER_SUCCESS': 'updateUserSuccess',
    'CHANGE_PASSWORD_SUCCESS': 'changePasswordSuccess',
    'FOLLOW_USER_SUCCESS': 'followUserSuccess',
    'CANCEL_FOLLOW_USER_SUCCESS': 'cancelFollowUserSuccess',
    'EDIT_USER_IMAGE': 'editUserImage',
    'CANCEL_EDIT_USER_IMAGE': 'cancelEditUserImage',
    'UPLOAD_IMAGE_SUCCESS': 'uploadImageSuccess',
    'FOLLOW_USER_WITH_SUCCESS': 'followUserWithSuccess',
    'CANCEL_FOLLOW_USER_WITH_SUCCESS': 'cancelFollowUserWithSuccess',
    'GET_LOGIN_USER_IMAGE_SUCCESS': 'getLoginUserImageSuccess'
  },

  initialize: function () {
    this.users = null;
    this.kenny = null;
    this.currentUser = null;
    this.currentUploadedImage = null;
    this.authenticated = false;
    this.loginUserImage = null;
  },
  loadKennySuccess: function (res) {
    this.kenny = res;
    this.emitChange();
  },
  getKennyUser: function () {
    return this.kenny;
  },
  loadUsersSuccess: function (res) {
    this.users = res;
    this.emitChange();
  },
  loadUsersFail: function () {
    const response = {
      resCode: 404,
      msg: 'LOAD_USERS_FAIL'
    };
    this.users = null;
    this.emitChange(response);
  },
  registerSuccess: function (res) {
    const response = {
      msg: 'USER_REGISTER_SUCCESS',
      stat: res.msg,
      user: res.user
    };
    this.currentUser = res.user;
    this.users.push(res.user);
    this.authenticated = true;
    this.emitChange(response);
  },
  registerFail: function (res) {
    const response = {
      msg: 'USER_REGISTER_FAIL',
      stat: res.msg,
      user: res.user
    };
    this.currentUser = null;
    this.authenticated = false;
    this.emitChange(response);
  },
  loginSuccess: function (res) {
    const response = {
      msg: 'USER_LOGIN_SUCCESS'
    };
    this.currentUser = res.user;
    this.authenticated = true;
    this.emitChange(response);
  },
  loginFail: function (res) {
    const response = {
      msg: 'USER_LOGIN_FAIL',
      errorMsg: res.auth.msg
    };
    this.currentUser = null;
    this.authenticated = false;
    this.emitChange(response);
  },
  logoutSuccess: function () {
    const response = {
      resCode: 200,
      msg: 'LOGOUT_SUCCESS'
    };
    this.currentUser = null;
    this.authenticated = false;
    this.emitChange(response);
  },
  isLoggedIn: function () {
    return this.currentUser !== null;
  },
  isAuthenticated: function () {
    return this.authenticated;
  },
  loadSessionUserSuccess: function (res) {
    this.currentUser = res.user;
    this.authenticated = true;
    this.emitChange(res);
  },
  loadSessionUserFail: function (res) {
    this.currentUser = null;
    this.authenticated = false;
    this.emitChange(res.auth.stat);
  },
  updateUserSuccess: function (res) {
    const response = { msg: 'UPDATE_USER_SUCCESS' };
    this.currentUser = res;
    this.emitChange(response);
  },
  changePasswordSuccess: function (res) {
    if (res.stat) {
      this.authenticated = false;
    }
    this.emitChange(res);
  },
  getCurrentUser: function () {
    return this.currentUser;
  },
  getUserByUsername: function (username) {
    return this.users.find(user => user.username === username);
  },
  getBlogsWithUsername: function (isCurrentUser, username) {
    const displayBlogs = [];
    const users = _lodash2.default.cloneDeep(this.users);
    const currentUser = _lodash2.default.cloneDeep(this.currentUser);
    const thisUser = users.find(user => user.username === username);

    if (isCurrentUser && currentUser) {
      currentUser.blogs.forEach(b => {
        // eslint-disable-next-line no-param-reassign
        b.author = currentUser;
        displayBlogs.push(b);
      });

      currentUser.focuses.forEach(focuse => {
        const focuseUser = users.find(user => user.id_str === focuse.id_str);
        if (focuseUser.blogs.length) {
          focuseUser.blogs.forEach(b => {
            // eslint-disable-next-line no-param-reassign
            b.author = focuseUser;
            displayBlogs.push(b);
          });
        }
      });
    } else if (thisUser) {
      thisUser.blogs.forEach(b => {
        // eslint-disable-next-line no-param-reassign
        b.author = thisUser;
        displayBlogs.push(b);
      });
    }

    return displayBlogs;
  },
  isThumbedUp: function (blog) {
    return blog.likers.indexOf(this.currentUser.strId) !== -1;
  },
  isCurrentUser: function (username) {
    let flag = false;
    if (this.currentUser && username) {
      flag = this.currentUser.username === username;
    } else if (this.currentUser) {
      flag = true;
    }
    return flag;
  },
  followUserSuccess: function (res) {
    const response = {
      msg: 'FOLLOW_USER_SUCCESS'
    };
    this.users.forEach((user, index) => {
      if (user.strId === res.thisUser.strId) {
        this.users[index].fans.push(res.currentUser);
      }
      if (user.strId === res.currentUser.strId) {
        this.users[index].focuses.push(res.thisUser);
        this.currentUser.focuses.push(res.thisUser);
      }
    });

    this.emitChange(response);
  },
  cancelFollowUserSuccess: function (res) {
    const response = {
      msg: 'CANCEL_FOLLOW_USER_SUCCESS'
    };
    this.users.forEach((user, index) => {
      if (user.strId === res.thisUser.strId) {
        this.users[index].fans.forEach((fan, faIdx) => {
          if (fan.strId === res.currentUser.strId) {
            this.users[index].fans.splice(faIdx, 1);
          }
        });
      }
      if (user.strId === res.currentUser.strId) {
        this.users[index].focuses.forEach((focus, fsIdx) => {
          if (focus.strId === res.thisUser.strId) {
            this.users[index].focuses.splice(fsIdx, 1);
          }
        });
        this.currentUser.focuses.forEach((focus, fsIdx) => {
          if (focus.strId === res.thisUser.strId) {
            this.currentUser.focuses.splice(fsIdx, 1);
          }
        });
      }
    });

    this.emitChange(response);
  },
  followUserWithSuccess: function (res) {
    const response = { msg: 'FOLLOW_USER_SUCCESS' };
    const usrIdx = this.users.findIndex(user => user.strId === this.currentUser.strId);
    this.currentUser.focuses.push(res.thisUser);
    this.users[usrIdx] = this.currentUser;
    this.emitChange(response);
  },
  cancelFollowUserWithSuccess: function (res) {
    const response = { msg: 'CANCEL_FOLLOW_USER_SUCCESS' };
    const usrIdx = this.users.findIndex(user => user.strId === this.currentUser.strId);
    this.currentUser.focuses.forEach((focus, fsIdx) => {
      if (focus.strId === res.thisUser.strId) {
        this.currentUser.focuses.splice(fsIdx, 1);
      }
    });
    this.users[usrIdx] = this.currentUser;
    this.emitChange(response);
  },
  getLoginUserImageSuccess: function (res) {
    const response = {
      msg: 'LOAD_LOGIN_USER_IMAGE_SUCCESS'
    };
    this.loginUserImage = res;
    this.emitChange(response);
  },
  getLoginUserloginUserImage: function () {
    return this.loginUserImage;
  },
  getCommenter: function (userId) {
    return this.users ? this.users.find(user => user.id_str === userId) : null;
  },
  getCurrentUploadedImage: function () {
    return this.currentUploadedImage;
  },
  editUserImage: function (image) {
    const response = {
      msg: 'EDIT_IMAGE_SUCCESS'
    };
    this.currentUploadedImage = image;
    this.emitChange(response);
  },
  cancelEditUserImage: function () {
    const response = {
      msg: 'CANCEL_IMAGE_SUCCESS'
    };
    this.currentUploadedImage = null;
    this.emitChange(response);
  },
  uploadImageSuccess: function (newuser) {
    const response = {
      msg: 'UPLOAD_IMAGE_SUCCESS'
    };
    this.currentUser.image_url = newuser.image_url;
    this.emitChange(response);
  },
  dehydrate: function () {
    return {
      currentUser: this.currentUser,
      authenticated: this.authenticated,
      currentUploadedImage: this.currentUploadedImage,
      loginUserImage: this.loginUserImage,
      users: this.users,
      kenny: this.kenny
    };
  },
  rehydrate: function (state) {
    this.currentUser = state.currentUser;
    this.authenticated = state.authenticated;
    this.users = state.users;
    this.kenny = state.kenny;
    this.currentUploadedImage = state.currentUploadedImage;
    this.loginUserImage = state.loginUserImage;

    window.authenticated = state.authenticated;
  }
});

exports.default = UserStore;
module.exports = exports['default'];
