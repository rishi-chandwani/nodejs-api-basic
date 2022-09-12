const fs = require("fs");
const util = require("util");

const writefile = util.promisify(fs.writeFile);

class CustomLogs {
  constructor(filePath) {
    this.logFilePath = filePath;
  }

  async addCustomLogs(logType, logContent) {
    const dateObj = new Date();
    const logDate = dateObj.getFullYear() + '-' + (dateObj.getMonth()+1) + '-' + dateObj.getDate() + " " + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();
    logContent = logDate + " - " + logType.toUpperCase() + ' - ' + logContent + '\n';
    await writefile(this.logFilePath, logContent, { flag: 'a' }, err => {
      if(err) {
        console.log(`Error while adding logs in file ${this.logFilePath}`);
        console.error(err);
      }
    });
  }
}

module.exports = CustomLogs;