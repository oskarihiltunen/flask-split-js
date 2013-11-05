var assert = require('assert');

var utils = require('./utils');
var throws = utils.throws;
var doesNotThrow = utils.doesNotThrow;

var FS = require('../../flask_split_js/static/js/flask-split.min.js');
var ab_test = FS.ab_test;

function args(experiment_name, alt_1, alt_2, cb) {
    if (experiment_name === undefined) {
        experiment_name = 'experiment';
    }
    if (alt_1 === undefined) {
        alt_1 = 'alt-1';
    }
    if (alt_2 === undefined) {
        alt_2 = 'alt-2';
    }
    if (cb === undefined) {
        cb = function () {};
    }
    return [experiment_name, alt_1, alt_2, cb];
}

describe('FlaskSplit.ab_test', function () {
    before(function () {
        global.$ = {
            get: function () {
                this.last_args = arguments;
            },
        }
    });

    it('should be a function', function () {
        assert.equal(typeof ab_test, 'function');
    });
    it('should require at least 4 arguments', function () {
        var error = /takes at least 4 arguments/;
        throws(ab_test, [], error);
        throws(ab_test, ['a'], error);
        throws(ab_test, ['a', 'b'], error);
        throws(ab_test, ['a', 'b', 'c'], error);
    });
    it('validates the experiment name', function () {
        throws(ab_test, args(4), /must be a string/);
        throws(ab_test, args(null), /must be a string/);
        throws(ab_test, args(''), /must be at least one character/);
    });
    it('validates the arguments', function () {
        var u = undefined;
        throws(ab_test, args(u, 1), /must be strings/);
        throws(ab_test, args(u, 'a', 1), /must be strings/);
        throws(ab_test, args(u, ''), /must be at least one character/);
        throws(ab_test, args(u, 'a', ''), /must be at least one character/);
    });
    it('validates the callback', function () {
        var u = undefined;
        throws(ab_test, args(u, u, u, 1), /must be a function/);
    });
    it('calls $.post', function () {
        var arguments = args('exp', 'a', 'b', function (data) {
            assert.equal(data, 'chosen alternative');
        });
        ab_test.apply(FS, arguments);
        assert.equal($.last_args.length, 4);
        assert.equal($.last_args[0], '/split-js/ab-test');
        assert.deepEqual($.last_args[1], {
            experiment_name: arguments[0],
            alternatives: arguments.slice(1, -1)
        });
        $.last_args[2]({alternative: 'chosen alternative'});
        assert.equal($.last_args[3], 'json');
    });
});
