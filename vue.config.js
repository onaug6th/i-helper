/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'eval-source-map';
    } else {
      config.optimization.minimizer[0].options.terserOptions.warnings = false;
    }

    return {
      resolve: {
        alias: {
          '@render': resolve('src/render')
        }
      }
    };
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'IHelper',
        appId: 'com.onaug6th.app',
        copyright: 'onaug6th',
        compression: 'store',

        //  macOS打包配置
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        mac: {
          icon: './public/icon.icns',
          target: 'pkg',
          extendInfo: {
            LSUIElement: 1
          }
        },
        //  macOS

        win: {
          target: ['nsis', 'zip'],
          //  win下的程序图标
          icon: './public/app.ico'
        },
        nsis: {
          // 一键安装
          oneClick: false,
          // 注册表名
          // guid: 'xxxx',
          // 是否开启安装时权限限制（此电脑或当前用户）
          perMachine: true,
          // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowElevation: true,
          // 允许修改安装目录
          allowToChangeInstallationDirectory: true,
          // 安装图标
          installerIcon: './public/favicon.ico',
          // 卸载图标
          uninstallerIcon: './public/favicon.ico',
          // 安装时头部图标
          installerHeaderIcon: './public/favicon.ico',
          // 创建桌面图标
          createDesktopShortcut: true,
          // 创建开始菜单图标
          createStartMenuShortcut: true,
          // 图标名称
          shortcutName: 'iHelper'
        }
      }
    },
    'style-resources-loader': {
      preProcessor: 'less',
      // 引入全局样式变量
      patterns: [resolve('src/render/style/index.less')]
    }
  },
  devServer: {
    port: 9527,
    overlay: {
      warnings: true,
      errors: true
    }
  }
};
