// Import frameworks
import React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid-v4';
import GoogleMapReact from 'google-map-react';

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
      title: "Name of the listing",
      description: "This is a sample description about the listing that previews what it is all about.",
      type: "RESTAURANT",
      amenities: [
        "Pets allowed",
        "Family/kid friendly",
        "Wifi",
      ],
      location: {
        lat: 59.95,
        lng: 30.33,
      },
      user: {
        name: "Adam Ripley",
        profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      },
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

    // Bind this to helper methods
    this.renderAmenities = this.renderAmenities.bind(this);
  }

  // Handle when the component mounts
  componentDidMount() {}

  // Helper method to render amenities
  renderAmenities() {
    if (this.state.amenities) {
      return this.state.amenities.map(amenity => (
        <div className="amenity" key={ uuid() }>
          { amenity }
        </div>
      ));
    }

    // If there are no amentities return nothing
    return null;
  }

  // Render the component
  render() {
    return (
      <div className="listing">
        <div className="background-image preview" style={{ backgroundImage: `url(${this.state.img})` }}/>
        <div className="container content">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <div className="header">
                <h1 className="title">
                  { this.state.title }
                </h1>
              </div>
              <p className="description">
                { this.state.description }
              </p>
              <div className="line" />
              <h5 className="subtitle">
                Amenities
              </h5>
              { this.renderAmenities() }
              <div className="line" />
              <h5 className="subtitle">
                Location
              </h5>
              <div id="map" />
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
