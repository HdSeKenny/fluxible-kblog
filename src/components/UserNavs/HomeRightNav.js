import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { Row, Col, Page } from '../UI/Layout';
import { jsUtils } from '../../utils';
import { ModalsFactory } from '../UI';
import { BlogModal } from '../UserControls';


export default class HomeRightNav extends Component {

  static displayName = 'HomeRightNav';

  static contextTypes = {
    executeAction: PropTypes.func
  };

  static propTypes = {
    location: PropTypes.object,
    path: PropTypes.string,
    currentUser: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      showCreateModal: false
    };
  }

  isActive(routes) {
    const path = jsUtils.splitUrlBySlash(this.props.path, routes.length);
    const isActive = _.isEqual(routes.sort(), path.sort());
    return isActive ? 'on' : '';
  }

  hideCreateModal() {
    this.setState({ showCreateModal: false });
  }

  openCreateBlogModal() {
    if (!this.state.showCreateModal) {
      this.setState({ showCreateModal: true });
    }
    $('#createBlogModal').on('hidden.bs.modal', () => {
      // eslint-disable-next-line
      this.hideCreateModal && this.hideCreateModal();
    });

    ModalsFactory.show('createBlogModal');
  }

  render() {
    const { currentUser, showCreateModal } = this.state;
    return (
      <div className="home-right-nav mb-10">
        <Row>
          <Col size="6 pl-0 home-nav-lis">
            <button className={`btn btn-default ${this.isActive([currentUser.username])}`}>Moments</button>
            <button className={`btn btn-default ${this.isActive(['mine', currentUser.username])}`}>Mine</button>
            <button className={`btn btn-default ${this.isActive(['create', currentUser.username])}`}>Add article</button>
          </Col>
          <Col size="3 pl-0 home-search">
            <input type="text" className="form-control" />
          </Col>
          <Col size="3 pr-0 tar">
            <button className="btn btn-info sweet-btn" onClick={() => this.openCreateBlogModal()}>Sweet</button>
            <button className="btn btn-primary sweet-btn ml-10">Article</button>
          </Col>
        </Row>
        <Page>
          <ModalsFactory
            modalref="createBlogModal"
            title="Create a sweet !"
            ModalComponent={BlogModal}
            size="modal-md"
            showHeaderAndFooter={false}
            showModal={showCreateModal}
            currentUser={currentUser} />
        </Page>
      </div>
    );
  }
}

