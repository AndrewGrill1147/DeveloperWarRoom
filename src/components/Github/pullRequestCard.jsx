import React, { Component } from 'react';
import { Card, CardHeader, CardActions, CardText, CardTitle } from 'material-ui';

// style={{height: '50px'}}

const PullRequestCard = props => (
  <Card>
    <CardHeader
      avatar="../../assets/icon-128.png"
      title="Pull request title"
      subtitle="Username"
      actAsExpander
      showExpandableButton
    />
    <CardActions />
    <CardText expandable>
      Status: GOOD <br />
      Assigned: Person 1, Person 2, Person 3 <br />
      Reviews: 1, 2, 3 <br />
      onsadoinsionoin asdnaoisn
    </CardText>

  </Card>
);


export default PullRequestCard;
