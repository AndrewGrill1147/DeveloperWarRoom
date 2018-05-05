import React, { Component } from 'react';
import { Paper, Tabs, Tab, SelectField, MenuItem } from 'material-ui';
import SuperSelectField from 'material-ui-superselectfield';
import _ from 'lodash';
import RepoPullRequestList from './repoPullRequestList';
import { PullRequestIcon, SettingsIcon } from './icons';
import TextBox from './textBox';
import LocalStorageAPI from '../../helpers/localstorageAPI';
import GithubAPI from '../../helpers/githubAPI';
import { FilterPullRequestData } from './dataFiltering';

// TODO: Save state.reposWatching to local storage
// TODO: Factor out clear and setInterval calls to component functions
// TODO: Filter PR data
// TODO: Filter Repo data
// TODO: Rewrite filter to filter sub objects...
// TODO: Actually use the Github Username and Token to authenticate....

// minutes to milliseconds factor
const CONVERSION_FACTOR = 60000;

const refreshRateMenuItems = [
  <MenuItem key={1} value={0} primaryText="Never" />,
  <MenuItem key={2} value={0.2} primaryText="Every 12 seconds" />,
  <MenuItem key={3} value={5} primaryText="Every 5 minutes" />,
  <MenuItem key={4} value={15} primaryText="Every 15 minutes" />,
  <MenuItem key={5} value={30} primaryText="Every 30 minutes" />,
  <MenuItem key={6} value={60} primaryText="Every 1 hour" />,
];

class GithubWidget extends Component {
  constructor(props) {
    super(props);

    this.timerObject = null;
    this.state = {
      // TODO: Review, should we put this here?...
      githubAPI: new GithubAPI(),
      settings: {
        refreshRate: null, // 2
        refreshRateOptions: [null, 1, 5, 15, 30, 60],
        username: null,
        oauthToken: null,
      },

      timer: null,
      storageKey: this.constructor.name,
      reposAvailable: [],
      reposWatching: [],
      pullRequests: { },
    }
    

    this.onRepoChange = this.onRepoChange.bind(this);
    this.onRefreshRateChange = this.onRefreshRateChange.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.updateReposAvailable = this.updateReposAvailable.bind(this);
    this.checkPullRequests = this.checkPullRequests.bind(this);
  }

  componentWillMount() {
    /* retrieves settings from storage */
    const savedSettings = LocalStorageAPI.get(this.state.storageKey);
    if (savedSettings) {
      this.setState({ settings: savedSettings });
    }
    // console.log('In componentWillMount');
    // get repos
    this.state.githubAPI.getRepos(this.updateReposAvailable);
  }

  componentDidMount() {
    // no refresh rate is set
    if (!this.state.settings.refreshRate) {
      return;
    }

    this.timerObject = setInterval(
      this.checkPullRequests,
      this.state.settings.refreshRate * CONVERSION_FACTOR,
    );
  }

  checkPullRequests() {
    /* invoked every x minutes, polls PR info for each repo */
    console.log('inCheckPullRequest');
    this.state.reposWatching.forEach((repo) => {
      this.state.githubAPI.getPullRequestsByRepo(
        this.mapPullRequestsToState.bind(this, repo.name),
        repo.name, repo.owner.login,
      );
    });
    // ..then call model pull requests?
  }

  mapPullRequestsToState(reponame, resp) {
    // console.log('reponame ', reponame, 'data ', resp);
    // map the resp pull requests to state pull requests var
    if (!resp.success) {
      return;
    }
    const updatedRepoPRs = {};
    updatedRepoPRs[reponame] = resp.data.map(FilterPullRequestData);

    console.log(updatedRepoPRs);
    this.setState({ pullRequests: { ...this.state.pullRequests, ...updatedRepoPRs } });
  }

  componentDidUpdate(prevProps, prevState) {
    /* saves state to local storage iff settings updated */
    if (_.isEqual(prevState.settings, { ...this.state.settings })) {
      return;
    }
    LocalStorageAPI.put(this.state.storageKey, this.state.settings);
  }

  componentWillUnmount() {
    clearInterval(this.timerObject);
  }

  /* handles the response from the githubAPI.getRepos() */
  updateReposAvailable(resp) {
    // console.log('In update repos = ', resp);
    if (!resp.success) {
      return;
    }
    // TODO: Compress data saved? This repo object is LARGE
    const availableRepos = resp.data.map(repo => repo);
    this.setState({ reposAvailable: availableRepos });
  }

  onRefreshRateChange(event, index, value) {
    if (this.timerObject !== null) {
      clearInterval(this.timerObject);
    }

    if (value !== 0) {
      // 1 minutes = 60 sec * 1000 ms / s
      this.timerObject = setInterval(this.checkPullRequests, value * CONVERSION_FACTOR);
    }

    this.setState({ settings: { ...this.state.settings, ...{ refreshRate: value } } });
  }

  onRepoChange(itemsSelected) {
    /* can expand to include args, name */
    /* Is sent the current selection of repos to watch */

    // TODO: Refactor
    const updatedReposWatching = [];

    itemsSelected.forEach((item) => {
      const matchingRepos = this.state.reposAvailable.filter(repo => repo.id === item.value);

      if (matchingRepos.length === 1) {
        updatedReposWatching.push(matchingRepos[0]);
      }
    });
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
          value={this.state.settings.oauthToken || ''}
          hintText="Will you share your Oauth token?"
          onSubmit={this.onSettingsChange}
        />

        <TextBox
          fullWidth
          floatingLabelFixed
          floatingLabelText="Username"
          settingskey="username"
          value={this.state.settings.username || ''}
          hintText="What is your @username?"
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
          value={this.state.reposWatching.map(repo => ({ value: repo.id, label: repo.name }))}
          onSelect={this.onRepoChange}
          floatingLabel="Repository List"
          dataSource={this.state.reposAvailable}
          hintTextAutocomplete={'Let\'s find a repo to add...'}
          showAutocompleteThreshold="always"
        >
          {this.state.reposAvailable.map(repo => (
            <div key={repo.id} id={repo.id} label={repo.name} value={repo.id}> {repo.name} </div>
                ))}
        </SuperSelectField>
      </div>

    );
  }

  render() {
    console.log('state', this.state);
    // this might be best moved into state? so we don't do this everyime *anything* changes
    const state = { ...this.state };
    const openPullRequestsList = state.reposWatching.map(repo => (
      <RepoPullRequestList
        key={repo.name}
        repoName={repo.name}
        pullRequests={state.pullRequests[repo.name] || []}
      />
    ));

    // RepoPullRequestList
    //   -> list of PullRequest Cards []
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
