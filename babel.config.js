// babel.config.js - used by Expo bundler (must use babel-preset-expo)
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
    };
};
