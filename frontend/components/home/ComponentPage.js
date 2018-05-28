import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../shared/ErrorMessage';
import ShowComponent from './ShowComponent';
import Loading from '../shared/Loading';
import Button from '../shared/Button';

class ComponentPage extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      pending: true,
      component: {},
    };

    // Isolate the component ID
    const id = this.props.match.params.id;
    axios.get(`/api/home/components/${id}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            pending: false,
            component: res.data.component,
          });
        } else {
          this.setState({
            pending: false,
            error: res.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err.message,
        });
      });
  }

  render() {
    if (this.state.pending) return (<Loading />);
    return (
      <div className="container">
        <ErrorMessage error={this.state.error} />
        <ShowComponent component={this.state.component} showAll />
        <Button />
      </div>
    );
  }
}

ComponentPage.propTypes = {
  match: PropTypes.object,
};

export default ComponentPage;
