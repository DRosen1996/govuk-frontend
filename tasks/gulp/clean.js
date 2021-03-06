'use strict'

const gulp = require('gulp')
const taskArguments = require('./task-arguments')
const del = require('del')

// Clean task for a specified folder --------------------
// Removes all old files, except for package.json
// and README in all package
// ------------------------------------------------------

gulp.task('clean', () => {
  let destination = taskArguments.destination

  if (destination === 'packages') {
    return del.sync([
      `${destination}/**`,
      `!${destination}`,
      `!${destination}/*`,
      `!${destination}/**/package.json`,
      `!${destination}/all/README.md`
    ])
  } else {
    return del.sync([
      `${destination}/**/*`
    ])
  }
})
