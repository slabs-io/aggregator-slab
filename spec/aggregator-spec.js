/* globals describe:false, it:false, expect:false */

/*
    [
        {
            result: {
                mentions: 0
            },
            labels: {"mentions":"arb_label"}
        },
        {
            result: {
                mentions: 1
            },
            labels: {"mentions":"arb_label2"}
        }
    ]

    to

    {
        result: {
            "0mentions": 0,
            "1mentions":1
        },
        labels:{
            "0mentions":"arb_label",
            "1mentions":"arb_label2"
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
            data: [{}]
        };
        expect(aggregator.process(input).then).toBeDefined();
    });

    it('the promise sends an object', function(done){
        var input = {
            settings: {},
            data: [{}]
        };

        aggregator.process(input).then(function(data){
            // object hack
            expect(data.length).not.toBeDefined();
            expect(typeof data).toEqual('object');
            done();
        });

    });


    it('returns the original data when there is only one set', function(done){
        var expected = {
            result:{},
            labels:[]
        };

        var input = {
            settings: {},
            data: [expected]
        };

        check(input, expected, done);

    });

    it('combines data', function(done){
        var expected = {
            result: {
                "0mentions": 10,
                "1mentions": 25
            },
            labels: {
                "0mentions": "mentions1",
                "1mentions": "mentions2"
            }
        };

        var startingData = [
            {
                result: {
                    mentions: 10
                },
                labels:{
                    mentions: "mentions1"
                }
            },
            {
                result:{
                    mentions: 25
                },
                labels:{
                    mentions: "mentions2"
                }

            }
        ];

        var input = {
            settings: {},
            data: startingData
        };

        check(input, expected, done);
    });

});
