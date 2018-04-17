import React, { Component } from 'react';
import { Paper, Tabs, Tab, SelectField, MenuItem} from 'material-ui';

import RepoPullRequestList from './repoPullRequestList';
import { RepositoryIcon, PullRequestIcon, SettingsIcon } from './icons';
import RepositoryList from './repositoryList';

const iconStyle = {
  height: '50'
}

class GithubWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        refreshRate: 2,
        refreshRateOptions: [0, 2, 4, 16, 32]
      },
      reposAvailable: [
        'admin-ui',
        'ml-projects',
        'rick-and-morty-ui',
        'java-backend',
        'js-frontend',
        'golang-playground',
        'DeveloperWarRoom',
        'MachineLearningProjects'
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
              avatar: 'https://vignette.wikia.nocookie.net/spongebobandfriendsadventures/images/c/c0/Cliprogerrabbit.gif/revision/latest?cb=20110625150437'
            },
            reviews: [],
            comments: []
          },
          {
            branch: 'feature/99/create-ui-prototype',
            title: 'Make the UI for the github thingy',
            body: 'Lorem ipsum dolor sit amet, ut blandit constituto deterruisset vim. Elitr ponderum instructior id has, ut unum nostrud offendit has, graecis vulputate scriptorem est id. Has vidisse repudiandae ei, mei fierent suscipiantur ad, an eam aeterno praesent. Ea reprimique omittantur mei, diam graeco menandri mel te. Mei laudem everti vivendo ei, sit ea eleifend constituto.',
            author: {
              name: '@andy-keene',
              avatar: 'https://avatars1.githubusercontent.com/u/20017363?s=400&u=ead1539b261e59b39c7ae4dbabad4ad9e27525f1&v=4'
            },
            reviews: [],
            comments: []            
          }
          // ...
        ],
        MachineLearningProjects: [
          {
            branch: 'project/n-puzzle',
            title: 'Prove invariant of test cases',
            body: 'Lorem ipsum dolor sit amet, ut blandit constituto deterruisset vim. Elitr ponderum instructior id has, ut unum nostrud offendit has, graecis vulputate scriptorem est id. Has vidisse repudiandae ei, mei fierent suscipiantur ad, an eam aeterno praesent. Ea reprimique omittantur mei, diam graeco menandri mel te. Mei laudem everti vivendo ei, sit ea eleifend constituto.',
            author: {
              name: 'andy keene',
              avatar: 'https://avatars1.githubusercontent.com/u/20017363?s=400&u=ead1539b261e59b39c7ae4dbabad4ad9e27525f1&v=4'
            },
            reviews: [],
            comments: []            
          }
        ],
        // ...
      },

    };
    this.onReposWatchingChange = this.onReposWatchingChange.bind(this);
  }

  onReposWatchingChange(newRepoTitle) {
    this.setState({reposWatching: [...this.state.reposWatching, newRepoTitle]});
  }

  onRefreshRateChange(event, key, payload) {
    //TODO: Finish function
  }

  render() {

    let state = this.state;
    console.log(state.reposWatching);

    //this might be best moved into state? so we don't do this everyime *anything* changes
    let openPullRequestsList = state.reposWatching.map(repoName => {
      return (
        <RepoPullRequestList key={repoName} repoName={repoName} pullRequests={this.state.pullRequests[repoName]}/>
      );
    });
    
    return (
      <div>
        <Paper>
          <Tabs>
            
            <Tab icon={<PullRequestIcon />}>
              {openPullRequestsList}
            </Tab>

            <Tab icon={<SettingsIcon />}>
              <SelectField
                floatingLabelText="Refresh rate"
                hintText="ANY"
                value={this.state.settings.refreshRate}
                onChange={this.handleRefreshRateChange}
              >
                <MenuItem value={1} primaryText="Never" />
                <MenuItem value={1} primaryText="Every 2 minutes" />
                <MenuItem value={1} primaryText="Every 4 minutes" />
                <MenuItem value={1} primaryText="Every 8 minutes" />
              </SelectField>
              <RepositoryList availableRepos={state.reposAvailable} onUpdate={this.onReposWatchingChange}/>
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default GithubWidget;

/*
{
                  this.state.settings.refreshRateOptions.map(minutes => {
                    let text = minutes == 0 ? 'Never' : `Every ${minutes} minutes`;
                    return (
                      <MenuItem value={minutes} primaryText={text} />
                    )
                  })
                } 
                */