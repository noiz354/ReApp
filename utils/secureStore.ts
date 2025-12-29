// src/utils/secureStore.ts
import * as Keychain from 'react-native-keychain';

export async function saveSecure(key: string, value: string) {
  await Keychain.setGenericPassword(key, value, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
}

export async function loadSecure(key: string) {
  const res = await Keychain.getGenericPassword();
  return res ? res.password : null;
}
