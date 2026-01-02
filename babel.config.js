module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators', 
      { "legacy": true } // Ensure this is a JSON object
    ],
    'react-native-reanimated/plugin',
  ]
};