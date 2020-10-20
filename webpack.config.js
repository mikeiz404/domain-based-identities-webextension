module.exports =
{
    mode: 'development',
    resolve:
    {
        modules:
        [
            'node_modules',
            './src/'
        ]
    },
    devtool: 'source-map',
    entry:
    {
        background: './src/background/background.js',
        page_action: './src/chrome/page_action.js'
    },
    output:
    {
        filename: './[name].js',
    }
}


// const path = require('path')
// const common =
// {
//     mode: 'development',
//     resolve:
//     {
//         modules:
//         [
//             'node_modules'
//         ]
//     },
//     devtool: 'source-map'
// }

// const background =
// {
//     ...common,
//     entry:
//     {
//         background: './src/background/background.js',
//     },
//     output:
//     {
//         filename: './[name].js'
//     }
// }

// const pageAction =
// {
//     ...common,
//     entry:
//     {
//         page_action: './src/chrome/page_action.js'
//     },
//     output:
//     {
//         filename: './[name].js',
//         path: __dirname + '/dist/chrome'
//     }
// }

// module.exports =
// [
//     background,
//     pageAction
// ]

// module.exports =
// {
//     mode: 'development',
//     entry:
//     {
//         background: './src/background/background.js',
//         page_action: './src/chrome/page_action.js'
//     },
//     output:
//     {
//         filename: './[name].js'
//     },
//     devtool: 'source-map',
//     resolve:
//     {
//         modules: [
//             'node_modules',
//             path.resolve(__dirname, 'src')
//         ]
//     },

//     // module:
//     // {
//     //     rules:
//     //     [
//     //         {
//     //             test: /\.js$/,
//     //             exclude: /(node_module|bower_components)/,
//     //             loader: 'babel-loader',
//     //             options:
//     //             {
//     //                 presets: [['@babel/preset-env', {"targets": {"firefox": "79"}}]],
//     //                 plugins:
//     //                 [
//     //                     '@babel/plugin-transform-spread',
//     //                     ['@babel/plugin-transform-destructuring', {"loose": true}]
//     //                 ]
//     //             }
//     //         }
//     //     ]
//     // }
// }