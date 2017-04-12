import React, { Component } from 'react';
import Layout from './Layout';

export default class ModalsFactory extends Component {

  static displayName = 'ModalsFactory';

  static propTypes = {
    size: React.PropTypes.string,
    factory: React.PropTypes.func,
    modalref: React.PropTypes.string,
    title: React.PropTypes.string
  };

  render() {
    const { size, modalref, title, factory } = this.props;
    const ModalComponent = factory;
    const { Row, Col } = Layout;
    return (
      <div className="modal fade" id={modalref} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className={`modal-dialog ${size}`}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="text-muted close" data-dismiss="modal" aria-hidden="true">x</button>
              <h3 className="modal-title">{title}</h3>
              <hr />
            </div>
            <div className="modal-body">
              <ModalComponent {...this.props} />
              <Row className="mt-10">
                <Col size="12">
                  <hr />
                </Col>
              </Row>
            </div>
            <div className="modal-footer">

            </div>
          </div>
        </div>
      </div>
    );
  }
}
