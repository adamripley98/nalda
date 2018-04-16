// Import frameworks
import React from 'react';
import axios from 'axios';

// Import components
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import Banner from './Banner';
import NaldaVideo from './NaldaVideo';
import ListingCategories from './ListingCategories';
import RecommendedContent from './RecommendedContent';
import Tags from '../shared/Tags';
import FromTheEditors from './FromTheEditors';

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
    axios.get('/api/home/')
      .then(resp => {
        if (resp.data.success) {
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
        <Tags />
        <Banner banners={this.state.banner} />
        <div className="container">
          <div className="space-3"/>
          <ErrorMessage error={this.state.error} />
          <ListingCategories />
          <RecommendedContent content={this.state.recommended}/>
          <FromTheEditors content={this.state.fromTheEditors}/>
          <NaldaVideo content={this.state.naldaVideos} />
          <div className="space-2 hidden-md-down" />
        </div>
      </div>
    );
  }
}

export default Home;
