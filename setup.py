from setuptools import setup, Command
import subprocess


class Test(Command):
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        err1 = subprocess.call(['py.test', 'tests/python'])
        err2 = subprocess.call(['node_modules/mocha/bin/mocha', 'tests/js'])
        raise SystemExit(err1 or err2)


setup(
    name='Flask-Split-JS',
    version='0.2.0',
    url='http://github.com/FelixLoether/flask-split-js',
    license='MIT',
    author='Oskari Hiltunen',
    author_email='flask-split-js@loethr.net',
    description='A JavaScript library for Flask-Split.',
    long_description=(
        open('README.rst').read() + '\n\n' +
        open('CHANGES.rst').read()
    ),
    packages=['flask_split_js'],
    include_package_data=True,
    zip_safe=False,
    platforms='any',
    install_requires=[
        'Flask>=0.8',
        'Flask-Split>=0.2',
    ],
    cmdclass={'test': Test},
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ]
)
