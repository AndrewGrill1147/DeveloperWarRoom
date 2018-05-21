import React from 'react';
import Bookmarker from '../src/components/bookmarker';
import { Dialog, IconButton, TextField } from 'material-ui';

/* Testing the Bookmarker Component */
describe('<Bookmarker />', () => {
  it('add bookmark button changes state', () => {
    const wrapper = shallow(<Bookmarker />);
    wrapper.find(IconButton).simulate('click');
    expect(wrapper.state().dialogOpen).toEqual(true);
  });
  it('add widget', () => {
    const wrapper = shallow(<Bookmarker />);
    const value = {id: 10, nameInput: 'test', urlInput: 'www.google.com', dialogOpen: true};
    const value2 = {id: 4, nameInput: 'test2', urlInput: 'www.youtube.com', dialogOpen: true};
    wrapper.instance().saveDialogEvent("key", value);
    wrapper.instance().saveDialogEvent("key2", value2);
    expect(wrapper.state().bookmarks.length).toEqual(2);
  });
});