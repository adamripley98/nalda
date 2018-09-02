/* global $ */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BannerItem from './BannerItem';

class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    $(document).ready(function initSlick() {
      $('#banner-carousel').removeClass('hidden');

      $('#banner-carousel').slick({
        centerMode: true,
        centerPadding: '20%',
        slidesToShow: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 784,
            settings: {
              centerPadding: '15%',
            },
          },
          {
            breakpoint: 648,
            settings: {
              centerPadding: '10%',
            },
          },
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
    if (this.props.isLoading) {
      return (
        <div id="banner-carousel" className="hidden">
          <BannerItem isLoading />
          <BannerItem isLoading />
          <BannerItem isLoading />
        </div>
      );
    }

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

Banner.defaultProps = {
  isLoading: false,
  banner: [],
};

Banner.propTypes = {
  banner: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default Banner;
