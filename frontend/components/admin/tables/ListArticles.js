import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Blurb from '../../shared/Blurb';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

/**
 * Render a table listing all articles
 */
class ListArticles extends Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      articles: [],
    };
  }

  // Pull data
  componentDidMount() {
    axios.get('/api/admin/articles')
      .then(res => {
        if (res.data.error) {
          this.setState({
            pending: false,
            error: res.data.error,
          });
          return;
        }
        this.setState({
          pending: false,
          articles: res.data.articles,
        });
      })
      .catch(err => this.setState({ error: err.message }));
  }

  // Render the table
  render() {
    if (this.state.pending) return (<Loading />);
    if (this.state.error) return (<ErrorMessage error={this.state.error} />);
    if (this.state.articles && this.state.articles.length) {
      const articles = this.state.articles.map((article, i) => (
        <tr key={ article._id }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/articles/${article._id}`}>
              { article.title }
            </Link>
          </td>
          <td>
            {
              article._id
            }
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Articles
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Article ID</th>
              </tr>
            </thead>
            <tbody>
              { articles }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no articles to display." />
    );
  }
}

export default ListArticles;
