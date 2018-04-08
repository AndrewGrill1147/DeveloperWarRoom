import React, { Component } from 'react';
import { TextField, AutoComplete, ListItem, Checkbox, List } from 'material-ui';

const ENTER_KEY = 13;

class RepositoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      verifying: false,
      repos: [],
      maxResults: 10,
    };

    this.handleNewRequest = this.handleNewRequest.bind(this);
  }

  handleToggle(toggledRepo) {
    // console.log('checked item ', repo)

    const updateRepos = this.state.repos.map((repo) => {
      if (repo === toggledRepo) {
        return { ...repo, ...{ watching: !toggledRepo.watching } };
      }
      return repo;
    });

    this.setState({ repos: updateRepos });
  }
  handleNewRequest(chosenRequest, index) {
    console.log('request recieved');
    console.log(chosenRequest);
    console.log(index);

    // TODO: check already not in list
    if (index === -1) {
      return;
    }
    this.setState({ repos: [...this.state.repos, ...[{ title: chosenRequest, watching: true }]] });
  }

  render() {
    const repoCheckList = this.state.repos.map(repo => (
      <ListItem
        key={repo.title}
        primaryText={repo.title}
        leftCheckbox={
          <Checkbox
            onCheck={() => { this.handleToggle(repo); }}
            checked={repo.watching}
          />
          }
      />
    ), this);

    return (
      <div>
        <AutoComplete
          hintText="Would you like to add a repository to watch?"
          fullWidth
          onNewRequest={this.handleNewRequest}
          dataSource={this.props.availableRepos}
          maxSearchResults={this.state.maxResults}
        />

        <List>
          {repoCheckList}
        </List>
      </div>
    );
  }
}

/*


<TextField
            id="newRepo"
            value={this.state.newRepo}
            hintText="What repository would your like to watch?"
            underlineShow={true}
            onChange={this.handleChange}
            fullWidth={true}
          />

    */

export default RepositoryList;
