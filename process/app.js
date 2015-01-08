"use strict";

var Q = require('q');

/**
 * process takes an array of data sources and returns a flat array of data
 * @param input {object} input settings and input data
 * @returns {object}
 */
exports.process = function(input){

	var deferred = Q.defer();

	var matchingCategory = input.data[0].categories[0];
	var categories = getCategories(input.data);

	deferred.resolve({
		dateFrom: getEarliestDate(input.data),
		dateTo: getLastDate(input.data),
		categories: categories,
		series: getSeries(input.data),
		data: aggregate(input.data, matchingCategory)
	});

	return deferred.promise;
};

function aggregate(data, category){
	return data.map(restructureData(category)).reduce(flatten);
}

function getEarliestDate(data){
	var allDates = data.map(function(d){
		return d.dateFrom;
	});
	return Math.min.apply(null, allDates);
}

function getLastDate(data){
	var allDates = data.map(function(d){
		return d.dateTo;
	});
	return Math.max.apply(null, allDates);
}

function getCategories(data){
	return data.map(function(d, i){
		return d.categories.map(function(cat){
			return cat + ':' + i;
		})
	}).reduce(flatten);
}

function getSeries(data){
	return data.map(function(d){
		return d.series;
	}).reduce(flatten);
}


// utils

// iterate over each dataset
function restructureData(category){
	return function(d, i){
		return d.data.map(updateCategory(category, i));
	};
}

// iterate over each data item
function updateCategory(category, i){
	return function(data){
		data[category + ':' + i] = data[category];
		delete data[category];
		return data;
	}
}

function flatten(a, b){
	return a.concat(b);
}
