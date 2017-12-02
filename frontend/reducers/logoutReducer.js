// reducer which handles all events related to user login process
const logoutReducer = (state = {}, action) => {
  switch (action.type) {
      // When logout event is called, will update redux state so no user is logged in
      // TODO: will likely have to clear entire newState, not just userId
    case 'LOGOUT': {
      const newState = Object.assign({}, state);
      newState.userId = null;
      return newState;
    }
    default:
      return state;
  }
};

export default logoutReducer;
