Flask-Split-JS version 0.1.0
============================

.. image:: https://travis-ci.org/FelixLoether/flask-split-js.png?branch=master

Flask-Split-JS offers utilities for using
`Flask-Split <http://github.com/jpvanhal/flask-split>`_ from the browser
using JavaScript.

Setup
-----

On top of the Flask-Split setup, you need to register the Flask-Split-JS
blueprint to your application::

    from flask import Flask
    from flask.ext.split_js import split_js

    app = Flask(__name__)
    app.register_blueprint(split_js)

and add the JavaScript library to your template::

    <script src="/path/to/jquery.js"></script>
    <script src="{{ url_for('static/js/flask-split.min.js') }}"></script>

jQuery is required for the JavaScript library to work.

API Reference
-------------

FlaskSplit.ab_test(experiment_name, alternatives..., callback)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A port of Flask-Split's ``ab_test`` function. When the alternative
has been decided, the callback function is called with the chosen
alternative as its sole argument.

Invalid arguments cause errors to be thrown.

FlaskSplit.finished(experiment_name, reset=true)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A port of Flask-Split's ``finished`` function.

Invalid arguments cause errors to be thrown.

Resources
---------

- `Flask-Split on PyPI <https://pypi.python.org/pypi/Flask-Split/0.2.0>`_
- `Code <https://github.com/FelixLoether/flask-split-js>`_
- `Issue tracker <https://github.com/FelixLoether/flask-split-js/issues>`_
