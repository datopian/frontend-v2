const gulp = require('gulp');
const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const svgSprite = require('gulp-svg-sprite');
const nodemon = require('gulp-nodemon');

// CSS
gulp.task('css', function () {
  return gulp.src('./src/css/app.css')
    .pipe(postcss([
        require('postcss-import'),
        postcssPresetEnv({
          features: {
            'nesting-rules': true
          }
        }),
        require('tailwindcss'),
        require('cssnano')
      ]))
    .pipe(gulp.dest('./opendk/public/stylesheets'));
});


// icons
gulp.task('icons', function(done) {
  gulp.src('**/*.svg', { cwd: './src/icons' })
    .pipe(svgSprite(
      config = {
        mode: {
          symbol: true
        }
      }
    ))
    .pipe(gulp.dest('./opendk/views/partials'));
    done();
});


// server
gulp.task("server", cb => {
  let started = false;

  return nodemon({
    script: 'index.js',
    options: '-e', // -e means we watch for changes in templates too
    ext: 'js html',
    env: { 'API_URL': 'https://demo.ckan.org/api/3/action/' }
  }).on("start", () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});


// watching
gulp.task('watch:css', function() {
  return gulp.watch(['./src/css/**/*.css'],
  gulp.series('css'));
});

gulp.task('watch:icons', function() {
  return gulp.watch(['./src/icons/**/*.svg'],
  gulp.series('icons'));
});


gulp.task('watch', gulp.parallel('watch:css', 'watch:icons'));

// deafult task (this task is not completing..)
gulp.task('default', gulp.parallel('watch', 'server'));
