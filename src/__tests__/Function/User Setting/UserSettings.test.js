import React from 'react';
import 'react-native';
import render from 'react-test-renderer';
import { UserSettings } from '../../../screens/userSettings/UserSettings';


const findByPlaceHolder = ((tree, placeHolders) => {
  if (tree.props && tree.props.placeholder === placeHolders) {
    return tree;
  }
  if (tree.children && tree.children.length > 0) {
    const childs = tree.children;
    for (let i = 0; i < childs.length; i += 1) {
      // console.log(JSON.stringify(childs[i].props));
      const item = findByPlaceHolder(childs[i], placeHolders);
      if (typeof (item) !== 'undefined') {
        return item;
      }
    }
  }
});

describe('Testint the Element and the Placeholder', () => {
  it('should render Placeholder = Enter invite code', () => {
    const tree = render.create(<UserSettings />).toJSON();
    expect(findByPlaceHolder(tree, 'Enter invite code')).toBeDefined();
  });
});

describe('Testint the function', () => {
  it('should test the function imageCondition', () => {
    const HomeData = render.create(<UserSettings />).getInstance();
    expect(HomeData.imageCondition().uri).toBeUndefined();
  });
});
