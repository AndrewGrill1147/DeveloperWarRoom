import React, { Component } from 'react';
import { Card, CardHeader, CardActions, CardText, CardTitle } from 'material-ui';

// style={{height: '50px'}}

const PullRequestCard = props => (
  <Card>
    <CardHeader
      avatar={props.pullRequest.author.avatar}
      title={props.pullRequest.title}
      subtitle={props.pullRequest.author.name}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardActions />
    <CardText expandable>
      Status: Good <br />
      Assigned: Person 1, Person 2, Person 3 <br />
      Reviews: {props.pullRequest.reviews.toString()} <br />
      Body: {props.pullRequest.body}
    </CardText>

  </Card>
);


export default PullRequestCard;
