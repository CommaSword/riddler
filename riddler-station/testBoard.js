/**
 * Created by amira on 10/6/16.
 */

require('./detect-board')(function (config, raw) {
	console.log('\n\n\nraw value: ' + raw + '\n\n\n');
	process.exit(0);
});
