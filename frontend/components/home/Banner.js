// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Component to render the banner images at the top of the homepage
 */
class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      toLeft: 0,
      toRight: 2,
      banners: [0, 1, 2],
    };
  }

  render() {
    return (
      <div className="banner">
        { this.state.banners.map((banner, index) => {
          let bannerClass = "";
          if (this.state.active === index) bannerClass = "active";
          else if (this.state.toLeft === index) bannerClass = "toLeft";
          else if (this.state.toRight === index) bannerClass = "toRight";
          if (bannerClass) {
            return (<div className={`banner-item ${bannerClass}`} />);
          }
          return (<div className="banner-item" />);
        })}
      </div>
    );
  }
}

// Prop validations
Banner.propTypes = {
  content: PropTypes.array,
};

export default Banner;
