import React from 'react';
import GrayWrapper from './shared/GrayWrapper';

/**
 * Component for the homepage of the application
 */
class Home extends React.Component {
  // Function to render the component
    logout() {
        // console.log('logging you out!');
        // axios.post('/logout')
        //   .then((resp) => {
        //       console.log('what is resp', resp.data);
        //   })
        //   .catch((err) => {
        //       console.log('there was an error', err);
        //   });
    }

    render() {
        return (
          <GrayWrapper>
            <div>
              <h1 className="marg-bot-0">
                Hello there! This is home component
              </h1>
              <h5 onClick={() => this.logout()}>Logout by clicking here</h5>
            </div>
          </GrayWrapper>
        );
    }
}

export default Home;
