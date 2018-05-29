import React from 'react';
import GithubWidget from '../src/components/Github';
import { Paper, Tabs, Tab, SelectField, MenuItem, Toggle, IconButton, Divider } from 'material-ui';
import 'isomorphic-fetch';

describe('<GithubWidget />', () => {
  it('Authentication should not be allowed when false credentials are entered', () => {
    const wrapper = shallow(<GithubWidget />);
    const key = 'oathToken';
    const newValue = 'thisIsAfakeToken';
    const key2 = 'username';
    const newValue2 = 'testingMan';
    wrapper.instance().onSettingsChange(key, newValue);
    wrapper.instance().onSettingsChange(key2, newValue2);
    expect(wrapper.state().githubAPI.isAuthenticated).toEqual(false);
  });

  it('displayOauthTokenValue state should be false after it is toggled off (default is true)', () => {
    const wrapper = shallow(<GithubWidget />);
    const key = 'displayOauthTokenValue';
    const newValue = false;
    wrapper.instance().onSettingsChange(key, newValue);
    expect(wrapper.state().settings.displayOauthTokenValue).toEqual(false);
  });

  it('translateMarkdownToHTML state should be true after it is toggled on (default is false)', () => {
    const wrapper = shallow(<GithubWidget />);
    const key = 'translateMarkdownToHTML';
    const newValue = true;
    wrapper.instance().onSettingsChange(key, newValue);
    expect(wrapper.state().settings.translateMarkdownToHTML).toEqual(true);
  });

  it('watchAllRepos state should be true after it is toggled on (default is false)', () => {
    const wrapper = shallow(<GithubWidget />);
    const key = 'watchAllRepos';
    const newValue = true;
    wrapper.instance().onSettingsChange(key, newValue);
    expect(wrapper.state().settings.watchAllRepos).toEqual(true);
  });

  it('refreshRate state should be desired number from pulldown menu after it is set', () => {
    const wrapper = shallow(<GithubWidget />);
    const event = 'event';
    const index = 'index';
    const value = 12;
    wrapper.instance().onRefreshRateChange(event, index, value);
    expect(wrapper.state().settings.refreshRate).toEqual(12);
  });

  it('Oath token value should be saved in state', () => {
    const wrapper = shallow(<GithubWidget />);
    const key = 'oauthToken';
    const newValue = 'thisIsAfakeToken';
    wrapper.instance().onSettingsChange(key, newValue);
    expect(wrapper.state().settings.oauthToken).toEqual('thisIsAfakeToken');
  });

  it('username value should be saved in state', () => {
    const wrapper = shallow(<GithubWidget />);
    const key = 'username';
    const newValue = 'TestingMan';
    wrapper.instance().onSettingsChange(key, newValue);
    expect(wrapper.state().settings.username).toEqual('TestingMan');
  });

});
