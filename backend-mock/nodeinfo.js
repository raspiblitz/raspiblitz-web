const util = require('./util');

const nodeInfo = () => {
  console.log('call to nodeinfo');

  util.sendSSE('nodeinfo', {
    name: 'myBlitz',
    torAddress: 'pg6mmjiyjmcrsslvykfwnntlaru7p5svn6y2ymmju6nubxndf4pscryd.onion',
    sshAddress: 'admin@192.168.0.1'
  });
};

module.exports = { nodeInfo };
