/* globals describe:false, it:false, expect:false */

/*
    {
        dateFrom    : '1416654884000',
        dateTo      : '1417000484000',
        categories  : ['date'],
        series      : ['tweets'],
        data        : [
            {date : '21/11/2014', tweets: '15'},
            {date : '22/11/2014', tweets: '10'},
            {date : '23/11/2014', tweets: '8'},
            {date : '24/11/2014', tweets: '25'},
            {date : '25/11/2014', tweets: '18'},
            {date : '26/11/2014', tweets: '4'}
        ]
    }

 */

function deepEqual(actual, expected){
    Object.keys(actual).forEach(function(key){
        expect(actual[key]).toEqual(expected[key]);
    });
}

function check(input, expected, done){
    aggregator.process(input).then(function(data){
        deepEqual(data, expected);
        done();
    });
}

var aggregator = require('../process/app');

describe('aggregator', function(){

    it('returns a promise', function(){
        var input = {
            settings: {},
            data: [{
                dateFrom: 0,
                dateTo: 0,
                categories: [],
                series: [],
                data:[]
            }]
        };
        expect(aggregator.process(input).then).toBeDefined();
    });


    it('returns the original data when there is only one set', function(done){
        var originalData = {
            dateFrom: 0,
            dateTo: 100,
            categories: ['foo'],
            series: ['bar'],
            data:[
                {foo: 1, bar: 2},
                {foo: 2, bar: 3}
            ]
        };

        var expectedData = {
            dateFrom: 0,
            dateTo: 100,
            categories: ['foo:0'],
            series: ['bar'],
            data:[
                {'foo:0': 1, bar: 2},
                {'foo:0': 2, bar: 3}
            ]
        };

        var input = {
            settings: {
                category:null
            },
            data: [originalData]
        };

        check(input, expectedData, done);

    });

    it('combines data when there is a common category', function(done){
        var set1 = {
            dateFrom: 0,
            dateTo: 100,
            categories: ['cat'],
            series: ['foo'],
            data:[
                {cat: 1, foo: 2},
                {cat: 2, foo: 3}
            ]
        };

        var set2 = {
            dateFrom: 150,
            dateTo: 200,
            categories: ['cat'],
            series: ['bar'],
            data:[
                {cat: 3, bar: 5},
                {cat: 4, bar: 6}
            ]
        };

        var expected = {
            dateFrom: 0,
            dateTo: 200,
            categories: ['cat:0', 'cat:1'],
            series: ['foo', 'bar'],
            data:[
                {'cat:0': 1, foo: 2},
                {'cat:0': 2, foo: 3},
                {'cat:1': 3, bar: 5},
                {'cat:1': 4, bar: 6}
            ]
        };

        var input = {
            settings: {
                category:null
            },
            data: [set1, set2]
        };

        check(input, expected, done);
    });

});
