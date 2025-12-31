// utils/authStorage.ts
import * as Keychain from 'react-native-keychain';

const SERVICE = 'auth_tokens';

type TokenTuple = [access: string, refresh: string];

export async function saveTokens(access: string, refresh: string): Promise<void> {
  console.warn('[authStorage] save Tokens');
  await Keychain.setGenericPassword(
    'tokens',
    JSON.stringify({ access, refresh }),
    { service: SERVICE }
  );
}

export async function getAccessToken(): Promise<TokenTuple | null> {
  const result = await Keychain.getGenericPassword({ service: SERVICE });

  console.warn('[authStorage] raw keychain result:', result);

  if (!result) return null;

  try {
    const parsed = JSON.parse(result.password);
    console.warn('[authStorage] parsed value:', parsed);

    if (
      typeof parsed?.access === 'string' &&
      typeof parsed?.refresh === 'string'
    ) {
      return [parsed.access, parsed.refresh];
    }

    console.warn('[authStorage] Invalid token shape');
    return null;
  } catch (err) {
    console.error('[authStorage] Failed to parse tokens', err);
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
