// reducer which handles all events related to article process
const articleReducer = (state = {}, action) => {
  switch (action.type) {
    // When specific article is opened
    case 'OPENART': {
      console.log('enters open article');
      const newState = Object.assign({}, state);
      newState.article = action.article;
      return newState;
    }
    default:
      return state;
  }
};

export default articleReducer;
