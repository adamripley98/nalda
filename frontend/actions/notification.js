// Action to notify an error
export const notifyError = (error) => {
  return {
    type: 'ERROR',
    error,
  };
};

// Action to notify a message
export const notifyMessage = (message) => {
  return {
    type: 'MESSAGE',
    message,
  };
};

// Action to clear notifications
export const clearNotification = () => {
  return {
    type: 'CLEAR',
  };
};
