var path = require('path');

module.exports = {
    mode: 'production',
    devtool: 'sourcemap',
    entry: './src/ReactMultiCrop.tsx',
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    output: {
        path: path.resolve('lib'),
        filename: 'ReactMultiCrop.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /(node_modules)/,
                use: 'ts-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    }
}