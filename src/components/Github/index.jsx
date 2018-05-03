import React, { Component } from 'react';
import { Paper, Tabs, Tab, SelectField, MenuItem } from 'material-ui';
import SuperSelectField from 'material-ui-superselectfield';
import _ from 'lodash';
import RepoPullRequestList from './repoPullRequestList';
import { PullRequestIcon, SettingsIcon } from './icons';
import TextBox from './textBox';
import LocalStorageAPI from '../../helpers/localstorageAPI';
import GithubAPI from '../../helpers/githubAPI';

const refreshRateMenuItems = [
  <MenuItem key={1} value={0} primaryText="Never" />,
  <MenuItem key={2} value={1} primaryText="Every 1 minutes" />,
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
    this.updateReposAvailable = this.updateReposAvailable.bind(this);
    this.checkPullRequests = this.checkPullRequests.bind(this);
  }

  componentWillMount() {
    /* retrieves settings from storage */
    const savedSettings = LocalStorageAPI.get(this.state.storageKey);
    if (savedSettings) {
      this.setState({ settings: savedSettings });
    }
    console.log('In componentWillMount');
    // get repos
    this.state.githubAPI.getRepos(this.updateReposAvailable);
  }

  componentDidMount() {
    console.log('In componentDidMount');
    // setTimeout(callback, time);
  }

  checkPullRequests() {
    console.log('test');
    // invoked every x minutes
    // for each REPO get all the pull requests
    this.state.reposWatching.forEach((repo) => {
      console.log(repo);

      this.state.githubAPI.getPullRequestsByRepo(this.mapPullRequestsToState.bind(this, repo.name), repo.name, repo.owner.login);
    });
    // ..then call model pull requests?
  }

  mapPullRequestsToState(reponame, resp) {
      console.log(reponame, resp);
      //map the resp pull requests to state pull requests var
      if (!resp.success) {
        return;
      }
  
      //TODO: Compress data saved? This repo object is LARGE
      this.setState({pullRequests: resp.data});
      console.log(this.state.pullRequests);

  }

  componentWillUnmount() {
    clearInterval(this.timerObject);
  }

  /* handles the response from the githubAPI.getRepos() */
  updateReposAvailable(resp) {
    console.log('In update repos = ', resp);
    if (!resp.success) {
      return;
    }

    // TODO: Compress data saved? This repo object is LARGE
    const availableRepos = resp.data.map(repo => repo);
    this.setState({ reposAvailable: availableRepos });
    //TODO: Compress data saved? This repo object is LARGE
    let availableRepos = resp.data.map(repo => {
      return repo;
    });
    this.setState({reposAvailable: availableRepos});
  }

  componentDidUpdate(prevProps, prevState) {
    /* saves state to local storage iff settings updated */
    if (_.isEqual(prevState.settings, { ...this.state.settings })) {
      return;
    }
    LocalStorageAPI.put(this.state.storageKey, this.state.settings);
  }

  onRefreshRateChange(event, index, value) {
    //  console.log('In onRefreshRateChange');
    if (value === 0) {
      if (this.timerObject !== null) {
        //  console.log("check pull requests Never ");
        clearInterval(this.timerObject);
      }
    } else {
      // console.log("check pull requests every " + value + " minutes");
      this.timerObject = setInterval(this.checkPullRequests, value * 60000);
      this.setState({ timer: this.timerObject });
    }
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
          // value={this.state.settings.refreshRate}
          value={this.state.refreshRate}
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
    // this might be best moved into state? so we don't do this everyime *anything* changes
    const state = { ...this.state };
    const openPullRequestsList = state.reposWatching.map(repo => (
      <RepoPullRequestList
        key={repo.name}
        repoName={repo.name}
        pullRequests={state.pullRequests[repo.name] || []}
      />
    ));
    return (
      <div>
        <Paper>
          <Tabs>
            <Tab icon={<PullRequestIcon />}>
              {/* openPullRequestsList */}
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
