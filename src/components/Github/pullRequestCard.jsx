import React from 'react';
import { Card, CardHeader, CardActions, CardText, RaisedButton, Divider } from 'material-ui';
import { GithubLogo } from './icons';
import showdown from 'showdown';

const converter = new showdown.Converter();


const multiLineStyle = {
  whiteSpace: 'pre-line',
};

const handleMarkdownString = (translateToHTML, markdownString) => {
  if(!translateToHTML){
    return (
      markdownString
    );
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(markdownString) }} />
  );
}

const PullRequestCard = props => (
  <Card>
    <CardHeader
      // props.pullRequest.statuses
      avatar={props.pullRequest.user.avatar_url}
      title={props.pullRequest.title}
      subtitle={`@${props.pullRequest.user.login}\n${new Date(props.pullRequest.created_at).toDateString()}\n`}
      subtitleStyle={multiLineStyle}
      actAsExpander
      showExpandableButton
    />
    <CardActions />
    <CardText expandable>
      {/* text must be from Github to ensure html string validation */}
      {/*<div dangerouslySetInnerHTML={{ __html: converter.makeHtml(props.pullRequest.body) }} />*/}
      {handleMarkdownString(props.translateMarkDownToHTML, props.pullRequest.body)}
      <Divider />
      <p><b>Status: </b>
        {props.pullRequest.state}
      </p>
      <p><b>Assignee: </b>
        {props.pullRequest.assignee ? props.pullRequest.assignee.login : 'No assignee'}
      </p>
      <p><b>Reviewers: </b>
        {props.pullRequest.assignee ? props.pullRequest.assignee.login : 'No assignee'}
      </p>
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
