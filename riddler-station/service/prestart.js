var exec = require('child_process').execSync;
try {
  process.chdir('/home/pi/riddler/riddler-station/');
}
catch (err) {
  console.log('sorry no folder');
  process.exit(1);
}

exec('git pull', function(error, stdout, stderr) {
  if (error) {
   	 console.log('could not pull running');
  }
  else {
  	exec('npm i');
  }
});