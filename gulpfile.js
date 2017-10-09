var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		browserSync 	= require('browser-sync'),
		concat 				=	require('gulp-concat'),
		uglify 				= require('gulp-uglifyjs'),
		cssnano				= require('gulp-cssnano'),
		rename      	= require('gulp-rename'),
		del         	=	require('del'),
		imagemin    	= require('gulp-imagemin'),
		pngquant    	= require('imagemin-pngquant'),
		cache       	= require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	return gulp.src('src/sass/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	})
});

gulp.task('scripts', function(){
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		//add
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('css-libs',['sass'], function(){
	return gulp.src([
		'src/css/main.css',
		// add
	])
	.pipe(cssnano())
	.pipe(rename({suffix:'.min'}))
	.pipe(gulp.dest('src/css'));
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('img', function(){
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browserSync', 'css-libs', 'scripts'], function() {
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch('src/*.html', browserSync.reload)
	gulp.watch('src/js/**/*.js', browserSync.reload)
});

gulp.task('build',['clean','img','sass','scripts'], function(){
	var buildCss = gulp.src([
		'src/css/main.css',
		//add
	])
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('src/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('src/*.html')
		.pipe(gulp.dest('dist'))
});
