import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component to render a carousel of images from the passed in images
 */
const Carousel = ({ images }) => {
  // If no images were passed down
  if (!images || !images.length) {
    return null;
  }

  // Construct a list of indicators
  const indicators = [];
  for (let i = 0; i < images.length; i++) {
    indicators.push(
      <li key={i} data-target="#carousel" data-slide-to={i} className={i === 0 ? "active" : ""} />
    );
  }

  // Construct a list of slides
  const slides = [];
  images.forEach((image, index) => {
    slides.push(
      <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
        <img className="d-block img-fluid" src={image} alt={index + " slide"} />
      </div>
    );
  });

  // Return the carousel to be rendered
  return (
    <div id="carousel" className="carousel slide" data-ride="carousel">
      <ol className="carousel-indicators">
        { indicators }
      </ol>
      <div className="carousel-inner" role="listbox">
        { slides }
      </div>
      <a className="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">
          Previous
        </span>
      </a>
      <a className="carousel-control-next" href="#carousel" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">
          Next
        </span>
      </a>
    </div>
  );
};

// Validate props
Carousel.propTypes = {
  images: PropTypes.array,
};

// Export the component
export default Carousel;
