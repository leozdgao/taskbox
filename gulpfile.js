var fp = require('path')
var fs = require('fs')
var glob = require('glob')
var gulp = require('gulp')
var concat = require('gulp-concat')
var rev = require('gulp-rev')
var uglify = require('gulp-uglify')

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

var assets = getAssetsFromNodeModules([
  ['react', 'dist', 'react-with-addons.min.js'],
  ['react-dom', 'dist', 'react-dom.min.js'],
  ['react-router', 'umd', 'ReactRouter.min.js'],
  ['redux', 'dist', 'redux.min.js'],
  ['react-redux', 'dist', 'react-redux.min.js'],
  ['socket.io-client', 'socket.io.js']
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
    done()
  })
})

// concat assets
gulp.task('default', function () {
  return gulp.src(assets)
    .pipe(concat('assets.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(assetsDest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(assetsDest))
})
