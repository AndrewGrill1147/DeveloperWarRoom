import React from 'react';
import Bookmarker from '../src/components/Bookmarker';
import { Dialog, IconButton, TextField } from 'material-ui';



/* Testing the Bookmarker Component */
describe('<Bookmarker />', () => {
  it('add bookmark button changes state', () => {
    const wrapper = shallow(<Bookmarker />);
    wrapper.find(IconButton).simulate('click');
    expect(wrapper.state().dialogOpen).toEqual(true);
  });
  /*it('add bookmark Edit Delete button changes state', () => {
   // error FlatButton not defined
    const wrapper = shallow(<Bookmarker />);
    wrapper.find(FlatButton).simulate('click');
    expect(wrapper.state().dialogOpen).toEqual(true);
  }); */
  it('add and delete widget', () => {
    const wrapper = shallow(<Bookmarker />);
    const value = {id: 29, nameInput: 'test', urlInput: 'www.google.com', dialogOpen: true};
    const value2 = {id: 30, nameInput: 'test2', urlInput: 'www.youtube.com', dialogOpen: true};
    wrapper.instance().saveDialogEvent("key", value);
    wrapper.instance().saveDialogEvent("key2", value2);
    expect(wrapper.state().bookmarks.length).toEqual(2);
    wrapper.instance().deleteItem("key", value);
    wrapper.instance().deleteItem("key2", value2);
    expect(wrapper.state().bookmarks.length).toEqual(0);
  });
  it('add bad url test should not add them', () => {
    const wrapper = shallow(<Bookmarker />);
    const value3 = {id: 34, nameInput: 'google', urlInput: 'hhtppss//googg8gle', dialogOpen: true};
    const value4 = {id: 35, nameInput: 'youtube', urlInput: 'ttpp:/youtaabye', dialogOpen: true};
    const value5 = {id: 36, nameInput: 'AddressSorta', urlInput: '15.36.22.111', dialogOpen: true};
    wrapper.instance().saveClicked("key3", value3);
    wrapper.instance().saveClicked("key4", value4);
    wrapper.instance().saveClicked("key5", value5);
    expect(wrapper.state().bookmarks.length).toEqual(0);
  });
  // handleNameChange(evt, listValue) 
    it('Change Name widget', () => {
      const wrapper = shallow(<Bookmarker />);
      const value6 = [{id: 52, nameInput: 'Facebook', urlInput: 'www.facebook.com', dialogOpen: true}];
      wrapper.instance().saveDialogEvent("key6", value6);
      const nameValue = { target: {value: 'MyFacebook'} };
      wrapper.instance().handleNameChange(nameValue, value6);
      expect(wrapper.state().bookmarks[0].nameInput).toEqual('MyFacebook');
    }); 
  // handleUrlChange(evt, listValue) 
    it('Change Url widget', () => {
      const wrapper = shallow(<Bookmarker />);
      const value7 = [{id: 64, nameInput: 'All Classical', urlInput: 'www.allclassical', dialogOpen: true}];
      wrapper.instance().saveDialogEvent("key7", value7);
      const urlValue = { target: {value: 'www.allclassical.org'} };
      wrapper.instance().handleUrlChange(urlValue, value7);
      expect(wrapper.state().bookmarks[0].urlInput).toEqual('www.allclassical.org');
    }); 

});




/*
 Testing the Bookmarker Component 
describe('<Bookmarker />', () => {
  it('add bookmark button changes state', () => {
    const wrapper = shallow(<Bookmarker />);
    wrapper.find(IconButton).simulate('click');
    expect(wrapper.state().dialogOpen).toEqual(true);
  });
  it('add quick link', () => {
    const wrapper = shallow(<Bookmarker />);
    const value = {id: 10, nameInput: 'test', urlInput: 'www.google.com', dialogOpen: true};
    const value2 = {id: 4, nameInput: 'test2', urlInput: 'www.youtube.com', dialogOpen: true};
    wrapper.instance().saveDialogEvent("key", value);
    wrapper.instance().saveDialogEvent("key2", value2);
    expect(wrapper.state().bookmarks.length).toEqual(2);
  });
});*/
