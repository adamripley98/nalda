import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ShowComponent from './ShowComponent';

class Components extends Component {
  render() {
    if (!this.props.components || !this.props.components.length) return null;
    return (
      <div>
        {this.props.components.map(component => (
          <ShowComponent component={component} key={component._id} />
        ))}
      </div>
    );
  }
}

Components.propTypes = {
  components: PropTypes.array,
};

export default Components;
