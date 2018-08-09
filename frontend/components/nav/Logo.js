import React from 'react';
import { Link } from 'react-router-dom';

import LogoText from '../../assets/images/logos/logo-text.svg';
import Logo from '../../assets/images/logos/logo.svg';

export default () => (
  <Link to="/" className="logo">
    <LogoText className="hidden-md-down" />
    <Logo className="hidden-lg-up" />
  </Link>
);
