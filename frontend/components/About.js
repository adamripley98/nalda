// Import framworks
import React, { Component } from 'react';

// Import components
import Thin from './shared/Thin';

const naldaBio = "Nalda is a centralized source for information, food, activities, and fun on your campus. Currently in beta testing at the University of Pennsylvania, Nalda BLASKDFLADSKFLASDKFLAKSDFLASDKFSDKFLSDKF";

class About extends Component {
  // Renders about component
  // TODO: Nalda needs to send us the information for this component
  render() {
    return (
      <Thin>
        <p className="marg-top-1 marg-bot-0">
          { naldaBio }
        </p>
      </Thin>
    );
  }
}

export default About;
