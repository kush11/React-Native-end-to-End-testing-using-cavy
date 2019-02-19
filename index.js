/** @format */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { Tester, TestHookStore } from 'cavy';
import App from './App';
import { name as appName } from './app.json';
import configureStore from './src/store/configureStore';
import Spec from './specs/LoginSpec';

const testhookstore = new TestHookStore();

const store = configureStore();
class Apwrapper extends Component {
  render() {
    return (
      <Tester specs={[Spec]} store={testhookstore} waitTime={10000} clearAsyncStorage={true}>
        <Provider store={store}>
          <App />
        </Provider>
      </Tester>
    );
  }
}

// const ZULRedux = () => (
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

AppRegistry.registerComponent(appName, () => Apwrapper);
