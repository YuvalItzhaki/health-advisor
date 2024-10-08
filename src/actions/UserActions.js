import AppDispatcher from '../dispatcher/dispatcher';
import Cookies from 'js-cookie';

const UserActions = {
  updateUser(user) {
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(user));

    AppDispatcher.dispatch({
      actionType: 'UPDATE_USER',
      user: user
    });
  },
  logout() {
    // Clear user data from localStorage on logout
    localStorage.removeItem('user');
    Cookies.remove('googleId');

    AppDispatcher.dispatch({
      actionType: 'LOGOUT'
    });
  }
};

export default UserActions;
