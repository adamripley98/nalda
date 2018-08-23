import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/images/logos/logo-text.svg';

export default () => (
  <div className="nalda-logo-container">
    <Link to="/">
      <Logo className="nalda-logo" />
    </Link>
  </div>
);
