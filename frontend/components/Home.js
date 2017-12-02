import React from 'react';
import GrayWrapper from './shared/GrayWrapper';

/**
 * Component for the homepage of the application
 */
class Home extends React.Component {
  // Function to render the component
  render() {
    return (
      <GrayWrapper>
        <div className="container">
          <div className="space-1"/>
          <div className="row">
            <div className="col-6 col-lg-3">
              <div className="card preview">
                <h3>
                  Example article title
                </h3>
                <h4>
                  With a subtitle
                </h4>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card preview">
                <h3>
                  Example article title
                </h3>
                <h4>
                  With a subtitle
                </h4>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card preview">
                <h3>
                  Example article title
                </h3>
                <h4>
                  With a subtitle
                </h4>
              </div>
            </div>
          </div>
        </div>
      </GrayWrapper>
    );
  }
}

export default Home;
