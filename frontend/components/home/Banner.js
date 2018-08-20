import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BannerItem from './BannerItem';

class Banner extends Component {
  componentDidMount() {
    $(document).ready(function initSlick() {
      $('#banner-carousel').slick({
        centerMode: true,
        centerPadding: '10%',
        slidesToShow: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 492,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '18px',
              slidesToShow: 1
            }
          }
        ]
      });
    });
  }

  render() {
    if (!this.props.banner || !this.props.banner.length) return null;

    return (
      <div id="banner-carousel">
        {
          this.props.banner.map((bannerItem, index) => (
            <BannerItem
              bannerItem={bannerItem}
              key={`${bannerItem.contentId}-${index}`}
            />
          ))
        }
      </div>
    );
  }
}

Banner.propTypes = {
  banner: PropTypes.array.isRequired,
};

export default Banner;
