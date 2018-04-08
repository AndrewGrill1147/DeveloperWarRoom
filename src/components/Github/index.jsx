import React, { Component } from 'react';
import { Paper, Tabs, Tab } from 'material-ui';

import PullRequestList from './pullRequestList';
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
      ],
      reposWatching: [],
      pullRequests: {
        repoName1: [
          {},
          {},
          // ...
        ],
        repoName2: {},
        // ...
      },

    };
  }

  render() {
    return (
      <div>
        <Paper>
          <Tabs>
            <Tab icon={<PullRequestIcon />}>
              <PullRequestList repoName="Repo 1" />
              <PullRequestList repoName="Repo 2" />
            </Tab>

            <Tab icon={<RepositoryIcon />}>
              <RepositoryList availableRepos={['repository one', 'repository 2', 'repository 3', 'etc']} />
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
