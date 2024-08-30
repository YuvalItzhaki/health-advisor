// src/store/reducers/userReducer.js
const initialState = {
    userId: null,
    // other user state fields
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
  