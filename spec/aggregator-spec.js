/* globals describe:false, it:false, expect:false */

/*
    {
        values: ['mentions_17283728', 'mentions_17283729' ],
        categories: ['18/01/2015', '19/01/2015', '20/01/2015'],
        labels: {
            'mentions_17283728':'"hate" on the dailymail.co.uk',
            'mentions_17283729':'"terror" on the dailymail.co.uk'
        },
        data: [
            {
                'mentions_17283728' : 131,
                'mentions_17283729' : 94
            },
            {
                'mentions_17283728' : 130,
                'mentions_17283729' : 35
            },
            {
                'mentions_17283728': 33,
                'mentions_17283729' : 93
            }
        ]
    };

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
                values: [],
                categories: [],
                labels: {},
                data: []
            }]
        };
        expect(aggregator.process(input).then).toBeDefined();
    });


    it('returns the original data when there is only one set', function(done){
        var expected = {
            values: [],
            categories: [],
            labels: {},
            data: []
        };

        var input = {
            settings: {},
            data: [expected]
        };

        check(input, expected, done);

    });

    it('combines data', function(done){
        var expected = {
            values: ['mentions', 'tweets'],
            categories: ['18/01/2015', '19/01/2015'],
            labels: {
                'mentions' : '"hate" on the dailymail.co.uk',
                'tweets' : 'tweets containing "hate"'
            },
            data: [
                {
                    mentions: 10,
                    tweets: 200
                },
                {
                    mentions: 25,
                    tweets: 120
                }
            ]
        };

        var startingData = [
            {
                values: ['mentions'],
                categories: ['18/01/2015', '19/01/2015'],
                labels: {
                    'mentions' : '"hate" on the dailymail.co.uk'
                },
                data: [
                    {
                        mentions: 10
                    },
                    {
                        mentions: 25
                    }
                ]
            },
            {
                values: ['tweets'],
                categories: ['18/01/2015', '19/01/2015'],
                labels: {
                    'tweets' : 'tweets containing "hate"'
                },
                data: [
                    {
                        tweets: 200
                    },
                    {
                        tweets: 120
                    }
                ]
            }
        ];

        var input = {
            settings: {},
            data: startingData
        };

        check(input, expected, done);
    });

});
