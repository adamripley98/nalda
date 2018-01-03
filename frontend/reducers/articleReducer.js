// reducer which handles all events related to article process
// TODO: open articles without redux, get rid of this file
const articleReducer = (state = {}, action) => {
  switch (action.type) {
    // When specific article is opened
    case 'OPENART': {
      const newState = Object.assign({}, state);
      newState.article = action.article;
      return newState;
    }
    default:
      return state;
  }
};

export default articleReducer;
