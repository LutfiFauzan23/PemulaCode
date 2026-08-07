import Constants from 'expo-constants';

export const appConfig = {
  version: Constants.expoConfig?.version ?? Constants.manifest2?.extra?.expoClient?.version,
} as const;
