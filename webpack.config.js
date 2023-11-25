const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js',
        publicPath: '/', // Add this line
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', 'babel-preset-preact'],
                        plugins: [
                            [require.resolve('babel-plugin-transform-react-jsx'), { pragma: 'h' }],
                            [require.resolve('babel-plugin-jsx-pragmatic'), {
                                module: 'preact',
                                export: 'h',
                                import: 'h'
                            }]
                        ]
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                minifyCSS: true
            }
        }),
        new InlineSourceWebpackPlugin({
            compress: true,
            rootpath: './src',
            noAssetMatch: 'warn'
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'build'),
        },
        port: 3000,
    }
};
