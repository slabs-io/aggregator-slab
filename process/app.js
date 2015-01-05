"use strict";

var Q = require('q');

function sumDates(data){
	var dates = {};
	data.data.forEach(function(item){
		if(dates[item.date]){
			dates[item.date] = {};
		}

		dates[item.date]++;
	});

	return dates;
}

function getSummedData(dates){
	return Object.keys(dates).map(function(date){
		return {
			date  : date,
			value : dates[date]
		};
	});

}

/**
 * process takes some data and returns processed data
 * @param settings {object} user input settings
 * @param data {[object]} data sent from previous slab in network
 * @returns {[object]}
 */
exports.process = function(settings, data){
	var deferred = Q.defer();
	var dates = sumDates(data);
	var summedData = getSummedData(dates); 
	var outputData = {
		dateFrom: data.dateFrom,
		dateTo: data.dateTo,
		categories: data.categories.slice(),
		series: data.series.slice(),
		data: summedData
	};

	deferred.resolve(outputData);

	return deferred.promise;
};
