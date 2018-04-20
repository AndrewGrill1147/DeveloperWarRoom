import React from 'react';
import { Card, CardHeader, CardActions, CardText } from 'material-ui';

const multiLineStyle = {
  whiteSpace: 'pre-line',
};

const PullRequestCard = props => (
  <Card>
    <CardHeader
      avatar={props.pullRequest.author.avatar}
      title={props.pullRequest.title}
      subtitle={`${Date()}\n${props.pullRequest.author.name}`}
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
      {props.pullRequest.reviews.toString()} <br />
      <h4> Descriptions </h4>
      {props.pullRequest.body}
    </CardText>
  </Card>
);


export default PullRequestCard;
