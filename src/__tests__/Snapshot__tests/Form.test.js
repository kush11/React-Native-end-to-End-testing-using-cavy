import 'react-native';
import 'isomorphic-fetch';
import React from 'react';
import Renderer from 'react-test-renderer';
import { Form } from '../../screens/login/Form';

test('login snapshot', () => {
  const snap = Renderer.create(
    <Form />
  ).toJSON();
  expect(snap).toMatchSnapshot();
});
