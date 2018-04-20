import React, { Component } from 'react';
import { Paper, Tabs, Tab, SelectField, MenuItem, TextField } from 'material-ui';
import SuperSelectField from 'material-ui-superselectfield';
import RepoPullRequestList from './repoPullRequestList';
import { PullRequestIcon, SettingsIcon } from './icons';

// TODO: can probably use a map to construct this
const refreshRateMenuItems = [
  <MenuItem key={0} value={0} primaryText="Never" />,
  <MenuItem key={2} value={2} primaryText="Every 2 minutes" />,
  <MenuItem key={4} value={4} primaryText="Every 4 minutes" />,
  <MenuItem key={8} value={8} primaryText="Every 8 minutes" />,
];

class GithubWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        refreshRate: 8,
        refreshRateOptions: [0, 2, 4, 16, 32],
      },
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
  }

  onRefreshRateChange(event, key) {
    /* can expand to include args, payload */
    // TODO: Finish function
    console.log(`setting refresh rate to ${key}`);
    this.setState({ settings: { ...this.state.settings, ...{ refreshRate: key } } });
  }

  onRepoChange(itemsSelected) {
    /* can expand to include args, name */
    /* Is sent the current selection of repos to watch */
    console.log('selected items ', itemsSelected);
    const updatedReposWatching = itemsSelected.map(item => item.value);
    this.setState({ reposWatching: updatedReposWatching });
  }

  // TODO: Add github refresh evrery n seconds, refresh data , foo(), foo1()....

  render() {
    const state = this.state;
    console.log(state.reposWatching);

    // this might be best moved into state? so we don't do this everyime *anything* changes
    const openPullRequestsList = state.reposWatching.map(repoName => (
      <RepoPullRequestList
        key={repoName}
        repoName={repoName}
        pullRequests={this.state.pullRequests[repoName] || []}
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
              <SelectField
                floatingLabelFixed
                floatingLabelText="Refresh rate"
                hintText="How often should we check Github for you?"
                value={this.state.settings.refreshRate}
                onChange={this.onRefreshRateChange}
              >
                {refreshRateMenuItems}
              </SelectField>


              <TextField
                hintText={this.state.settings.username || 'What is your @username?'}
                defaultValue={this.state.settings.username}
                floatingLabelText="Username"
                fullWidth
              />
              <TextField
                hintText={this.state.settings.token || "I promise I won't share your token..."}
                defaultValue={this.state.settings.oathToken}
                floatingLabelText="Github Oauth Token"
                fullWidth
              />


              <br />
              {/* TESTING */}
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
              <br />

            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default GithubWidget;
