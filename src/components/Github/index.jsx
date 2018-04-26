import React, { Component } from 'react';
import { Paper, Tabs, Tab, SelectField, MenuItem } from 'material-ui';
import SuperSelectField from 'material-ui-superselectfield';
import _ from 'lodash';
import RepoPullRequestList from './repoPullRequestList';
import { PullRequestIcon, SettingsIcon } from './icons';
import TextBox from './textBox';
import LocalStorageAPI from '../../helpers/localstorageAPI';
import GithubAPI from '../../helpers/githubAPI';
import AuthenticationService from '../../helpers/authenticationService';

const refreshRateMenuItems = [
  <MenuItem key={1} value={0} primaryText="Never" />,
  <MenuItem key={2} value={2} primaryText="Every 2 minutes" />,
  <MenuItem key={3} value={4} primaryText="Every 4 minutes" />,
  <MenuItem key={4} value={8} primaryText="Every 8 minutes" />,
];

class GithubWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        refreshRate: null,
        refreshRateOptions: [null, 2, 4, 8],
        username: null,
        oauthToken: null,
      },
      storageKey: this.constructor.name,
      
      reposAvailable: [
        'admin-ui',
        'ml-projects',
        'rick-and-morty-ui',
        'java-backend',
        'js-frontend',
        'golang-playground',
        'DeveloperWarRoom',
        'MachineLearningProjects',
      ],

      reposWatching: ['DeveloperWarRoom'],
      
      pullRequests: {
        DeveloperWarRoom: [
          {
            branch: 'bug/110/update-bindings',
            title: 'Remove bindings in the render() functions ets.',
            body: 'Lorem ipsum dolor sit amet, ut blandit constituto deterruisset vim. Elitr ponderum instructior id has, ut unum nostrud offendit has, graecis vulputate scriptorem est id. Has vidisse repudiandae ei, mei fierent suscipiantur ad, an eam aeterno praesent. Ea reprimique omittantur mei, diam graeco menandri mel te. Mei laudem everti vivendo ei, sit ea eleifend constituto.',
            author: {
              name: '@rogger-rabbit',
              avatar: 'https://vignette.wikia.nocookie.net/spongebobandfriendsadventures/images/c/c0/Cliprogerrabbit.gif/revision/latest?cb=20110625150437',
            },
            reviews: [],
            comments: [],
          },
          {
            branch: 'feature/99/create-ui-prototype',
            title: 'Make the UI for the github thingy',
            body: 'Lorem ipsum dolor sit amet, ut blandit constituto deterruisset vim. Elitr ponderum instructior id has, ut unum nostrud offendit has, graecis vulputate scriptorem est id. Has vidisse repudiandae ei, mei fierent suscipiantur ad, an eam aeterno praesent. Ea reprimique omittantur mei, diam graeco menandri mel te. Mei laudem everti vivendo ei, sit ea eleifend constituto.',
            author: {
              name: '@andy-keene',
              avatar: 'https://avatars1.githubusercontent.com/u/20017363?s=400&u=ead1539b261e59b39c7ae4dbabad4ad9e27525f1&v=4',
            },
            reviews: [],
            comments: [],
          },
          // ...
        ],
        MachineLearningProjects: [
          {
            branch: 'project/n-puzzle',
            title: 'Prove invariant of test cases',
            body: 'Lorem ipsum dolor sit amet, ut blandit constituto deterruisset vim. Elitr ponderum instructior id has, ut unum nostrud offendit has, graecis vulputate scriptorem est id. Has vidisse repudiandae ei, mei fierent suscipiantur ad, an eam aeterno praesent. Ea reprimique omittantur mei, diam graeco menandri mel te. Mei laudem everti vivendo ei, sit ea eleifend constituto.',
            author: {
              name: 'andy keene',
              avatar: 'https://avatars1.githubusercontent.com/u/20017363?s=400&u=ead1539b261e59b39c7ae4dbabad4ad9e27525f1&v=4',
            },
            reviews: [],
            comments: [],
          },
        ],
        // ...
      },

    };
    this.onRepoChange = this.onRepoChange.bind(this);
    this.onRefreshRateChange = this.onRefreshRateChange.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
  }

  componentWillMount() {
    /* retrieves settings from storage */
    const savedSettings = LocalStorageAPI.get(this.state.storageKey);
    if (savedSettings) {
      this.setState({ settings: savedSettings });
    }
  }


  componentDidUpdate(prevProps, prevState) {
    /* saves state to local storage iff settings updated */
    if (_.isEqual(prevState.settings, { ...this.state.settings })) {
      return;
    }
    LocalStorageAPI.put(this.state.storageKey, this.state.settings);
  }

  onRefreshRateChange(event, index, value) {
    if (index < 0) {
      return;
    }
    this.setState({ settings: { ...this.state.settings, ...{ refreshRate: value } } });
  }

  onRepoChange(itemsSelected) {
    /* can expand to include args, name */
    /* Is sent the current selection of repos to watch */
    const updatedReposWatching = itemsSelected.map(item => item.value);
    this.setState({ reposWatching: updatedReposWatching });
  }

  onSettingsChange(key, newValue) {
    /* updates settings with ...{key: newvalue} */
    const settingsSubset = {};
    settingsSubset[key] = newValue;
    this.setState({ settings: { ...this.state.settings, ...settingsSubset } });
  }

  renderSettingsTab() {
    return (
      <div>
        <SelectField
          fullWidth
          floatingLabelFixed
          floatingLabelText="Refresh rate"
          hintText="How often should we check Github for you?"
          value={this.state.settings.refreshRate}
          onChange={this.onRefreshRateChange}
        >
          {refreshRateMenuItems}
        </SelectField>

        <TextBox
          fullWidth
          floatingLabelFixed
          floatingLabelText="Github Token"
          settingskey="oauthToken"
          value={this.state.settings.oauthToken|| ''}
          hintText={'Will you share your Oauth token?'}
          onSubmit={this.onSettingsChange}
        />

        <TextBox
          fullWidth
          floatingLabelFixed
          floatingLabelText="Username"
          settingskey="username"
          value={this.state.settings.username|| ''}          
          hintText={'What is your @username?'}
          onSubmit={this.onSettingsChange}
        />

        {/* https://www.npmjs.com/package/material-ui-superselectfield#usage */}
        <SuperSelectField
          style={{ marginTop: '45px', fontSize: '16px', lineHeight: '24px' }}
          checkPosition="left"
          keepSearchOnSelect
          withResetSelectAllButtons
          multiple
          name="ReposToWatch"
          value={this.state.reposWatching.map(repo => ({ value: repo }))}
          onSelect={this.onRepoChange}
          floatingLabel="Repository List"
          dataSource={this.state.reposAvailable}
          hintTextAutocomplete={'Let\'s find a repo to add...'}
          showAutocompleteThreshold="always"
        >
          {this.state.reposAvailable.map(repo => (
            <div key={repo} id={repo} label={repo} value={repo}> {repo} </div>
                ))}
        </SuperSelectField>
      </div>

    );
  }

  render() {
    new AuthenticationService().login(()=>{});
    let githubAPI = new GithubAPI();
    githubAPI.getRepositories();

    // this might be best moved into state? so we don't do this everyime *anything* changes
    const state = { ...this.state };
    const openPullRequestsList = state.reposWatching.map(repoName => (
      <RepoPullRequestList
        key={repoName}
        repoName={repoName}
        pullRequests={state.pullRequests[repoName] || []}
      />
    ));

    return (
      <div>
        <Paper>
          <Tabs>
            <Tab icon={<PullRequestIcon />}>
              {openPullRequestsList}
            </Tab>
            <Tab icon={<SettingsIcon />}>
              {this.renderSettingsTab()}
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default GithubWidget;
