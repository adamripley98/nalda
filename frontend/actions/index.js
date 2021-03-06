// Actions which will be dispatched to the reducers (authReducer.js)

// Dispatch login action, will call appropriate reducer (authReducer.js)
export function login(userId, userType, name, location, profilePicture) {
  return {
    type: 'LOGIN',
    userId,
    userType,
    name,
    location,
    profilePicture,
  };
}

// Dispatch register action, will call appropriate reducer (authReducer.js)
export function register(userId, userType, name, location, profilePicture) {
  return {
    type: 'REGISTER',
    userId,
    userType,
    name,
    location,
    profilePicture,
  };
}

// Dispatch logout action, will call appropriate reducer (authReducer.js)
export function logout() {
  return {
    type: 'LOGOUT'
  };
}

// Dispatch an action to change name
export function changeFullName(name) {
  return {
    type: 'NAMECHANGE',
    name,
  };
}

// Dispatch an action to change profile picture
export function changeProfilePicture(profilePicture) {
  return {
    type: 'PROFILEPICTURECHANGE',
    profilePicture,
  };
}

// Dispatch an action to change location
export function changeUserLocation(location) {
  return {
    type: 'LOCATIONCHANGE',
    location,
  };
}
