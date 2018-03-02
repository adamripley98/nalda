// Import framworks
import React, { Component } from 'react';

// Import components
import Thin from './shared/Thin';
import Tags from './shared/Tags';

class About extends Component {
  /**
   * When the component mounts
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    // Update the title
    // document.title = "Nalda | About";
  }

  /**
   * Renders about component
   */
  render() {
    return (
      <Thin>
        <div>
          <Tags title="About" description="Learn more about Nalda." />
          <h3 className="primary-text marg-top-1 marg-bot-1">
            Hey there, we're Nalda
          </h3>
          <p className="dark-gray-text">
            College is an experience – academic rigors, friendships, and countless new adventures. It is also, however, a home and a way of life.
          </p>
          <p className="dark-gray-text">
            Nalda aims to help college students explore the neighborhoods of their schools by providing specially curated student-to-student information about how to make the most of their college experience. Brunch spots, food trucks, birthday venues, Nalda has it all.
          </p>
          <p className="dark-gray-text">
            But more importantly, Nalda only gives you what you need. It’s like an experienced friend giving you suggestions, except now, you could have that friend with you anywhere, at any time.
          </p>
          <p className="dark-gray-text">
            Thank you for giving us your time, and look forward to more content soon.
          </p>
          <p className="dark-gray-text italic marg-bot-2">
            - The Nalda team
          </p>
        </div>
      </Thin>
    );
  }
}

export default About;
