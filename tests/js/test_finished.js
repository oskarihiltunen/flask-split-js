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
            post: function () {
                this.last_args = arguments;
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
    it('calls $.post', function () {
        finished.apply(FS, args('experiment', false));
        assert.equal($.last_args.length, 4);
        assert.equal($.last_args[0], '/split-js/finished');
        assert.deepEqual($.last_args[1], {
            experiment_name: 'experiment',
            reset: false
        });
        assert.equal($.last_args[3], 'json');
    });
});
