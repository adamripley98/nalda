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

    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Set the initial state
    this.state = {
      pending: true,
      component: {},
    };

    // Isolate the component ID
    const id = this.props.match.params.id;
    axios.get(`/api/home/components/${id}`)
      .then(res => {
        this.setState({
          pending: false,
          component: res.data.component,
        });
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err.response.data.error || err.response.data,
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
