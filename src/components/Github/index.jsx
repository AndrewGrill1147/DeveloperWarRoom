import React, { Component } from 'react';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import { Paper, Tabs, Tab, SelectField, MenuItem, Toggle, IconButton } from 'material-ui';
import SuperSelectField from 'material-ui-superselectfield';
import _ from 'lodash';
import RepoPullRequestList from './repoPullRequestList';
import { PullRequestIcon } from './icons';
import TextBox from './textBox';
import LocalStorageAPI from '../../helpers/localstorageAPI';
import GithubAPI from '../../helpers/githubAPI';
import { FilterPullRequestData, FilterRepoData } from './dataFiltering';

const styles = {
  margin: {
    margin: '3px',
  },
  errorMessage: {
    padding: '20px',
    backgroundColor: '#f44336',
    color: 'white',
    marginBottom: '15px',
    textAlign: 'center',
    margin: '5px',
  },
  floatRight: {
    float: 'right',
    margin: '5px',
  },
  toggle: {
    label: {
      fontSize: '16px',
      marginBottom: '10px',
    },
  },
  refreshDropdown: {
    float: 'left',
    width: '95%',
  },
  refreshButton: {
    float: 'left',
    width: '5%',
    marginTop: '27px',
  },

  divStyle: {
    width: '100%',
    height: '100%',
  },
  expand: {
    maxHeight: '100%',
    overflow: 'auto',
  },

  superSelectField: {
    marginTop: '45px',
    fontSize: '16px',
    lineHeight: '24px',
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
        displayOauthTokenValue: true,
        watchAllRepos: false,
        translateMarkdownToHTML: false,
        refreshRate: null,
        refreshRateOptions: [null, 1, 5, 15, 30, 60],
        username: null,
        oauthToken: null,
        reposWatching: [],
      },
      timer: null,
      storageKey: this.constructor.name,
      reposAvailable: [],
      pullRequests: {},
    };

    this.refresh = this.refresh.bind(this);
    this.onRepoChange = this.onRepoChange.bind(this);
    this.onRefreshRateChange = this.onRefreshRateChange.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.updateReposWatching = this.updateReposWatching.bind(this);
    this.updateReposAvailable = this.updateReposAvailable.bind(this);
    this.checkReposAvailable = this.checkReposAvailable.bind(this);
    this.checkPullRequests = this.checkPullRequests.bind(this);
  }

  componentWillMount() {
    /* retrieves settings from storage */
    const savedSettings = LocalStorageAPI.get(this.state.storageKey);
    if (savedSettings) {
      this.setState({ settings: { ...this.state.settings, ...savedSettings } });
      this.state.githubAPI.setCredentials(savedSettings.username, savedSettings.oauthToken);
    }
    // get repos
    this.checkReposAvailable();
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
      this.state.githubAPI.setCredentials(
        this.state.settings.username,
        this.state.settings.oauthToken,
      );
      this.checkReposAvailable();
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
    this.setState({
      settings: { ...this.state.settings, ...{ reposWatching: updatedReposWatching } },
    });
  }

  onSettingsChange(key, newValue) {
    /* updates settings with ...{key: newvalue} */
    const settingsSubset = {};
    settingsSubset[key] = newValue;


    this.setState(
      { settings: { ...this.state.settings, ...settingsSubset } },
      () => {
        if (this.state.settings.watchAllRepos &&
          this.state.settings.reposWatching !== this.state.reposAvailable) {
          this.setState({
            settings: {
              ...this.state.settings,
              ...{ reposWatching: this.state.reposAvailable },
            },
          });
        }
      },

    );
  }

  onToggle(key, event, isInputChecked) {
    this.onSettingsChange(key, isInputChecked);
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
    this.state.settings.reposWatching.forEach((repo) => {
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
      if (resp.error.status === 404) {
        // if repo is not found it may have been deleted so trigger an update
        this.checkReposAvailable();
      }
      // trigger reRender to show error message
      this.setState({ githubFailed: true });
      return;
    }

    const updatedRepoPRs = {};
    updatedRepoPRs[reponame] = resp.data.map(FilterPullRequestData);

    // use each PRs review_url to fetch the reviews and then map the data back into the PR
    this.setState({ pullRequests: { ...this.state.pullRequests, ...updatedRepoPRs } });
  }


  updateReposWatching(newReposAvailable) {
    /* verify the repos we are watching are still available to watch */
    if (this.state.settings.reposWatching.length === 0) { return; }


    //if the watchallrepos option is on and reposwatching list is different from updated repos available
    //set reposWatching to newReposAvailable
    else if (this.state.settings.watchAllRepos &&
      this.state.settings.reposWatching !== newReposAvailable) {
      this.setState({
        settings: {
          ...this.state.settings,
          ...{ reposWatching: newReposAvailable },
        }
      });
    }
    else {
      //check the currently repos watching list if some repos got removed 
      const repoIdsAvailable = {};
      newReposAvailable.forEach((repo) => {
        repoIdsAvailable[repo.id] = true;
      });
      const reposWatchingStill = this.state.settings.reposWatching.filter(repo =>
        repo.id in repoIdsAvailable);
      this.setState({
        settings: {
          ...this.state.settings,
          ...{ reposWatching: reposWatchingStill },
        },
      });
    }
  }

  updateReposAvailable(resp) {
    /* handles the response from the githubAPI.getRepos()
      removes any deleted repos from this.state.settings.reposWatching
    */
    if (!resp.success) {
      return;
    }
    const availableRepos = resp.data.map(FilterRepoData);
    this.setState({ reposAvailable: availableRepos }); // asynch, so I'll run eventually....
    this.updateReposWatching(availableRepos);
  }

  checkReposAvailable() {
    this.state.githubAPI.getRepos(this.updateReposAvailable);
  }

  /* refresh (once) repo and PR data */
  refresh() {
    this.checkPullRequests();
    this.checkReposAvailable();
  }

  renderSettingsTab() {
    const reposWatchingToSelectInDropdown = this.state.settings.reposWatching.map(repo => (
      { value: repo.id, label: repo.name }
    ));
    return (
      <div style={styles.margin}>
        <Toggle
          label="Display markdown"
          labelStyle={styles.toggle.label}
          labelPosition="left"
          toggled={this.state.settings.translateMarkdownToHTML}
          onToggle={this.onToggle.bind(this, 'translateMarkdownToHTML')}
        />

        <Toggle
          label="Watch all repos"
          labelStyle={styles.toggle.label}
          labelPosition="left"
          toggled={this.state.settings.watchAllRepos}
          onToggle={this.onToggle.bind(this, 'watchAllRepos')}
        />

        <Toggle
          label="Display Github token value"
          labelStyle={styles.toggle.label}
          labelPosition="left"
          toggled={this.state.settings.displayOauthTokenValue}
          onToggle={this.onToggle.bind(this, 'displayOauthTokenValue')}
        />

        <div>
          <SelectField
            style={styles.refreshDropdown}
            floatingLabelFixed
            floatingLabelText="Refresh rate"
            hintText="How often should we check Github for you?"
            value={this.state.settings.refreshRate}
            onChange={this.onRefreshRateChange}
          >
            {refreshRateMenuItems}
          </SelectField>

          <IconButton style={styles.refreshButton} onClick={this.refresh}>
            <RefreshIcon color="gray" />
          </IconButton>
        </div>

        <TextBox
          fullWidth
          floatingLabelFixed
          savedvalue={this.state.settings.oauthToken}
          floatingLabelText="Github Token"
          type={this.state.settings.displayOauthTokenValue ? "text" : "password"}
          settingskey="oauthToken"
          value={this.state.settings.oauthToken || ''}
          hintText="Will you share your Oauth token?"
          onSubmit={this.onSettingsChange}
        />

        <TextBox
          fullWidth
          floatingLabelFixed
          savedvalue={this.state.settings.username}
          floatingLabelText="Username"
          settingskey="username"
          value={this.state.settings.username || ''}
          hintText="What is your @username?"
          onSubmit={this.onSettingsChange}
        />

        {/* https://www.npmjs.com/package/material-ui-superselectfield#usage */}
        {/* note: reset means reset to the values that SuperSelect has at mount time */}
        <SuperSelectField
          id="aha"
          style={styles.superSelectField}
          checkPosition="left"
          keepSearchOnSelect
          withResetSelectAllButtons
          disabled={this.state.settings.watchAllRepos}
          multiple
          name="ReposToWatch"
          value={reposWatchingToSelectInDropdown}
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
    const state = { ...this.state };
    const openPullRequestsList = this.state.settings.reposWatching.map(repo => (
      <RepoPullRequestList
        translateMarkDownToHTML={this.state.settings.translateMarkdownToHTML}
        key={repo.id}
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
      <div style={styles.divStyle} >
        <Paper style={styles.expand} >
          <Tabs>
            <Tab icon={<PullRequestIcon />}>
              {errorMessage}
              {openPullRequestsList}
            </Tab>
            <Tab icon={<SettingsIcon />}>
              {errorMessage}
              {this.renderSettingsTab()}
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default GithubWidget;

