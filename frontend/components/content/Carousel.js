import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.areImages = this.areImages.bind(this);
  }

  componentDidMount() {
    if (!this.areImages()) return;

    $(document).ready(function initCarousel() {
      $('#carousel').slick({
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
      });
    });
  }

  areImages() {
    return this.props.images && this.props.images.length;
  }

  render() {
    if (!this.areImages()) return null;

    return (
      <div id="carousel">
        {
          this.props.images.map((img, index) => (
            <img src={img} alt={`carousel-${index}`} key={`carousel-image-${index}`} />
          ))
        }
      </div>
    );
  }
}

// const Carousel = ({ images }) => {
//   // If no images were passed down
//   if (!images || !images.length) {
//     return null;
//   }
//
//   // Construct a list of indicators
//   const indicators = [];
//   for (let i = 0; i < images.length; i++) {
//     indicators.push(
//       <li key={i} data-target="#carousel" data-slide-to={i} className={i === 0 ? "active" : ""} />
//     );
//   }
//
//   // Construct a list of slides
//   const slides = [];
//   images.forEach((image, index) => {
//     slides.push(
//       <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
//         <img className="d-block img-fluid" src={image} alt={index + " slide"} />
//       </div>
//     );
//   });
//
//   // Return the carousel to be rendered
//   return (
//     <div id="carousel" className="carousel slide" data-ride="carousel">
//       <ol className="carousel-indicators">
//         { indicators }
//       </ol>
//       <div className="carousel-inner" role="listbox">
//         { slides }
//       </div>
//       {
//         (images && images.length) && (
//           <a className="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
//             <span className="carousel-control-prev-icon" aria-hidden="true" />
//             <span className="sr-only">
//               Previous
//             </span>
//           </a>
//         )
//       }
//       {
//         (images && images.length) && (
//           <a className="carousel-control-next" href="#carousel" role="button" data-slide="next">
//             <span className="carousel-control-next-icon" aria-hidden="true" />
//             <span className="sr-only">
//               Next
//             </span>
//           </a>
//         )
//       }
//     </div>
//   );
// };

Carousel.defaultProps = {
  images: [],
};

Carousel.propTypes = {
  images: PropTypes.array,
};

export default Carousel;
