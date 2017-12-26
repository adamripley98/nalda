// -----------------------------------------------------------------------------
// ---------------------------Authentication Actions----------------------------
// -----------------------------------------------------------------------------

// Dispatch login action, will call appropriate reducer (authReducer.js)
export function login(userId, userType) {
  return {
    type: 'LOGIN',
    userId,
    userType,
  };
}

// Dispatch register action, will call appropriate reducer (authReducer.js)
export function register(userId, userType) {
  return {
    type: 'REGISTER',
    userId,
    userType,
  };
}

// Dispatch logout action, will call appropriate reducer (authReducer.js)
export function logout() {
  return {
    type: 'LOGOUT'
  };
}

// -----------------------------------------------------------------------------
// ---------------------------Article Actions-----------------------------------
// -----------------------------------------------------------------------------

export function openArt(article) {
  return {
    type: 'OPENART',
    article,
  };
}
