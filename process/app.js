"use strict";

var Q = require('q'),
    _ = require('lodash');

/**
 * process takes an array of data sources and returns a flat array of data
 * @param input {object} input settings and input data
 * @returns {object}
 */
exports.process = function (input) {

    var deferred = Q.defer();

    var data = input.data;
    var settings = input.settings;

    var returnData = [];

    _.each(data, function(datum){
        returnData = returnData.concat(datum);
    });

    deferred.resolve(returnData);

    return deferred.promise;
};
