import 'react-native';
import 'isomorphic-fetch';
import React from 'react';
import Renderer from 'react-test-renderer';
import { Passcode } from '../../../screens/userSettings/ChangePasscode';

test('Changepasscode snapshot', () => {
  const snap = Renderer.create(
    <Passcode />
  ).toJSON();
  expect(snap).toMatchSnapshot();
});
