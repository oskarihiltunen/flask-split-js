var assert = require('assert');

function throws(func, args, error) {
    assert.throws(function () {
        func.apply(undefined, args);
    }, error);
}

function doesNotThrow(func, args, error) {
    assert.doesNotThrow(function () {
        func.apply(undefined, args);
    }, error);
}

module.exports = {
    throws: throws,
    doesNotThrow: doesNotThrow
};
