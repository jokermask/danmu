// 加 md5

//模块开发
fis.hook('commonjs');
fis.match('/modules/**.js', {
    isMod: true
});

//图片合并
fis.match('::package', {
    spriter: fis.plugin('csssprites')
});





fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});
//fis.match('*', {
//    release: '../public'
//});


//合并一个文件
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: false
    })
});

fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css',
    optimizer: fis.plugin('clean-css'),
    useSprite: true
});

// 对 CSS 进行图片合并
fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

fis.media('debug').match('*.{js,css,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
});
