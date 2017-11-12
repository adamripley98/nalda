import React from 'react';
import PropTypes from 'prop-types';

const Login = ( ) => {
    return (
        <form>
          <label>
            Email:
            <input type="text" name="email" />
          </label>
          <label>
            Password:
            <input type="password" name="password" />
          </label>
          <input type="submit" value="Submit" />
        </form>
    );
};

// Login.propTypes = {
//     name: PropTypes.string,
// };


export default Login;
