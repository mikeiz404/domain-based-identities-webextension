const path = require('path')

module.exports =
{
    mode: 'development',
    entry:
    {
        background: './src/background/background.js',
        page_action: './src/page_action.js'
    },
    output:
    {
        filename: './[name].js'
    },
    devtool: 'source-map',
    resolve:
    {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ]
    },

    // module:
    // {
    //     rules:
    //     [
    //         {
    //             test: /\.js$/,
    //             exclude: /(node_module|bower_components)/,
    //             loader: 'babel-loader',
    //             options:
    //             {
    //                 presets: [['@babel/preset-env', {"targets": {"firefox": "79"}}]],
    //                 plugins:
    //                 [
    //                     '@babel/plugin-transform-spread',
    //                     ['@babel/plugin-transform-destructuring', {"loose": true}]
    //                 ]
    //             }
    //         }
    //     ]
    // }
}