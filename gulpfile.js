var gulp = require("gulp");
var clean = require("gulp-clean");
var replace = require("gulp-replace");
var fs = require("fs");
var runSequence = require("run-sequence");
var htmlmin = require("gulp-htmlmin");

gulp.task("clean", function () {
    return gulp.src("./dist", { read: false })
    .pipe(clean());
});

gulp.task("inline", function() {
    return gulp.src("src/**/*.html")
    .pipe(replace(/<link rel=\"stylesheet\" href=\"styles\.css\"[^>]*>/, function(s) {
        var style = fs.readFileSync("src/styles.css", "utf8");
        return "<style>" + style + "</style>";
    }))
    .pipe(replace(/<script src=\"scripts\.js\"[^>]*><\/script>/, function(s) {
        var script = fs.readFileSync("src/scripts.js", "utf8");
        return "<script>" + script + "</script>";
    }))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("minify", () => {
    return gulp.src(["dist/**/*.html"])
    .pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        useShortDoctype: true,
    }))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("build", (callback) => {
    runSequence("clean", "inline", "minify", callback);
});
