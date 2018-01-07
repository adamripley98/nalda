/**
 * Reducer which handles all events related to user authentication process
 */
const authReducer = (state = {}, action) => {
  switch (action.type) {
    // When login event is called, will update redux state with userId,
    // userType, location, and name so we know who is logged in
    case 'LOGIN': {
      const newState = Object.assign({}, state);
      newState.userId = action.userId;
      newState.userType = action.userType;
      newState.name = action.name;
      newState.location = action.location;
      return newState;
    }
    // When logout event is called, will remove user from redux state
    case 'LOGOUT': {
      const newState = Object.assign({}, state);
      newState.userId = null;
      newState.userType = null;
      newState.name = null;
      newState.location = null;
      return newState;
    }
    // When register event is called, will update redux state with userId,
    // userType, location, and name so we know who is logged in
    case 'REGISTER': {
      const newState = Object.assign({}, state);
      newState.userId = action.userId;
      newState.userType = action.userType;
      newState.name = action.name;
      newState.location = action.location;
      return newState;
    }
    // When a user changes his/her name
    case 'NAMECHANGE': {
      const newState = Object.assign({}, state);
      newState.name = action.name;
      return newState;
    }
    default:
      return state;
  }
};

export default authReducer;
