var VmManager = require('../lib/vmmanager');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var vmmanager = new VmManager({
  hostname: process.env.VMMANAGER_HOSTNAME,
  username: process.env.VMMANAGER_USERNAME,
  password: process.env.VMMANAGER_PASSWORD
});

vmmanager.vm
  .restart(vm_id_here)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err.message);
  });
