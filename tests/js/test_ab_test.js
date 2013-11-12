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
    return [experiment_name, [alt_1, alt_2], cb];
}

describe('FlaskSplit.ab_test', function () {
    before(function () {
        global.$ = {
            ajax: function () {
                this.last_args = Array.prototype.slice.call(arguments);
            },
        }
    });

    it('should be a function', function () {
        assert.equal(typeof ab_test, 'function');
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
    it('calls $.ajax', function () {
        var arguments = args('exp', 'a', 'b', function (data) {
            assert.equal(data, 'chosen alternative');
        });
        var ajax_args;
        ab_test.apply(FS, arguments);
        assert.equal($.last_args.length, 2);
        assert.equal($.last_args[0], '/split-js/ab-test');
        ajax_args = $.last_args[1];
        assert.equal(ajax_args.accepts, 'application/json');
        assert.equal(ajax_args.contentType, 'application/json; charset=UTF-8');
        assert.equal(ajax_args.data, '{"experiment_name":"exp","alternatives":["a","b"]}');
        assert.equal(ajax_args.dataType, 'json');
        assert.equal(ajax_args.processData, false);
        assert.equal(ajax_args.type, 'POST');
        ajax_args.success({alternative: 'chosen alternative'});
    });
});
