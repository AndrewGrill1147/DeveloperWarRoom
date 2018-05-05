import React from 'react';
import { Card, CardHeader, CardActions, CardText, RaisedButton } from 'material-ui';
import { GithubLogo } from './icons';

const multiLineStyle = {
  whiteSpace: 'pre-line',
};

const PullRequestCard = props => (
  <Card>
    <CardHeader
    // props.pullRequest.statuses
      avatar={props.pullRequest.user.avatar_url}
      title={props.pullRequest.title}
      subtitle={`${props.pullRequest.created_at}\n${props.pullRequest.user.login}`}
      subtitleStyle={multiLineStyle}
      actAsExpander
      showExpandableButton
    />
    <CardActions />
    <CardText expandable>
      <h4> Status </h4> Good
      <h4> Reviews </h4>
      <h4> Assigned </h4>
      <h4> Reviews </h4>
      {'Need to add reviews'} <br />
      <h4> Descriptions </h4>
      {props.pullRequest.body}
      <br />
      <RaisedButton
        fullWidth
        secondary
        href={props.pullRequest.html_url}
        target="_blank"
        label="view pull request"
        labelPosition="before"
        icon={<GithubLogo />}
      />
    </CardText>
  </Card>
);


export default PullRequestCard;
