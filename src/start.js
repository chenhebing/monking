require('@babel/polyfill');
require('@babel/register')({
    extends: require.resolve('../.babelrc'),
    ignore: [/node_modules/]
});
require('./entry');
