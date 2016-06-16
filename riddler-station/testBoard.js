/**
 * Created by amira on 10/6/16.
 */

require('./detect-board')(function (config, raw) {
	console.log('\nraw value: ' + raw + '\n');
	process.exit(0);
});
