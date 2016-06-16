/**
 * Created by amira on 14/6/16.
 */


function transformOptions(opt) {
	if (opt.group === 'shazam!') {
		opt.group = opt.node.z;
	}
}

module.exports = function() {
	spoon('node-red-contrib-ui/ui', function(originalUi){
		return function spoonNodeRedUi(RED) {
			var result = originalUi(RED);
			var originalAdd = result.add;
			result.add = function(opt) {
				transformOptions(opt);
				return originalAdd(opt);
			};
			return result;
		}
	});
};

function spoon(address, spooner){
	var pathToSpoon = require.resolve(address);
	var original = require(pathToSpoon);
	require.cache[pathToSpoon].exports = spooner(original);
}