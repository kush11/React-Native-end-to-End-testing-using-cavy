import 'react-native';
import React from 'react';
import Renderer from 'react-test-renderer';
import TermsCondition from '../../../screens/userSettings/TermsConditions';

test('Terms snapshot', () => {
  const snap = Renderer.create(
    <TermsCondition />
  ).toJSON();
  expect(snap).toMatchSnapshot();
});
