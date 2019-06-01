const gulp = require("gulp");
const babel = require("gulp-babel");

gulp.task("default", function() {
	return gulp
		.src("src/stopwatch-es6.js")
		.pipe(babel())
		.pipe(gulp.dest("dist"));
});
