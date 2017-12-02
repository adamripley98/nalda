// -----------------------------------------------------------------------------
// ---------------------------Authentication Actions----------------------------
// -----------------------------------------------------------------------------

// Dispatch login action, will call appropriate reducer (authReducer.js)
export function login(userId) {
  return {
    type: 'LOGIN',
    userId
  };
}

// Dispatch register action, will call appropriate reducer (authReducer.js)
// TODO: potentially will need userId here too, not for now though
export function register() {
  return {
    type: 'REGISTER',
  };
}

// Dispatch logout action, will call appropriate reducer (authReducer.js)
export function logout() {
  return {
    type: 'LOGOUT'
  };
}
