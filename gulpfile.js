var fp = require('path')
var fs = require('fs')
var glob = require('glob')
var gulp = require('gulp')
var concat = require('gulp-concat')
var rev = require('gulp-rev')
var uglify = require('gulp-uglify')
var minifyCSS = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')

var getAssetsFromNodeModules = function (assets) {
  return assets.map(function (paths) {
    return fp.join.bind(fp, './node_modules/').apply(fp, paths)
  })
}
var getPrimitiveValue = function (obj, ret) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue

    var val = obj[key]
    if (typeof val === 'object') getPrimitiveValue(val, ret)
    else ret.push(val)
  }

  return ret
}
var assetsDest = './server/assets'
var joinDestPath = function (path) {
  return fp.join(assetsDest, path)
}

var jsAssets = getAssetsFromNodeModules([
  ['react', 'dist', 'react-with-addons.min.js'],
  ['react-dom', 'dist', 'react-dom.min.js'],
  ['react-router', 'umd', 'ReactRouter.min.js'],
  ['redux', 'dist', 'redux.min.js'],
  ['react-redux', 'dist', 'react-redux.min.js'],
  ['socket.io-client', 'socket.io.js']
])
var cssAssets = getAssetsFromNodeModules([
  ['highlight.js', 'styles', 'tomorrow.css'],
  ['bootstrap', 'dist', 'css', 'bootstrap.min.css'],
  ['animate.css', 'animate.min.css'],
  // ['font-awesome', 'css', 'font-awesome.min.css']
])

gulp.task('clean', function (done) {
  ([ 'assets-client.json', 'rev-manifest.json' ]).forEach(function (manifestFile) {
    try {
      var content = fs.readFileSync(fp.join(assetsDest, manifestFile))
      var manifest = JSON.parse(content)
      getPrimitiveValue(manifest, []).forEach(function (name) {
        fs.unlinkSync(fp.join(assetsDest, name))
      })
    }
    catch (e) { }
  })

  glob(assetsDest + "/*.map", function (er, files) {
    files.map(fs.unlinkSync)

    try {
      ([joinDestPath('assets.js'), joinDestPath('vendor.css')]).forEach(fs.unlinkSync)
    }
    catch (e) { }

    done()
  })
})

// concat assets
gulp.task('default', ['rev'])

gulp.task('js', function () {
  return gulp.src(jsAssets)
    .pipe(concat('assets.js'))
    .pipe(uglify())
    .pipe(gulp.dest(assetsDest))
})

gulp.task('css', function () {
  gulp.src(cssAssets)
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(assetsDest))
})

gulp.task('rev', [ 'js', 'css'], function () {
  gulp.src([
    joinDestPath('assets.js'),
    joinDestPath('vendor.css')
  ]).pipe(rev())
    .pipe(gulp.dest(assetsDest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(assetsDest))
})
