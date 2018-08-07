import React from 'react';

import SocialLinks from './SocialLinks';
import LegalLinks from './LegalLinks';

export default () => (
  <div className="container">
    <div className="footer-legal">
      <div className="footer-flex">
        <LegalLinks />
        <SocialLinks />
      </div>
    </div>
  </div>
);
