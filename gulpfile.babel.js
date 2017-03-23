import gulp from 'gulp';
import { env } from 'gulp-util';
import runsequence from 'run-sequence';
import requiredir from 'require-dir';

requiredir('./tools/tasks');

gulp.task('default', (done) => {
  if (!env.watch && !env.serve) {
    return runsequence('build', done);
  } else if (!env.serve) {
    return runsequence('build', 'watch', done);
  } else {
    return runsequence('build', 'watch', 'serve', done);
  }
});
