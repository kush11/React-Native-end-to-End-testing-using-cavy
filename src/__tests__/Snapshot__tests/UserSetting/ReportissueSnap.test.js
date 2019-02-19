import 'react-native';
import React from 'react';
import Renderer from 'react-test-renderer';
import { Register } from '../../../screens/userSettings/ReportIssue';

test('Privacysettings snapshot', () => {
  const snap = Renderer.create(
    <Register />
  ).toJSON();
  expect(snap).toMatchSnapshot();
});
