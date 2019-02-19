import 'react-native';
import React from 'react';
import render from 'react-test-renderer';
import { configure, } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Privacy from '../../screens/userSettings/PrivacySetting';

configure({ adapter: new Adapter() });

it('Check State', () => {
  const PrivacyData = render.create(<Privacy />).getInstance();
  PrivacyData.changeAuthMode(PrivacyData.setState({ isRegister: true }));

  expect(PrivacyData.state.isRegister).toBe(true);
});
