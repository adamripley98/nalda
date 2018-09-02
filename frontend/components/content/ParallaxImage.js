/* global $ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ParallaxImage extends Component {
  componentDidMount() {
    if (!this.props.image) return;

    // Style parallax scrolling
    $(document).ready(() => {
      $(window).scroll(() => {
        const pos = - $(window).scrollTop() / 4;
        $('#parallax').css("transform", `translateY(${pos}px)`);
      });
    });
  }

  render() {
    if (!this.props.image) return null;

    return (
      <div className="parallax-wrapper">
        <div className="background-image img" style={{backgroundImage: `url(${this.props.image})`}} id="parallax" />
      </div>
    );
  }
}

ParallaxImage.defaultProps = {
  image: undefined,
};

ParallaxImage.propTypes = {
  image: PropTypes.string,
};

export default ParallaxImage;
