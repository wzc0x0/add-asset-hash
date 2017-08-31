```bash
##step 1 npm install gulp -g
##step 2 npm install
*step 3 npm install 安装完成后，需要修改 gulp-asset-rev 插件的源代码 路径：node_modules\gulp-asset-rev\index.js 将第80行代码 src = src.replace(verStr, '').replace(/(.[.]+)$/, verStr + "$1"); 修改为 src += '?v=' + md5;**
##也可以解压node_module.zip,已经替换好
##step 4 npm run build
```
