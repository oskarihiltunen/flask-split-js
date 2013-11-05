import os

from flask import Blueprint, request, jsonify
import flask.ext.split

try:
    __version__ = __import__('pkg_resources')\
        .get_distribution('flask_split_js').version
except Exception:
    __version__ = 'unknown'

root = os.path.abspath(os.path.dirname(__file__))
split_js = Blueprint(
    'split_js', 'flask.ext.split_js',
    static_folder=os.path.join(root, 'static'),
    url_prefix='/split-js',
)


@split_js.route('/ab-test', methods=['GET'])
def ab_test():
    json = request.get_json(silent=True)
    alternative = flask.ext.split.ab_test(
        json['experiment_name'], *json['alternatives']
    )
    return jsonify(alternative=alternative)


@split_js.route('/finished', methods=['POST'])
def finished():
    json = request.get_json(silent=True)
    flask.ext.split.finished(json['experiment_name'], json['reset'])
    return jsonify(ok=True)
