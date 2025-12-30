import * as Keychain from 'react-native-keychain';

// We use a simple callback pattern to trigger logout from non-component files
let logoutCallback: (() => void) | null = null;

export const setLogoutHandler = (callback: () => void) => {
  logoutCallback = callback;
};

export const triggerGlobalLogout = async () => {
  await Keychain.resetGenericPassword();
  if (logoutCallback) {
    logoutCallback();
  }
};