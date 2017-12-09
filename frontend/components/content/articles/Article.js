import React from 'react';
import GrayWrapper from '../../shared/GrayWrapper';

/**
 * Component to render an article
 */
class Article extends React.Component {
  /**
   * TODO remove dummy state
   */

  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      title: "This is the title of the article",
      subtitle: "This is the subtitle of the article you are reading",
      image: "http://static4.businessinsider.com/image/54e603b169bedd9e443cbd85-1190-625/law-professors-say-upenns-sexual-assault-policy-is-unfair-to-accused-rapists.jpg",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis pretium massa. Duis quis purus gravida lectus euismod vestibulum eu ut purus. Fusce ut elementum elit, vel suscipit tellus. Aliquam viverra luctus nunc non ornare. Nunc a erat viverra, faucibus risus ut, tempor dolor. Quisque non risus lacinia, lacinia velit at, convallis sem. Cras cursus imperdiet mollis. Sed id nibh eu ligula auctor pellentesque in ac sapien. Etiam in diam quis odio fermentum finibus vitae non diam. Proin malesuada libero eu ligula facilisis vehicula.\n\nMorbi sollicitudin nec nisi id ultricies. Sed id nisl non tellus varius fermentum a at magna. Suspendisse at commodo nunc. Aliquam vel purus volutpat odio imperdiet vehicula nec eget turpis. Mauris lobortis, nisl quis congue ultrices, lacus odio suscipit lectus, eu volutpat ipsum ligula a magna. Sed ut dignissim leo. Mauris vel neque libero. Vestibulum eleifend est eget venenatis vestibulum.",
      user: {
        name: "Adam Ripley",
        profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      }
    };

    // Bind this to helper methods
    this.renderAuthor = this.renderAuthor.bind(this);
  }

  // Helper method to render the author
  renderAuthor() {
    return(
      <div className="author">
        <div className="author-img" style={{ backgroundImage: `url(${this.state.user.profilePicture})` }}/>
        <div className="text">
          <p className="name">
            { this.state.user.name }
          </p>
          <p className="timestamp">
            A few hours ago
          </p>
        </div>
      </div>
    );
  }

  // Render the component
  render() {
    return (
      <GrayWrapper>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <div className="card article pad-1">
                <h1>
                  { this.state.title }
                </h1>
                <h3>
                  { this.state.subtitle }
                </h3>
                { this.renderAuthor() }
                <img src={ this.state.image } alt={ this.state.title } className="img-fluid" />
                <p>
                  { this.state.body }
                </p>
              </div>
            </div>
          </div>
        </div>
      </GrayWrapper>
    );
  }
}

export default Article;
