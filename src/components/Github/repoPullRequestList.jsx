import React from 'react';
import { Subheader } from 'material-ui';
import PullRequestCard from './pullRequestCard';


const RepoPullRequestList = props => (
  <div>
    <Subheader> {props.repoName} </Subheader>
    <PullRequestCard />
  </div>
);

export default RepoPullRequestList;
