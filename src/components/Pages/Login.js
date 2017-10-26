import React from 'react';
import FluxibleMixin from 'fluxible-addons-react/FluxibleMixin';
import CreateReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { routerShape } from 'react-router';
import { validations, jsUtils } from '../../utils';
import { swal } from '../../plugins';
import { UserActions } from '../../actions';
import { UserStore } from '../../stores';
import { SweetInput, Switch, ModalsFactory } from '../UI';
import { Row, Col } from '../UI/Layout';

const Login = CreateReactClass({

  displayName: 'Login',

  contextTypes: {
    router: routerShape.isRequired,
    config: PropTypes.object,
    executeAction: PropTypes.func
  },

  propTypes: {
    onForgotPassword: PropTypes.func,
    openNavbarModals: PropTypes.func,
    hideNavbarModals: PropTypes.func,
    switchOpenModal: PropTypes.func
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [UserStore]
  },

  getInitialState() {
    return this.getStateFromStores();
  },

  getStateFromStores() {
    return {
      switchOn: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      remember: false
    };
  },

  onChange(res) {
    if (res.msg === 'USER_LOGIN_SUCCESS') {
      swal.success(res.msg);
      ModalsFactory.hide('loginModal');
      this.context.router.push('/list');
    }

    if (res.msg === 'USER_LOGIN_FAIL') {
      this.setState({ errorMessage: res.errorMsg });
    }

    if (res.msg === 'LOGOUT_SUCCESS') {
      swal.success(res.msg);
      this.context.router.push('/');
    }
  },

  onLoginSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const creds = { email, password };
    const validateInfo = this.validateForm(creds);
    if (validateInfo) {
      this.setState({ errorMessage: validateInfo, emailErrorMessage: '', passwordErrorMessage: '' });
    } else {
      this.executeAction(UserActions.Login, creds);
    }
  },

  validateForm(creds) {
    const emailValidation = this.validateEmail(creds.email);
    const passwordValidation = this.validatePassword(creds.password);

    return emailValidation.emailErrorMessage || passwordValidation.passwordErrorMessage;
  },

  validateEmail(email) {
    const isUnEmpty = jsUtils.isUnEmptyString(email);
    const isEmail = validations.isEmail(email);
    const result = {
      email,
      emailErrorMessage: ''
    };

    if (!isUnEmpty) {
      result.emailErrorMessage = 'Email is required!';
    }
    else if (!isEmail) {
      result.emailErrorMessage = 'Please check your email address!';
    }

    return result;
  },

  validatePassword(password) {
    const isUnEmpty = jsUtils.isUnEmptyString(password);

    const result = {
      password,
      passwordErrorMessage: ''
    };

    if (!isUnEmpty) {
      result.passwordErrorMessage = 'Password is required!';
    }

    return result;
  },

  onEmailChange(e) {
    const email = e.target.value;
    this.setState({ email, errorMessage: '' });
  },

  onPasswordChange(e) {
    const password = e.target.value;
    this.setState({ password, errorMessage: '' });
  },

  openSignupModal() {
    this.props.switchOpenModal('signupModal');

    ModalsFactory.hide('loginModal');


    // this.props.hideNavbarModals('loginModal');

    // Click signup in login modal, it should hide login modal
    // then open signup modal, but the 'modal-open' class will
    // be deleted by login modal hide event
    // setTimeout(() => {
    //   $('body').addClass('modal-open');
    // }, 500);
  },

  componentDidMount() {
  },

  rememberMe() {
    this.setState({ remember: !this.state.remember });
  },

  _renderEmailInput(email, remember) {
    const { emailErrorMessage } = this.state;
    return (
      <SweetInput
        ref="emailRef"
        autoComplete={remember ? 'on' : 'off'}
        format="email"
        icon="fa fa-user"
        required={true}
        errorMessage={emailErrorMessage}
        placeholder="email"
        value={email}
        onChange={this.onEmailChange}
      />
    );
  },

  _renderPasswordInput(password, remember) {
    const { passwordErrorMessage } = this.state;
    return (
      <SweetInput
        ref="loginRef"
        autoComplete={remember ? 'on' : 'off'}
        format="password"
        icon="fa fa-lock"
        required={true}
        errorMessage={passwordErrorMessage}
        placeholder="password"
        value={password}
        onChange={this.onPasswordChange}
      />
    );
  },

  _renderLoginOptions() {
    return (
      <Row className="login-options">
        <Col size="6" className="pl-0">
          <Switch after="Remember me" rememberMe={this.rememberMe} />
        </Col>
        <Col size="6" className="pr-0 tar">
          <span className="forgot-pw">Forgot password</span>
        </Col>
      </Row>
    );
  },

  _renderLoginBtns(isModalLogin) {
    if (isModalLogin) {
      return (
        <Row>
          <Col size="6" className="pl-0">
            <button type="submit" className="btn btn-info btn-login">Login</button>
          </Col>
          <Col size="6" className="pr-0 tar">
            <span onClick={this.openSignupModal} className="btn btn-primary btn-signup">signup</span>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row className="p-0">
          <button type="submit" className="btn btn-info btn-login">Login</button>
        </Row>
      );
    }
  },

  _renderOtherAuths(isModalLogin) {
    const twitterImg = '/images/svg/twitter.svg';
    const googleImg = '/images/google+.png';
    const githubImg = '/images/github.png';
    return (
      <div className="">
        {isModalLogin &&
          <div>
            <Row>
              <Col size="4" className="p-0"><hr /></Col>
              <Col size="4"><h5 className="tac">or login with</h5></Col>
              <Col size="4" className="p-0 tar"><hr /></Col>
            </Row>
            <Row className="other-auths">
              <Col size="4" className="tac"><img alt="twitter" src={twitterImg} /></Col>
              <Col size="4" className="tac"><img alt="google+" src={googleImg} /></Col>
              <Col size="4" className="tac"><img alt="github" src={githubImg} /></Col>
            </Row>
          </div>
        }

        {!isModalLogin &&
          <Row className="mb-10">
            <hr className="mt-5 mb-10" />
            <Col size="4 login-with p-0"><h5>Other Logins:</h5></Col>
            <Col size="8 other-auths p-0">
              <Col size="2" className="tac p-0"><img alt="twitter" src={twitterImg} /></Col>
              <Col size="2" className="tac p-0"><img alt="google+" src={googleImg} /></Col>
              <Col size="2" className="tac p-0"><img alt="github" src={githubImg} /></Col>
            </Col>
          </Row>
        }
      </div>
    );
  },

  render() {
    const { errorMessage, password, email, remember } = this.state;
    const { isModalLogin } = this.props;
    return (
      <section className="login-section mt-15 mr-15 ml-15">
        <div className="wrapper-md animated fadeInUp">
          <form role="form" onSubmit={this.onLoginSubmit}>
            <div className="form-group">{this._renderEmailInput(email, remember)}</div>
            <div className={`form-group ${errorMessage ? 'mb-5' : ''}`}>{this._renderPasswordInput(password, remember)}</div>
            <div className="form-group m-0"><p className="help-block text-left">{errorMessage}</p></div>
            <div className="form-group">{this._renderLoginOptions()}</div>
            <div className="form-group">{this._renderLoginBtns(isModalLogin)}</div>
          </form>
          <div className="">{this._renderOtherAuths(isModalLogin)}</div>
        </div>
      </section>
    );
  }
});

export default Login;
