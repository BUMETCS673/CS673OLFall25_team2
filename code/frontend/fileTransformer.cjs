/*
 AI-generated code: 100% Tool: GPT

 Human code: 0%

 Framework-generated code: 0%
*/

const path = require('path');

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};
