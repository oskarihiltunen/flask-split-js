var assert = require('assert');

var utils = require('./utils');
var throws = utils.throws;
var doesNotThrow = utils.doesNotThrow;

var FS = require('../../flask_split_js/static/js/flask-split.min.js');
var finished = FS.finished;

function args(experiment_name, reset) {
    if (experiment_name === undefined) {
        experiment_name = 'experiment';
    }
    if (reset === undefined) {
        return [experiment_name];
    }
    return [experiment_name, reset];
}

describe('FlaskSplit.finished', function () {
    before(function () {
        global.$ = {
            ajax: function () {
                this.last_args = Array.prototype.slice.call(arguments);
            },
        }
    });

    it('should be a function', function () {
        assert.equal(typeof finished, 'function');
    });
    it('validates the experiment name', function () {
        throws(finished, args(1), /must be a string/);
        throws(finished, args(null), /must be a string/);
    });
    it('validates the reset argument', function () {
        throws(finished, args(undefined, 1), /must be true, false/);
    });
    it('calls $.ajax', function () {
        var ajax_args;
        finished.apply(FS, args('experiment', false));
        assert.equal($.last_args.length, 2);
        assert.equal($.last_args[0], '/split-js/finished');
        ajax_args = $.last_args[1];
        assert.equal(ajax_args.accepts, 'application/json');
        assert.equal(ajax_args.contentType, 'application/json; charset=UTF-8');
        assert.equal(ajax_args.data, '{"experiment_name":"experiment","reset":false}');
        assert.equal(ajax_args.dataType, 'json');
        assert.equal(ajax_args.processData, false);
        assert.equal(ajax_args.type, 'POST');
    });
});
