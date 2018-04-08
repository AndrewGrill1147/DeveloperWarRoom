import React from 'react';
import { Subheader } from 'material-ui';
import PullRequestCard from './pullRequestCard';


const PullRequestList = props => (
  <div>
    <Subheader> {props.repoName} </Subheader>
    <PullRequestCard />
  </div>
);

export default PullRequestList;
