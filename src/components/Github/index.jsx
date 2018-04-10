import React, { Component } from 'react';
import { Paper, Tabs, Tab } from 'material-ui';

import RepoPullRequestList from './repoPullRequestList';
import { RepositoryIcon, PullRequestIcon, SettingsIcon } from './icons';
import RepositoryList from './repositoryList';

class GithubWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {},
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
      reposWatching: [],
      pullRequests: {
        DeveloperWarRoom: [
          {
            branch: 'bug/110/update-bindings',
            title: 'Remove bindings in the render() functions ets.',
            body: 'Lorem ipsum dolor sit amet, ut blandit constituto deterruisset vim. Elitr ponderum instructior id has, ut unum nostrud offendit has, graecis vulputate scriptorem est id. Has vidisse repudiandae ei, mei fierent suscipiantur ad, an eam aeterno praesent. Ea reprimique omittantur mei, diam graeco menandri mel te. Mei laudem everti vivendo ei, sit ea eleifend constituto.',
            author: {
              name: 'rogger rabbit',
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
              name: 'andy keene',
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

  render() {

    let state = this.state;
    console.log(state.reposWatching);

    //this might be best moved into state? so we don't do this everyime *anything* changes
    let openPullRequestsList = state.reposWatching.map(repoName => {
      return (
        <RepoPullRequestList key={repoName} repoName={repoName} pullRequests={this.state.pullRequests.repoName}/>
      );
    });
    
    return (
      <div>
        <Paper>
          <Tabs>
            <Tab icon={<PullRequestIcon />}>
              {openPullRequestsList}
            </Tab>

            <Tab icon={<RepositoryIcon />}>
              <RepositoryList availableRepos={state.reposAvailable} onUpdate={this.onReposWatchingChange}/>
            </Tab>

            <Tab icon={<SettingsIcon />}>
              need to make this side I guess?
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default GithubWidget;
