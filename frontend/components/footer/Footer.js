import React from 'react';

import Top from './Top';
import Bottom from './Bottom';

class Footer extends React.Component {
  componentDidMount() {
    const expandables = document.querySelectorAll(".expandable-toggle");
    expandables.forEach(expandable => {
      expandable.addEventListener('click', () => {
        expandable.parentNode.classList.toggle("expanded");
      });
    });
  }

  render() {
    return (
      <footer id="nalda-footer">
        <Top />
        <Bottom />
		  </footer>
    );
  }
}

export default Footer;
