// -----------------------------------------------------------------------------
// ---------------------------Authentication Actions----------------------------
// -----------------------------------------------------------------------------

// Dispatch login action, will call appropriate reducer (authReducer.js)
export function login(userId, userType, name) {
  return {
    type: 'LOGIN',
    userId,
    userType,
    name,
  };
}

// Dispatch register action, will call appropriate reducer (authReducer.js)
export function register(userId, userType, name) {
  return {
    type: 'REGISTER',
    userId,
    userType,
    name,
  };
}

// Dispatch logout action, will call appropriate reducer (authReducer.js)
export function logout() {
  return {
    type: 'LOGOUT'
  };
}
