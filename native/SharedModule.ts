import { NativeModules } from "react-native";

const { SharedModule } = NativeModules;

export const validateEmail = (email: string): Promise<boolean> =>
  SharedModule.validateEmail(email);
EOF