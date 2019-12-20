const {
    merge,
    es,
    react,
    legacyDecorators,
    proposals,
    debugPlugins,
} = require('./babel');

const config = merge(
    es(),
    react(),

    legacyDecorators(),

    proposals(),
    debugPlugins()
);

// скрытый параметр для полной отладки смерженного конфига
if (process.env.DEBUG === '2') {
    console.log('');
    console.log('babel');
    console.dir(config);
}

module.exports = config;
