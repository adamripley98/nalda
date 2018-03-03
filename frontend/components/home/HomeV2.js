// Import frameworks
import React from 'react';
import axios from 'axios';

// Import components
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import Blurb from '../shared/Blurb';
import Banner from './Banner';

/**
 * Component for the homepage of the application
 */
class HomeV2 extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      error: "",
      banner: [],
    };
  }

  /**
   * Load data once the component mounts
   * Pulls articles, listings, and videos simulatneously
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    // Janky way of dealing with Facebook Oauth url issue
    if (window.location.hash === '#_=_') {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split('#')[0])
        : window.location.hash = '';
    }

    // Pull all articles, listings, and videos from the database
    axios.get('/api/home/testing')
      .then((resp) => {
        if (resp.data.success) {
          console.log('data', resp.data.data);
          this.setState({
            ...resp.data.data,
            pending: false,
            error: "",
          });
        } else {
          this.setState({
            pending: false,
            error: resp.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  /**
   * When the component updates
   */
  componentDidUpdate() {
    // Update the page title
    document.title = "Nalda";
  }

  // Function to render the component
  render() {
    if (this.state.pending) return (<Loading />);
    return (
      <div>
        <Banner banners={this.state.banner} />
        <div className="container">
          <div className="space-1"/>
          <ErrorMessage error={ this.state.error } />
          this is the new home
          <div className="space-2" />
        </div>
      </div>
    );
  }
}

export default HomeV2;
