import EventEmitter from 'eventemitter3';  // Import eventemitter3
import AppDispatcher from '../dispatcher/dispatcher';

const CHANGE_EVENT = 'change';  // Define the event name

let _user = null;

class UserStore extends EventEmitter {
  getUser() {
    return _user;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);  // Emit 'change' event
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);  // Add listener for 'change' event
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);  // Remove listener for 'change' event
  }
}

const userStoreInstance = new UserStore();  // Create an instance of UserStore

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case 'UPDATE_USER':
      _user = action.user;
      console.log('user after register:', _user)
      userStoreInstance.emitChange();  // Emit change after updating user
      break;
    case 'LOGOUT':
      _user = null;
      userStoreInstance.emitChange();  // Emit change after logout
      break;
    default:
      // no action
  }
});

export default userStoreInstance;
