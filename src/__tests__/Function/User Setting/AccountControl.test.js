import React from 'react';
import 'react-native';
import render from 'react-test-renderer';
import { AccountSetting } from '../../../screens/userSettings/AccountControl';

const findByText = ((tree, text) => {
  if (tree.props && tree.props.placeholder === text) {
    return tree;
  }
  if (tree.children && tree.children.length > 0) {
    const childs = tree.children;
    for (let i = 0; i < childs.length; i += 1) {
      // console.log(JSON.stringify(childs[i].children));
      const item = findByText(childs[i], text);
      if (typeof (item) !== 'undefined') {
        return item;
      }
    }
  }
});

describe('Testint the Element and the Text', () => {
  it('should render text = Delete Account', () => {
    const tree = render.create(<AccountSetting />).toJSON();
    // console.log(JSON.stringify(tree.children));
    expect(findByText(tree, 'Delete Account'));
  });
});
