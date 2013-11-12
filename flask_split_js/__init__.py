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


def get_json():
    if hasattr(request, 'get_json'):
        return request.get_json(silent=True)
    return request.json


@split_js.route('/ab-test', methods=['POST'])
def ab_test():
    json = get_json()
    alternative = flask.ext.split.ab_test(
        json['experiment_name'], *json['alternatives']
    )
    return jsonify(alternative=alternative)


@split_js.route('/finished', methods=['POST'])
def finished():
    json = get_json()
    flask.ext.split.finished(json['experiment_name'], json['reset'])
    return jsonify(ok=True)
