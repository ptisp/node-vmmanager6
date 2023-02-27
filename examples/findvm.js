var VmManager = require('../lib/vmmanager');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var vmmanager = new VmManager({
  hostname: process.env.VMMANAGER_HOSTNAME,
  username: process.env.VMMANAGER_USERNAME,
  password: process.env.VMMANAGER_PASSWORD
});

vmmanager.getVms()
  .then((data) => {
    console.log(data);
    var vm = data.list.find(function(vm){
      return vm.domain === HOSTNAME_GOES_HERE;
    });
    vmmanager.vm.get(vm.id)
      .then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err.message);
      });
      console.log()
  })
  .catch((err) => {
    console.log(err.message);
  });