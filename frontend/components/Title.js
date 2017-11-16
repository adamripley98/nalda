import React from 'react';
import PropTypes from 'prop-types';
// import Register from './auth/Register.js';
// import Login from './auth/Login.js';
// import Home from './Home.js';

// const Title = ( { name } ) => {
//     return (
//     );
// };

class Title extends React.Component {
    render() {
        return (
            <h1> This is the title </h1>
        );
    }
}

Title.propTypes = {
    name: PropTypes.string,
};


export default Title;
