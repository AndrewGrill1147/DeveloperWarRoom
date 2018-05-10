import React, { Component } from 'react';
import { Paper, Tabs, Tab, SelectField, MenuItem } from 'material-ui';
import SuperSelectField from 'material-ui-superselectfield';
import _ from 'lodash';
import RepoPullRequestList from './repoPullRequestList';
import { PullRequestIcon, SettingsIcon } from './icons';
import TextBox from './textBox';
import LocalStorageAPI from '../../helpers/localstorageAPI';
import GithubAPI from '../../helpers/githubAPI';
import { FilterPullRequestData, FilterRepoData } from './dataFiltering';

// Minh:
// TODO: Filter Repo data
// TODO: styling inside of pullRequestCard

// Andy:
// DONE: Actually use the Github Username and Token to authenticate....

// Marcella:
// TODO: clean up comments and console logs
// DONE: Factor out clear and setInterval calls to individual omponent functions
// TODO: Save state.reposWatching to local storage (e.g. move to state.settings)

// Low priority:
// TODO: Rewrite filter to filter sub objects...
// TODO: refactor onRepoChange

const styles = {
  errorMessage: {
    padding: '20px',
    backgroundColor: '#f44336',
    color: 'white',
    marginBottom: '15px',
    textAlign: 'center',
    margin: '5px',
  },
};


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

    this.state = {
      githubAPI: new GithubAPI(),
      settings: {
        refreshRate: null,
        refreshRateOptions: [null, 1, 5, 15, 30, 60],
        username: null,
        oauthToken: null,
      },
      timer: null,
      storageKey: this.constructor.name,
      reposAvailable: [],
      reposWatching: [],
      pullRequests: {},
    };


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
      this.state.githubAPI.setCredentials(savedSettings.username, savedSettings.oauthToken);
    }
    // this.state.githubAPI.setCredentials("GroupCWR", "GroupCWR000");
    // get repos
    this.state.githubAPI.getRepos(this.updateReposAvailable);
  }

  componentDidMount() {
    this.setPolling();
  }

  componentDidUpdate(prevProps, prevState) {
    /* saves state to local storage iff settings updated */
    if (_.isEqual(prevState.settings, { ...this.state.settings })) {
      return;
    }

    // update github creds (object refference allows polling to continue)
    if (this.state.settings.username !== prevState.settings.username
        || this.state.settings.oauthToken !== prevState.settings.oauthToken) {
      //      console.log(`updating github API creds! w/ ${currOathToken} ${currUsername}` );
      this.state.githubAPI.setCredentials(
        this.state.settings.username,
        this.state.settings.oauthToken,
      );
      this.state.githubAPI.getRepos(this.updateReposAvailable);
    }
    LocalStorageAPI.put(this.state.storageKey, this.state.settings);
  }

  componentWillUnmount() {
    this.setPolling();
  }

  onRefreshRateChange(event, index, value) {
    if (value === 0) {
      this.clearPolling();
    } else {
      this.setPolling(value);
    }
    this.setState({ settings: { ...this.state.settings, ...{ refreshRate: value } } });
  }

  onRepoChange(itemsSelected) {
    /* can expand to include args, name */
    /* Is sent the current selection of repos to watch */

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
    console.log(settingsSubset[key]);

    this.setState({ settings: { ...this.state.settings, ...settingsSubset } });
  }

  setPolling(rate = null) {
    /* starts polling github / prioritizes rate parameter over state.settings */
    if (!rate && !this.state.settings.refreshRate) {
      return;
    }
    this.clearPolling();
    const refreshRate = rate || this.state.settings.refreshRate;
    const newTimerObject = setInterval(
      this.checkPullRequests,
      refreshRate * CONVERSION_FACTOR,
    );
    this.setState({ timer: newTimerObject });
  }

  clearPolling() {
    if (!this.state.timer) {
      return;
    }
    clearInterval(this.state.timer);
    this.setState({ timer: null });
  }

  checkPullRequests() {
    /* invoked every x minutes, polls PR info for each repo */
    console.info('polling github...');
    this.state.reposWatching.forEach((repo) => {
      // TODO: check auth status?
      this.state.githubAPI.getPullRequestsByRepo(
        this.mapPullRequestsToState.bind(this, repo.name),
        repo.name, repo.owner.login,
      );
    });
  }

  mapPullRequestsToState(reponame, resp) {
    /* map the github PR response to state.pullRequests */
    if (!resp.success) {
      // trigger reRender to show error message
      this.setState({ githubFailed: true });
      console.error(`(ERR) Github API fail: ${resp.error}`);
      return;
    }
    const updatedRepoPRs = {};
    updatedRepoPRs[reponame] = resp.data.map(FilterPullRequestData);

    // use each PRs review_url to fetch the reviews and then map the data back into the PR
    this.setState({ pullRequests: { ...this.state.pullRequests, ...updatedRepoPRs } });
  }

  updateReposAvailable(resp) {
    /* handles the response from the githubAPI.getRepos() */
    if (!resp.success) {
      return;
    }
    const filteredRepos = resp.data.map(FilterRepoData);
    console.log(filteredRepos);
    this.setState({ reposAvailable: filteredRepos });
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
    let errorMessage = null;

    if (!state.githubAPI.isAuthenticated) {
      errorMessage = (
        <div style={styles.errorMessage}>
          Uh oh. We can&apos;t seem to reach Github right now
        </div>
      );
    }

    return (
      <div>
        <Paper>
          <Tabs>
            <Tab icon={<PullRequestIcon />}>
              {errorMessage}
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