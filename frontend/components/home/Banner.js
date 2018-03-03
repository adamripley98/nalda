// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

/**
 * Component to render the banner images at the top of the homepage
 */
class Banner extends Component {
  constructor(props) {
    super(props);
    if (this.props.banners.length === 1) {
      this.state = {
        active: 0,
        toLeft: -1,
        toRight: 1,
      };
    } else {
      this.state = {
        active: 1,
        toLeft: 0,
        toRight: 2,
      };
    }

    // Bind this to helper methods
    this.shiftRight = this.shiftRight.bind(this);
    this.shiftLeft = this.shiftLeft.bind(this);
  }

  shiftRight() {
    // If we have not reached the right-most item
    if (this.state.active > 0) {
      this.setState({
        active: this.state.active - 1,
        toLeft: this.state.toLeft - 1,
        toRight: this.state.toRight - 1,
      });
    }
  }

  shiftLeft() {
    // If we have not reached the left most item
    if (this.state.active < this.props.banners.length - 1) {
      this.setState({
        active: this.state.active + 1,
        toLeft: this.state.toLeft + 1,
        toRight: this.state.toRight + 1,
      });
    }
  }

  render() {
    if (!this.props.banners || !this.props.banners.length) return null;
    return (
      <div className="banner">
        { this.props.banners.map((banner, index) => {
          let bannerClass = "";
          if (this.state.active === index) bannerClass = "active";
          else if (this.state.toLeft === index) bannerClass = "toLeft";
          else if (this.state.toRight === index) bannerClass = "toRight";
          else if (this.state.toRight < index) bannerClass = "offRight";
          else bannerClass = "offLeft";
          if (bannerClass === "active") {
            return (
              <Link to={`/${banner.contentType}s/${banner.contentId}`}
                key={index}
                className={`banner-item background-image ${bannerClass}`}
                style={{backgroundImage: `url(${banner.contentImage})`}}
              />
            );
          }

          return (
            <Link to={`/`}
              key={index}
              className={`banner-item background-image ${bannerClass}`}
              style={{backgroundImage: `url(${banner.contentImage})`}}
            />
          );
        })}
        {
          this.state.active === this.props.banners.length - 1 ? (
            null
          ) : (
            <div className="shift left" onClick={this.shiftLeft}>
              <i className="fa fa-chevron-left" aria-hidden="true" />
            </div>
          )
        }
        {
          this.state.active === 0 ? (
            null
          ) : (
            <div className="shift right" onClick={this.shiftRight}>
              <i className="fa fa-chevron-right" aria-hidden="true" />
            </div>
          )
        }
      </div>
    );
  }
}

// Prop validations
Banner.propTypes = {
  banners: PropTypes.array,
};

export default Banner;
