import React from 'react';
import { Subheader } from 'material-ui';
import PullRequestCard from './pullRequestCard';


const RepoPullRequestList = (props) => {
  const pullRequestCards = props.pullRequests.map(pullRequest => (
    <PullRequestCard key={pullRequest.title} pullRequest={pullRequest} />
  ));
  return (
    <div>
      <Subheader> {props.repoName} </Subheader>
      {pullRequestCards}
    </div>
  );
};

export default RepoPullRequestList;
