import React from 'react';
import PropTypes from 'prop-types';

const Register = ( ) => {
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
          <label>
            Reenter Password:
            <input type="password" name="repassword" />
          </label>
          <input type="submit" value="Submit" />
        </form>
    );
};

export default Register;
