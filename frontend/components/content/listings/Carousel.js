import React from 'react';

const Carousel = ({}) => (
  <div id="carousel" className="carousel slide" data-ride="carousel">
    <ol className="carousel-indicators">
      <li data-target="#carousel" data-slide-to="0" className="active" />
      <li data-target="#carousel" data-slide-to="1" />
      <li data-target="#carousel" data-slide-to="2" />
    </ol>
    <div className="carousel-inner" role="listbox">
      <div className="carousel-item active">
        <img className="d-block img-fluid" src="http://press.visitphilly.com/uploads/photos/3688_l.jpg" alt="First slide" />
      </div>
      <div className="carousel-item">
        <img className="d-block img-fluid" src="http://press.visitphilly.com/uploads/photos/3688_l.jpg" alt="Second slide" />
      </div>
      <div className="carousel-item">
        <img className="d-block img-fluid" src="http://press.visitphilly.com/uploads/photos/3688_l.jpg" alt="Third slide" />
      </div>
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

export default Carousel;
