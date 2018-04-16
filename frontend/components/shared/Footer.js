// Import frameworks
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the footer at the bottom of the screen on all pages.
 */
class Footer extends React.Component {
  componentDidMount() {
    const expandables = document.querySelectorAll(".expandable-toggle");
    expandables.forEach(expandable => {
      expandable.addEventListener('click', () => {
        expandable.parentNode.classList.toggle("expanded");
      });
    });
  }

  renderFooterLegal() {
    return (
      <div className="container">
        <div className="footer-legal">
          <div className="footer-flex">
            <div className="footer-legal-content">
              <ul className="footer-nav">
                <li className="footer-nav-item">
                  <Link to="/about">
                    About Nalda
                  </Link>
                </li>
                <li className="footer-nav-item">
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </li>
                <li className="footer-nav-item">
                  <Link to="/credits">
                    Credits
                  </Link>
                </li>
                <li className="footer-nav-item">
                  <Link to="/terms">
                    Terms of Use
                  </Link>
                </li>
                <li className="footer-nav-item">
                  <Link to="/privacy">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
              <p className="legal-copy">
                Copyright &copy; 2018 Nalda. All rights reserved.
              </p>
            </div>

            <div className="footer-social-links">
              <ul className="footer-social-icons">
                <li className="gf-social-item">
                  <Link to="http://facebook.com/edwardkim.co" target="_blank" className="gf-facebook">
                    <i className="fa fa-facebook fa-lg" />
                  </Link>
                </li>
                <li className="gf-social-item">
                  <Link to="http://twitter.com/imedwardkim" target="_blank" className="gf-twitter">
                    <i className="fa fa-twitter fa-lg" />
                  </Link>
                </li>
                <li className="gf-social-item">
                  <Link to="http://instagram.com/imedwardkim" target="_blank" className="gf-instagram">
                    <i className="fa fa-instagram fa-lg" />
                  </Link>
                </li>
                <li className="gf-social-item">
                  <Link to="http://instagram.com/imedwardkim" target="_blank" className="gf-youtube">
                    <i className="fa fa-youtube-play fa-lg" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderFooterContent() {
    return (
      <div className="container">
        <div className="footer-navigation">
          <div className="nalda-logo-container">
            <Link to="/">
              <div className="nalda-logo" />
            </Link>
          </div>
          <div className="footer-menus">
            <div className="footer-flex">
              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">
                    Quick Eats
                  </p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li>
                    <Link to="/listings/categories/foodTrucks">
                      Food Trucks
                    </Link>
                  </li>
                  <li>
                    <Link to="/listings/categories/lateNights">
                      Late Nights
                    </Link>
                  </li>
                  <li>
                    <Link to="/listings/categories/healthy">
                      Healthy
                    </Link>
                  </li>
                </nav>
              </div>

              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">Adventure</p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li><Link to="/listings/categories/holeInTheWall">Hole in the Wall</Link></li>
                  <li><Link to="/listings/categories/showingOff">Showing Off</Link></li>
                  <li><Link to="/listings/categories/forTheGram">#forthegram</Link></li>
                </nav>
              </div>

              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">Special</p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li><Link to="/listings/categories/dateNight">Date Night</Link></li>
                  <li><Link to="/listings/categories/formals">Formals</Link></li>
                  <li><Link to="/listings/categories/birthdays">Birthdays</Link></li>
                </nav>
              </div>

              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">With Friends</p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li><Link to="/listings/categories/treatYourself">Treat Yourself</Link></li>
                  <li><Link to="/listings/categories/adulting">#Adulting</Link></li>
                  <li><Link to="/listings/categories/feelingLazy">Feeling Lazy</Link></li>
                </nav>
              </div>

              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">Drinking</p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li><Link to="/listings/categories/bars">Bars</Link></li>
                  <li><Link to="/listings/categories/byos">BYOs</Link></li>
                  <li><Link to="/listings/categories/speakeasies">Speakeasies</Link></li>
                </nav>
              </div>

              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">Hangout</p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li><Link to="/listings/categories/forTheSweetTooth">Sweet Tooth</Link></li>
                  <li><Link to="/listings/categories/forTheStudyGrind">Study Grind</Link></li>
                  <li><Link to="/listings/categories/openLate">Open Late</Link></li>
                </nav>
              </div>

              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">Brunch</p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li><Link to="/listings/categories/parentsVisiting">Parents Visiting</Link></li>
                  <li><Link to="/listings/categories/gotPlasteredLastNight">Got Plastered</Link></li>
                </nav>
              </div>

              <div className="footer-menu-single">
                <div className="expandable-toggle">
                  <p className="footer-menu-heading">Curated</p>
                  <div className="footer-expand-icon" />
                </div>
                <nav className="footer-menu-list">
                  <li><Link to="/listings">Recommended</Link></li>
                  <li><Link to="/articles">Featured</Link></li>
                  <li><Link to="/videos">Videos</Link></li>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the component
  render() {
    return (
      <footer id="nalda-footer">
			  {this.renderFooterContent()}
        {this.renderFooterLegal()}
		  </footer>
    );
  }
}

export default Footer;
