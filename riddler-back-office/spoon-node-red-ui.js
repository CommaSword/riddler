/**
 * Created by amira on 14/6/16.
 */

var uiPath = require.resolve('node-red-contrib-ui/ui');

function transformOptions(opt) {
	if (opt.group === 'shazam!') {
		opt.group = opt.node.z;
	}
}

module.exports = function spoonNodeRedUi() {
	var originalUi = require(uiPath);

	function spoon(RED) {
		var result = originalUi(RED);
		var originalAdd = result.add;

		result.add = function(opt) {
			transformOptions(opt);
			return originalAdd(opt);
		};

		return result;
	}

	require.cache[uiPath].exports = spoon;
};