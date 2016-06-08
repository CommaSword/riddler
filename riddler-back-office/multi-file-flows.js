/**
 * Created by amira on 26/5/16.
 * manages flows in several json files, one per tab
 */
var when = require('when');
var _ = require('lodash');
var fse = require('fs-extra');
var path = require("path");
var promiseDir = when.lift(fse.mkdirs);
var promiseRemove = when.lift(fse.remove);

var FS_MODULE_PATH = 'node-red/red/runtime/storage/localfilesystem';
function getFileSystemStorageModule(){
	var result = require(FS_MODULE_PATH);
	var name = require.resolve(FS_MODULE_PATH);
	delete require.cache[name];
	return result;
}

function getTabSettings(settings, path) {
	var customSettings = {flowFile : path};
	customSettings.__proto__ = settings;
	return customSettings;
}

function forEachTabFile(tabsPath, action){
	return when.promise(function(resolve) {
		fse.walk(tabsPath)
			.on('readable', function () {
				var item;
				while (item = this.read()) {
					var name = path.relative(tabsPath, item.path);
					if (item.stats.isFile() && name.match(/^[0-9a-fA-F\.]+.json$/)){
						action(item);
					}
				}
			})
			.on('end', resolve);
	});
}

module.exports = function multiFileFlows(localFileSystemFactory){
	localFileSystemFactory = localFileSystemFactory || getFileSystemStorageModule;
	// private state
	var state = {
		defaultMgr : localFileSystemFactory(),
		tabMgrs : {},
		initSettings:null,
		tabsDirPath:null
	};
	var result = {
		init: function init(settings){
			state.initSettings = settings;
			return state.defaultMgr.init(state.initSettings)
				.then(function() {
					state.tabsDirPath = path.join(state.initSettings.userDir, 'tabs');
					return promiseDir(state.tabsDirPath);
				})
				.then(function() {
					return forEachTabFile(state.tabsDirPath,
						function(file){
							state.tabMgrs[file.path] = localFileSystemFactory();
						});
				})
				.then(function() {
					return when.map(Object.keys(state.tabMgrs), function (path) {
						return state.tabMgrs[path].init(getTabSettings(state.initSettings, path));
					});
				});
		},
		getFlows: function getFlows(){
			return state.defaultMgr.getFlows()
				.then(function(flows) {
					return when.map(Object.keys(state.tabMgrs), function (path) {
						return state.tabMgrs[path].getFlows();
					}).then(function(flowsArr) {
						return flows.concat.apply(flows, flowsArr);
					});
				})
		},
		saveFlows: function saveFlows(flows) {
			// clean old tabs older
			var tabIds = flows.filter(function (node) {
				return node && node.type === 'tab';
			}).map(function(tab){return tab.id;});
			var tabPaths = tabIds.map(function (tabId) {
				return path.join(state.tabsDirPath, tabId + '.json');
			});
			var existingPaths = _.intersection(Object.keys(state.tabMgrs), tabPaths);
			var removedPaths = _.difference(Object.keys(state.tabMgrs), tabPaths);
			var addedPaths = _.difference(tabPaths, Object.keys(state.tabMgrs));
			var nextTabsObject = {};
			existingPaths.forEach(function (tabPath) {
				nextTabsObject[tabPath] = state.tabMgrs[tabPath]
			});
			// remove deleted tabs files
			return when.map(removedPaths, promiseRemove)
				.then(function () {
					// initialize new tabs manager objects
					return when.map(addedPaths, function (tabPath) {
						nextTabsObject[tabPath] = localFileSystemFactory();
						return nextTabsObject[tabPath].init(getTabSettings(state.initSettings, tabPath));
					});
				}).then(function () {
					// sift and save each tab's flows
					return when.map(tabIds, function (tabId, i) {
						var tabData = _.remove(flows, function (node) {
							return node && (node.id === tabId || node.z === tabId);
						});
						return nextTabsObject[tabPaths[i]].saveFlows(tabData);
					});
				})
				.then(function () {
					// save the remainder to the main file
					return state.defaultMgr.saveFlows(flows);
				});
		}
	};
	// all other methods simply delegate
	result.__proto__ = state.defaultMgr;
	return result;
};