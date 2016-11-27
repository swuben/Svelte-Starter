const html = require('rollup-plugin-html');
const postcss = require('rollup-plugin-postcss');
const comment = require('postcss-comment');
const modules = require('postcss-modules');
const cssnext = require('postcss-cssnext');
const rucksack = require('rucksack-css');
const cssnano = require('cssnano');
const image = require('rollup-plugin-image');
const json = require('rollup-plugin-json');
const globals = require('rollup-plugin-node-globals');
const builtins = require('rollup-plugin-node-builtins');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

module.exports = (config) => {
  let cssExportMap = {};
  config.set({
    frameworks: ['jasmine'],
    files: [
      './src/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      './src/**/*.spec.js': ['rollup']
    },
    rollupPreprocessor: {
      format: 'iife',
      sourceMap: 'inline',
      plugins: [
        html({
          htmlMinifierOptions: {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true
          }
        }),
        postcss({
          parser: comment,
          plugins: [
            modules({ getJSON(id, tokens) { cssExportMap[id] = tokens; } }),
            cssnext({ warnForDuplicates: false }),
            rucksack({ fallbacks: true, autoprefixer: true }),
            cssnano()
          ],
          getExport(id) { return cssExportMap[id]; }
        }),
        image(),
        json(),
        globals(),
        builtins(),
        resolve({ jsnext: true, browser: true }),
        commonjs(),
        babel({ exclude: 'node_modules/**' })
      ]
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    customLaunchers: {
      Chrome_no_sandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    browsers: ['Chrome_no_sandbox'],
    singleRun: true,
    concurrency: Infinity
  });

  if (process.env.TRAVIS) {
    config.rollupPreprocessor.plugins.push(require('rollup-plugin-istanbul')({ exclude: ['./src/**/*.spec.js', 'node_modules/**'] }));
    config.browsers = ['Firefox'];
    config.reporters.push('coverage');
    config.coverageReporter = { dir: 'coverage', reporters: [{ type: 'lcov' }]};
  }
};
