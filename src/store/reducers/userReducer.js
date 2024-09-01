// src/store/reducers/userReducer.js
const initialState = {
    user: {
      userId: null,
      // other user-related fields
    },
    // other state fields
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER_ID':
        return {
          ...state,
          userId: action.payload,
        };
      // other actions can be handled here
      default:
        return state;
    }
  };
  
  export default userReducer;
  