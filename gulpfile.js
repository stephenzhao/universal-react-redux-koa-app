var gulp = require('gulp');
var webpack = require('webpack');
var gutil = require('gulp-util');
var del = require('del');
var fs = require('fs');

var devWebpackConfig = require('./webpack.dev.config.js');
var config = require('./config.json');
var dest = config.dest;
var assetConfigPath = dest + '/asset.config.json';

function updateAssetConfigFile (stats, cb) {
    var chunks = stats.toJson().chunks;

    writeAssetConfigFile({
        app: chunks[0].files[0],
        style: chunks[0].files[1],
        lib: chunks[1].files[0]
    }, function (err) {
        if (err) {
            return cb(err);
        }

        buildHTML(cb);
    });
}

function writeAssetConfigFile(obj, callback) {
    fs.access(assetConfigPath, fs.F_OK, function (err) {
        if (err) {
            fs.writeFile(assetConfigPath, JSON.stringify(obj), callback);
            return;
        }

        fs.readFile(assetConfigPath, function (err, config) {
            config = JSON.parse(config.toString());
            config = Object.assign({}, config, obj);
            fs.writeFile(assetConfigPath, JSON.stringify(config), callback);
        });
    });
}

function buildHTML (cb) {
    var html = fs.readFileSync('./src/app/index.html');
    var config = fs.readFileSync(assetConfigPath);

    html = html.toString();
    config = JSON.parse(config.toString());

    html = html.replace('<%= APPJS %>', config.app)
               .replace('<%= LIBJS %>', config.lib)
               .replace('<%= STYLE %>', config.style);

    fs.writeFile(dest + '/index.html', html, cb);
}

gulp.task('clean', function() {
    del([dest], { force: true });
});

/* for dev */
gulp.task('webpack-dev', function(cb) {
    webpack(devWebpackConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('[webpack-dev]', err);
        }

        gutil.log('[webpack-dev]', stats.toJson().time + 'ms');

        updateAssetConfigFile(stats, cb);
    });
});

gulp.task('webpack', function (cb) {
    webpack(require('./webpack.config.js'), function (err, stats) {
        if (err) {
            throw new gutil.PluginError('[webpack]', err);
        }

        gutil.log("[webpack]", stats.toJson().time + 'ms');

        updateAssetConfigFile(stats, cb);
    });
});

gulp.task('html', buildHTML);

gulp.task('watch', function () {
    var compiler = webpack(devWebpackConfig);

    gulp.watch(['./src/app/index.html'], ['html']);

    compiler.watch({}, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('[webpack-dev]', err);
        }
        updateAssetConfigFile(stats, function () {
            gutil.log("[watch done]", stats.toJson().time + 'ms');
        });
    });
});

gulp.task('build', ['webpack']);
gulp.task('build-dev', ['webpack-dev']);