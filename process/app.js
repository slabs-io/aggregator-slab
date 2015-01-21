"use strict";

var Q = require('q');

/**
 * process takes an array of data sources and returns a flat array of data
 * @param input {object} input settings and input data
 * @returns {object}
 */
exports.process = function(input){

	var deferred = Q.defer();

	var data = {
		result:{},
		labels:{}
	};

	input.data.forEach(function(datum, i){
		if(datum.result === undefined || datum.labels === undefined){
			return;
		}

		Object.keys(datum.result).forEach(function(key){
			data.result[i + key] = datum.result[key];
			data.labels[i + key] = datum.labels[key];
		});

	});

	deferred.resolve(data);

	return deferred.promise;
};