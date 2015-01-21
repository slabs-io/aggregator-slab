"use strict";

var Q = require('q');

/**
 * process takes an array of data sources and returns a flat array of data
 * @param input {object} input settings and input data
 * @returns {object}
 */
exports.process = function(input){

	var deferred = Q.defer();

	var values = {};

	if(input.data[0]){
		values = mapReduce(input.data, function(item){
			return item.values;
		});
	}

	var labels = {};
	input.data.forEach(function(item){
		Object.keys(item.labels).forEach(function(label){
			labels[label] = item.labels[label];
		});
	});

	var seperateData = input.data.map(function(item){
		return item.data;
	});

	var catLength = input.data[0] ? input.data[0].data.length : 0;
	var i;

	var data = [];
	for(i = 0; i < catLength; i++){
		var d = {};
		seperateData.forEach(function(datum){
			var dat = datum[i];
			Object.keys(dat).forEach(function(key){
				d[key] = dat[key];
			});
		});
		data.push(d);
	}


	deferred.resolve({
		values: values,
		categories: input.data[0] ? input.data[0].categories : [],
		labels: labels,
		data: data
	});

	return deferred.promise;
};



// utils


/**
 * takes an array of arrays - maps and flattens
 * @private
 * @param arr
 * @param map
 * @returns {*}
 */
function mapReduce(arr, map){
	return arr.map(map).reduce(flatten);
}

/**
 * for use with Array.prototype.reduce
 * reduces array of array into flat array
 * @private
 * @param a {Array.<T>}
 * @param b {Array.<T>}
 * @returns {Array.<T>}
 */
function flatten(a, b){
	return a.concat(b);
}
