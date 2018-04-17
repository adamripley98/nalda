import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Blurb from '../../shared/Blurb';

class ListArticles extends Component {
  render() {
    if (this.props.articles && this.props.articles.length) {
      const articles = this.props.articles.map((article, i) => (
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

ListArticles.propTypes = {
  articles: PropTypes.array,
};

export default ListArticles;
