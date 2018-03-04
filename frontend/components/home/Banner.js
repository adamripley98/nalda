// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

/**
 * Component to render the banner images at the top of the homepage
 */
class Banner extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Find the new banners with first and last images as dummy banners
    this.props.banners.push({ isEmpty: true, });
    this.props.banners.unshift({ isEmpty: true, });

    // Set the initial state depending on the number of banner images there are
    if (this.props.banners.length <= 4) {
      this.state = {
        active: this.props.banners.length - 2,
      };
    } else {
      this.state = {
        active: this.props.banners.length - 3,
      };
    }

    // Bind this to helper methods
    this.shiftRight = this.shiftRight.bind(this);
    this.shiftLeft = this.shiftLeft.bind(this);
  }

  /**
   * Helper method to shift the banner images when a user clicks right shift
   */
  shiftRight() {
    // If we have not reached the right-most item
    if (this.state.active > 1) {
      this.setState({
        active: this.state.active - 1,
      });
    }
  }

  /**
   * Helper method to shift the banner images whena a user clicks left shift
   */
  shiftLeft() {
    // If we have not reached the left most item
    if (this.state.active < this.props.banners.length - 2) {
      this.setState({
        active: this.state.active + 1,
      });
    }
  }

  /**
   * Render the banner and banner images
   */
  render() {
    if (!this.props.banners || !this.props.banners.length) return null;
    return (
      <div className="banner">
        { this.props.banners.map((banner, index) => {
          let bannerClass = "";
          if (this.state.active === index) bannerClass = "active";
          else if (this.state.active - 1 === index) bannerClass = "toLeft";
          else if (this.state.active + 1 === index) bannerClass = "toRight";
          else if (this.state.active + 1 < index) bannerClass = "offRight";
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
          this.state.active === this.props.banners.length - 2 ? (
            null
          ) : (
            <div className="shift left" onClick={this.shiftLeft}>
              <i className="fa fa-chevron-left" aria-hidden="true" />
            </div>
          )
        }
        {
          this.state.active === 1 ? (
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
