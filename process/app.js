"use strict";

var Q = require('q');

/**
 * process takes an array of data sources and returns a flat array of data
 * @param input {object} input settings and input data
 * @returns {object}
 */
exports.process = function(input){

	var deferred = Q.defer();
	var categories = getCategories(input.data);

	deferred.resolve({
		dateFrom: getEarliestDate(input.data),
		dateTo: getLastDate(input.data),
		categories: categories,
		series: getSeries(input.data),
		data: aggregate(input.data)
	});

	return deferred.promise;
};

/**
 * returns a data array combining all sources
 * @private
 * @param data
 * @returns {[{object}]}
 */
function aggregate(data){
	return data.map(restructureData).reduce(flatten);
}

/**
 * loops through each dateFrom and returns lowest
 * @private
 * @param data
 * @returns {number}
 */
function getEarliestDate(data){
	return Math.min.apply(null, data.map(function(d){
		return d.dateFrom;
	}));
}

/**
 * loops through each dateTo and returns highest
 * @private
 * @param data
 * @returns {number}
 */
function getLastDate(data){
	return Math.max.apply(null, data.map(function(d){
		return d.dateTo;
	}));
}

/**
 * creates a flat array of all source categories
 * @private
 * @param data
 * @returns {*}
 */
function getCategories(data){
	return mapReduce(data, function(d, i){
		return d.categories.map(function(cat){
			return cat + ':' + i;
		})
	});
}

/**
 * creates a flat array of all source series
 * @private
 * @param data
 * @returns {*}
 */
function getSeries(data){
	return mapReduce(data, function(d){
		return d.series;
	});
}


// utils

/**
 * iterates through each data item in a source's 'data' array
 * @private
 * @param data
 * @param {number} i
 * @returns {Array}
 */
function restructureData(data, i){
	var category = data.categories[0];
	return data.data.map(updateCategory(category, i));
}

/**
 * updates the data item to reflect updated category
 * @private
 * @param category
 * @param i
 * @returns {Function}
 */
function updateCategory(category, i){
	return function(data){
		data[category + ':' + i] = data[category];
		delete data[category];
		return data;
	}
}

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
