import React, { Component } from 'react';
import { Card, CardHeader, CardActions, CardText, CardTitle, Subheader } from 'material-ui';

// style={{height: '50px'}}

const childrenStyle = {
  display: 'inline-block',
  verticalAlign: 'top',
  whiteSpace: 'normal',
  paddingRight: '90px'
}

const multiLineStyle = {
  whiteSpace: 'pre-line',
}

const PullRequestCard = props => (
  <Card>
    <CardHeader
      avatar={props.pullRequest.author.avatar}
      title={props.pullRequest.title}
      subtitle={`${Date()}\n${props.pullRequest.author.name}`}
      subtitleStyle={multiLineStyle}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardActions />
    <CardText expandable={true}>
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
