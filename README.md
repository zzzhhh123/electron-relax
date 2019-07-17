# 做个记录怕忘

**Begin Electron**

# 用了gulp和swig模板
- `npm run dev` - 启动服务.
- `npm run build` - 编译模板、静态资源、进程文件.
- `npm run pack` - 打包.
- 先build再启服务

# 文件夹
- `template` - 模板相关，编译到 **views**.
- `public` - 静态资源相关，编译到 **assets**.
- `src` - 进程相关，编译到 **libs**`.

# 注意的点

- 打包时注释electron-connect相关、devtools相关代码
- [swig参考](http://www.iqianduan.net/blog/how_to_use_swig)

# 先这样吧，慢慢来_-_