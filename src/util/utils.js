// This module exports a logger object that uses the 'tracer' library
module.exports = {
  logger: require('tracer').console({
    level: 'info',
    format: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
    dateformat: 'HH:MM:ss.L',
    preprocess: (data) => {
      data.title = data.title.toUpperCase();
    }
  })
};