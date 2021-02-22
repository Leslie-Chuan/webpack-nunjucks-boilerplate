
const fs = require('fs');
const nunjucks = require('nunjucks');

module.exports = function (source) {
  // TODO mock xxx.json数据
  console.info('source===》', source);
  const jsonPath = this.resourcePath.replace(/\.html/, '.json');
  if (fs.existsSync(jsonPath)) {
    console.log(jsonPath);
  }

  // TODO 注入bsm nunjucks上下文变量

  return nunjucks.renderString(source, {});
};
