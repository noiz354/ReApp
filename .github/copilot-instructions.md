# Project Context: ReApp (React Native 0.83.1 / Android Target)

## Primary Instructions
- **Platform Focus**: This project exclusively targets **Android**. Ignore all iOS-related logic, `ios/` folders, CocoaPods, and lottie-ios.
- **Core Versions**: React Native 0.83.1 and React 19.2.0. Use modern React patterns (Hooks, Concurrent features).
- **Architecture**: New Architecture enabled. Refer to Kotlin entry points in `android/app/src/main/java/com/reapp/`.

## Library & API Priorities
- **State Management**: Use **Zustand** for global state (e.g., `productStore.ts`).
- **UI & Styling**: 
  - Components: Use **react-native-paper** (MD3).
  - Icons: Prioritize **lucide-react-native**.
  - Animations: Use **lottie-react-native** and **react-native-reanimated**.
  - Theming: Always import and use the centralized `theme` from `theme.ts`.
- **Networking**: 
  - Use the custom **AbstractApiClient** pattern. 
  - Do not use raw `axios` or `fetch` in UI components; utilize the `apiClient` factory.
- **Security**: Use **react-native-keychain** for sensitive tokens and **@react-native-async-storage/async-storage** for persistent non-sensitive metadata.
- **Notifications**: Use **@notifee/react-native** for local and remote notifications.

## Folder Exclusions & Search Priorities
- **IGNORE**: `ios/`, `Gemfile`, `Podfile`, `*.xcworkspace`, `vendor/`.
- **Search Exclude**: `android/app/build/`, `node_modules/`, `__tests__/`.
- **Primary Search Path**: `screens/`, `api/`, `store/`, `components/`, `navigation/`.

## Development Specifics
- **Testing**: Use **Jest** for unit tests and **Detox** for Android E2E testing (`android.debug` configuration).
- **Linting**: Follow the rules defined in `.eslintrc.js` and `.prettierrc.js`.