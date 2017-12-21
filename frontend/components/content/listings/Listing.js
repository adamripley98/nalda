// Import frameworks
import React from 'react';
import { connect } from 'react-redux';

/**
 * Component to render a listing
 */
class Listing extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      img: "https://a0.muscache.com/im/pictures/109411642/6fbeaa28_original.jpg?aki_policy=xx_large",
      name: "Name of the listing",
      description: "This is a sample description about the listing that previews what it is all about.",
      type: "RESTAURANT",
      amenities: [
        "Pets allowed",
        "Family/kid friendly",
        "Wifi",
      ],
      reviews: [
        {
          name: "Cameron Cabo",
          stars: 4,
          title: "This is the title of my review",
          content: "This is the content of my review. I hope you like reading it.",
          createdAt: 1513816681804,
        },
        {
          name: "Adam Ripley",
          stars: 5,
          title: "This is a second review",
          content: "This is the content of my review. I hope you like reading it.",
          createdAt: 1513816699243,
        }
      ],
    };
  }

  // Render the component
  render() {
    return (
      <div className="listing">
        <div className="background-image preview" style={{ backgroundImage: `url(${this.state.img})` }}/>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              THis is a listing
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Listing.propTypes = {
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Listing = connect(
    mapStateToProps,
    mapDispatchToProps
)(Listing);

export default Listing;
