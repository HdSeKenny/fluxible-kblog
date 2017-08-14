import Mode from '../utils/mode';
import fetchClientConfig from '../utils/fetchClientConfig';

const { isPublic } = Mode;

const UserActions = {
  LoadKennyUser: (context, payload, done) => {
    context.service.read('users.loadKennyUser', payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Load kenny error: ${res}`);
      } else {
        context.dispatch('LOAD_KENNY_SUCCESS', res);
      }
      done();
    });
  },

  LoadUsers: (context, payload, done) => {
    context.service.read('users.loadUsers', payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Load users error: ${err}`);
      } else if (!res) {
        context.dispatch('LOAD_USERS_FAIL');
      } else {
        context.dispatch('LOAD_USERS_SUCCESS', res);
      }
      done();
    });
  },

  Login: (context, payload, done) => {
    context.service.create('users.login', {}, payload, fetchClientConfig, (err, res) => {
      if (res.user) {
        context.dispatch('USER_LOGIN_SUCCESS', res);
      } else {
        context.dispatch('USER_LOGIN_FAIL', res);
      }

      done();
    });
  },

  Logout: (context, payload, done) => {
    context.service.delete('users', payload, fetchClientConfig, (err, res) => {
      if (err) {
        context.dispatch('LOGOUT_FAIL');
      } else {
        context.dispatch('LOGOUT_SUCCESS', res);
      }
      done();
    });
  },

  UserRegister: (context, payload, done) => {
    context.service.create('users.register', {}, payload, fetchClientConfig, (err, res) => {
      if (res.user) {
        context.dispatch('USER_REGISTER_SUCCESS', res);
      } else {
        context.dispatch('USER_REGISTER_FAIL', res);
      }
      done();
    });
  },

  LoadSessionUser: (context, payload, done) => {
    if (isPublic) {
      done();
      return;
    }
    context.service.read('users.readCurrentUser', payload, fetchClientConfig, (err, res) => {
      if (res.user) {
        context.dispatch('LOAD_SESSION_USER_SUCCESS', res);
      } else {
        context.dispatch('LOAD_SESSION_USER_FAIL', res);
      }
      done();
    });
  },

  isAuthenticated: (context, payload, done) => {
    context.dispatch('IS_AUTHENTICATED');
    done();
  },

  UpdateUserInfo: (context, payload, done) => {
    context.service.create('users.updateUserInfo', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Update user error: ${err}`);
      } else {
        context.dispatch('UPDATE_USER_SUCCESS', res);
      }
      done();
    });
  },

  ChangeUserPassword: (context, payload, done) => {
    context.service.create('users.changeUserPassword', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Change password error: ${err}`);
      } else {
        context.dispatch('CHANGE_PASSWORD_SUCCESS', res);
      }
      done();
    });
  },

  FollowThisUser: (context, payload, done) => {
    context.service.create('users.followThisUser', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Follow user error: ${err}`);
      } else {
        context.dispatch('FOLLOW_USER_SUCCESS', res);
      }
      done();
    });
  },

  CancelFollowThisUser: (context, payload, done) => {
    context.service.create('users.cancelFollowThisUser', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Follow user error: ${err}`);
      } else {
        context.dispatch('CANCEL_FOLLOW_USER_SUCCESS', res);
      }
      done();
    });
  },

  FollowThisUserWithFollow: (context, payload, done) => {
    context.service.create('users.followThisUser', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Follow user error: ${err}`);
      } else {
        res.userId = payload.userId;
        res.followType = payload.type;
        context.dispatch('FOLLOW_USER_WITH_SUCCESS', res);
      }
      done();
    });
  },

  CancelFollowThisUserWithFollow: (context, payload, done) => {
    context.service.create('users.cancelFollowThisUser', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(`Follow user error: ${err}`);
      } else {
        res.userId = payload.userId;
        res.followType = payload.type;
        context.dispatch('CANCEL_FOLLOW_USER_WITH_SUCCESS', res);
      }
      done();
    });
  },

  EditUserImage: (context, payload, done) => {
    context.dispatch('EDIT_USER_IMAGE', payload);
    done();
  },

  CancelEditUserImage: (context, payload, done) => {
    context.dispatch('CANCEL_EDIT_USER_IMAGE');
    done();
  },

  UploadImageSuccess: (context, payload, done) => {
    context.dispatch('UPLOAD_IMAGE_SUCCESS', payload);
    done();
  },

  GetLoginUserImage: (context, payload, done) => {
    context.service.create('users.getLoginUserImage', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(err);
      }
      if (res) {
        context.dispatch('GET_LOGIN_USER_IMAGE_SUCCESS', res);
      }
      done();
    });
  },

  openChatConnection: (context, payload, done) => {
    context.service.create('users.addMessageConnection', {}, payload, fetchClientConfig, (err, res) => {
      if (err) {
        console.log(err);
      }
      if (res) {
        context.dispatch('ADD_MESSAGE_CONNECTION_SUCCESS', res);
      }
      done();
    });
  }
};

export default UserActions;
