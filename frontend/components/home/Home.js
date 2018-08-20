// Import frameworks
import React from 'react';
import axios from 'axios';

// Import components
import LoadingHome from './LoadingHome';
import ErrorMessage from '../shared/ErrorMessage';
import Banner from './Banner';
import ListingCategories from './ListingCategories';
import Tags from '../shared/Tags';
import Components from './Components';

/**
 * Component for the homepage of the application
 */
class Home extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      error: '',
      banner: [],
      components: [],
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
    axios.get('/api/home/')
      .then(resp => {
        this.setState({
          banner: resp.data.banner,
          components: resp.data.components,
          pending: false,
          error: '',
        });
      })
      .catch(error => {
        this.setState({
          pending: false,
          error: error.response.data.error || error.response.data || 'Something went wrong. Please try again later.',
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
    if (this.state.pending) return (<LoadingHome />);

    return (
      <div>
        <Tags />
        <Banner banner={this.state.banner} />

        {/* <Banner banners={this.state.banner} /> */}

        <div className="container">
          {(!this.state.banner || !this.state.banner.length) && (
            <div className="space-1" />
          )}

          <ErrorMessage error={this.state.error} />

          <ListingCategories />

          <Components components={this.state.components} />

          <div className="space-2 hidden-md-down" />
        </div>
      </div>
    );
  }
}

export default Home;
