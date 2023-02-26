const path = require("path")
const VuetifyLoaderPlugin = require('./build/vuetify-loader/lib/plugin')
const JaceLoaderPlugin = require("./build/jace-loader/src/plugin")
const jaceConfig = require("./jace.config.js")
const manifestJSON = require('./public/manifest.json')


console.log("JACE CONFIG > ", JSON.stringify(jaceConfig, null," "))


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}


module.exports = {

    outputDir: '../.tmp/public',

    pwa: {
        themeColor: manifestJSON.theme_color,
        workboxOptions: {
          runtimeCaching: [
            {
                urlPattern: new RegExp('http://localhost:3000/'),
                handler: 'networkFirst',
                // options: {
                //   cacheName: 'google-fonts',
                //   expiration: {
                //     maxEntries: 30
                //   },
                //   cacheableResponse: {
                //     statuses: [0, 200]
                //   }
                // }
            },
            {    
                urlPattern: new RegExp('http://localhost:3000/design*'),
                handler: 'networkFirst'
            },
            {    
                urlPattern: new RegExp('http://localhost:3000/api*'),
                handler: 'networkFirst'
            },

          ]
        }
    },

    chainWebpack: config => {

        config.module
            .rule('raw')
            .test(/\.(txt|dps|md)$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end()
       

        config.module
            .rule('js')
            .test(/\.m?jsx?$/)
            .include
            .add(resolve('vuetify'))
            .end()

        

        config.plugin('VuetifyLoaderPlugin')
            .use(VuetifyLoaderPlugin)
            
        config.plugin('JaceLoaderPlugin')
            .use(new JaceLoaderPlugin(jaceConfig))      
        


        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => ({
                ...options,
                transformAssetUrls: {
                    // v-app-bar extends v-toolbar
                    'v-app-bar': 'src',
                    // v-carousel-item extends v-img
                    'v-carousel-item': ['src', 'lazy-src'],
                    'v-img': ['src', 'lazy-src'],
                    'v-navigation-drawer': 'src',
                    'v-parallax': 'src',
                    'v-toolbar': 'src',
                },
            }))

     	  
    }

}