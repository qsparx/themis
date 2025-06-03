const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'wasm'
);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  process: require.resolve('process/browser'),
};

config.transformer = {
  ...config.transformer,
  // Needed for global injection (optional if you're doing it manually)
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

module.exports = config;
