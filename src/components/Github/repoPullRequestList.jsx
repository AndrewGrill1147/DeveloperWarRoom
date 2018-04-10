import React from 'react';
import { Subheader } from 'material-ui';
import PullRequestCard from './pullRequestCard';


const RepoPullRequestList = props => {
  let pullRequestCards = props.pullRequests.map( pr => {
    console.log(pr)
    return (<PullRequestCard key={pr.title} pullRequest={pr}/>);
  });
  return (
  <div>
    <Subheader> {props.repoName} </Subheader>
    {pullRequestCards}
  </div>
)
};

export default RepoPullRequestList;
