Changes
=======

A list of changes done in each version.

0.2.1
-----

- Fixed a ReferenceError in the JS that occured because ``module`` was not
  defined.
- Added a missing ``var`` to the JS.

0.2.0
-----

- Fixed a bug with the functions not sending the data to the server in the
  correct format.
- Changed ``FlaskSplit.ab_test`` to take the alternatives as a single list
  argument (i.e. ``ab_test('exp', 'a', 'b', callback)`` -> ``ab_test('exp', ['a',
  'b'], callback)``).
- The callback to ``ab_test`` will now be called also when the request fails. In
  this case the first argument is undefined and the second argument is the
  jQuery response object.

0.1.0
-----

Initial release.
