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
  console.log('enters logout in actions');
  return {
    type: 'LOGOUT'
  };
}

// -----------------------------------------------------------------------------
// ---------------------------Article Actions-----------------------------------
// -----------------------------------------------------------------------------

export function openArt(article) {
  console.log('enters openArt in actions');
  return {
    type: 'OPENART',
    article,
  };
}
