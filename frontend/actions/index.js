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
export function register(userId) {
  return {
    type: 'REGISTER',
    userId,
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
