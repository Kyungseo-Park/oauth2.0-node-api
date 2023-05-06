require('dotenv').config();

const commander = require('commander');
const pkg = require('../package.json');
const authorizationServer = require('./authorization-api');
const apiServer = require('./api');

// CLI 인터페이스 설정
commander
  .version(pkg.version)
  .option('-p, --port <n>', '포트 번호', parseInt)
  .parse(process.argv);


if (commander.args.length === 0) {
  commander.help();
} else {
  let port = commander.port || 3000;
  if (commander.args[0] === 'auth') {
    port = process.env.OAUTH_PORT || port
    authorizationServer.start(port);
  } else if (commander.args[0] === 'resource') {
    port = process.env.API_PORT || port
    apiServer.start(port);
  
  } else if (commander.args[0] === 'all') {
    port = process.env.OAUTH_PORT || port
    authorizationServer.start(port);

    port = process.env.API_PORT || port
    apiServer.start(port);
  } else {
    console.error(`Invalid command: ${commander.args[0]}`);
    commander.help();
  }
}
