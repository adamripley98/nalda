import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

class AdminWrapper extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <div className="col-12 col-md-8 col-lg-8 col-xl-7">
            <div className="space-1" />
            {this.props.children}
            <div className="space-2" />
          </div>
        </div>
      </div>
    );
  }
}

AdminWrapper.propTypes = {
  children: PropTypes.object,
};

export default AdminWrapper;
