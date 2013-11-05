FlaskSplit = (function () {
    function validate_experiment_name(experiment_name) {
        if (typeof experiment_name != 'string') {
            throw Error('Experiment name must be a string.');
        }
        if (experiment_name.length == 0) {
            throw Error('Experiment name must be at least one character.');
        }
    }

    function validate_alternatives(alternatives) {
        var alternative;
        for (var i = 0; i < alternatives.length; ++i) {
            alternative = alternatives[i];
            if (typeof alternative != 'string') {
                throw Error('Alternatives must be strings.');
            }
            if (alternative.length == 0) {
                throw Error('Alternatives must be at least one character.');
            }
        }
    }

    function validate_callback(callback) {
        if (typeof callback != 'function') {
            throw Error('Callback must be a function.');
        }
    }

    function validate_reset(reset) {
        if (reset !== true && reset !== false) {
            throw Error('Reset must be true, false or unspecified.');
        }
    }

    function ab_test_request(experiment_name, alternatives, callback) {
        $.get(
            '/split-js/ab-test',
            {experiment_name: experiment_name, alternatives: alternatives},
            function (data) {
                callback(data.alternative);
            },
            'json'
        );
    }

    function finished_request(experiment_name, reset) {
        $.post(
            '/split-js/finished',
            {experiment_name: experiment_name, reset: reset},
            function (data) {},
            'json'
        );
    }

    function ab_test(experiment_name) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (args.length < 3) {
            throw Error('Function takes at least 4 arguments.');
        }
        var alternatives = args.slice(0, -1);
        var callback = args.slice(-1)[0];
        validate_experiment_name(experiment_name);
        validate_alternatives(alternatives);
        validate_callback(callback);
        ab_test_request(experiment_name, alternatives, callback);
    }

    function finished(experiment_name, reset) {
        if (arguments.length < 2) {
            reset = true;
        }
        validate_experiment_name(experiment_name);
        validate_reset(reset);
        finished_request(experiment_name, reset);
    }

    return {
        ab_test: ab_test,
        finished: finished
    };
}());

if (module && module.exports) { module.exports = FlaskSplit; }
