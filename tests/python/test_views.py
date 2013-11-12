import json

from flask import Flask, url_for
from flexmock import flexmock

import flask.ext.split
from flask_split_js import split_js


class ViewTestCase(object):
    @classmethod
    def create_app(self):
        app = Flask(__name__)
        app.register_blueprint(split_js)
        app.testing = True
        return app

    def setup_method(self, method):
        self.app = self.create_app()
        self.client = self.app.test_client()
        self._ctx = self.app.test_request_context()
        self._ctx.push()

    def teardown_method(self, method):
        self._ctx.pop()
        del self._ctx
        del self.client
        del self.app


class TestABTestView(ViewTestCase):
    def setup_method(self, method):
        super(TestABTestView, self).setup_method(method)
        self.url = url_for('split_js.ab_test')

    def get(self, experiment_name='wootxperiment', alternatives=['a1', 'a2']):
        data = {
            'experiment_name': experiment_name,
            'alternatives': alternatives,
        }
        return self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json',
        )

    def test_exists(self):
        (flexmock(flask.ext.split)
            .should_receive('ab_test')
            .and_return(''))
        response = self.get()
        assert response.status_code == 200

    def test_calls_ab_test(self):
        called = (
            flexmock(flask.ext.split)
            .should_receive('ab_test')
            .once()
            .with_args('wootxperiment', 'alt 1', 'alt 2', 'alt 3')
            .and_return('')
        )
        self.get(alternatives=['alt 1', 'alt 2', 'alt 3'])
        called.verify()

    def test_returns_selected_alternative(self):
        (flexmock(flask.ext.split)
            .should_receive('ab_test')
            .and_return('a3'))
        response = self.get()
        data = json.loads(response.data)
        assert 'alternative' in data
        assert data['alternative'] == 'a3'


class TestFinishedView(ViewTestCase):
    def setup_method(self, method):
        super(TestFinishedView, self).setup_method(method)
        self.url = url_for('split_js.finished')

    def get(self, experiment_name='wootxperiment', reset=True):
        data = {
            'experiment_name': experiment_name,
            'reset': reset,
        }
        return self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json',
        )

    def test_exists(self):
        (flexmock(flask.ext.split)
            .should_receive('finished')
            .and_return())
        response = self.get()
        assert response.status_code == 200

    def test_calls_finished(self):
        called = (
            flexmock(flask.ext.split)
            .should_receive('finished')
            .once()
            .with_args('wootxperiment', True)
            .and_return()
        )
        self.get()
        called.verify()

    def test_returns_ok(self):
        (flexmock(flask.ext.split)
            .should_receive('finished')
            .and_return())
        response = self.get()
        data = json.loads(response.data)
        assert 'ok' in data
        assert data['ok'] is True
