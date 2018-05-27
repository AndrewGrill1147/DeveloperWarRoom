import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { IconButton, FlatButton, Divider, SelectField, MenuItem } from 'material-ui';
import LocalStorageAPI from './../../helpers/localstorageAPI';
import styles from './styles';
/* global chrome */
/* global navigator */

const Snoowrap = require('snoowrap');

const countItems = [];
for (let i = 50; i <= 400; i += 50) {
  countItems.push(<MenuItem value={i} key={i} primaryText={`${i} Posts`} />);
}

function mediaToDisplay(post) {
  const expression = '^https?://.*(.jpg)$';
  const regex = new RegExp(expression);
  if (post.media != null) {
    if (post.is_reddit_media_domain) {
      return (
        <iframe
          src={post.media.reddit_video.fallback_url}
          title={post.title}
          style={styles.img}
        />
      );
    }
    return (
      <div
        dangerouslySetInnerHTML={{ __html: post.media_embed.content }}
        style={styles.img}
      />
    );
  }
  if (post.url.match(regex)) {
    return <img src={post.url} alt={post.url} style={styles.img} />;
  }
  return null;
}

class Reddit extends Component {
  constructor(props) {
    super(props);
    this.baseUrl = 'https://www.reddit.com';
    this.state = {
      accessToken: null,
      hotList: [],
      storageKey: this.constructor.name,
      countValue: 50,
    };

    this.login = this.login.bind(this);
    this.getRedditHot = this.getRedditHot.bind(this);
    this.handleChange = this.handleChange.bind(this);

    const localStorageState = LocalStorageAPI.get(this.state.storageKey);
    if (localStorageState != null) {
      this.state = localStorageState;
      this.getRedditHot();
    }
  }
  componentDidUpdate() {
    LocalStorageAPI.put(this.state.storageKey, this.state);
  }

  getRedditHot(limitCount) {
    const hotLimit = limitCount || this.state.countValue;
    const token = this.state.accessToken;
    if (!token) {
      return;
    }
    const r = new Snoowrap({
      userAgent: navigator.userAgent,
      accessToken: token,
    });
    r.getHot({ limit: hotLimit }).then(posts => this.setState({ hotList: posts }));
  }
  redditList(post) {
    const expression = '^https?://.*(.jpg)$';
    const regex = new RegExp(expression);


    const thumbnail = !post.thumbnail.match(regex) ? 'chrome://favicon/https://reddit.com' : post.thumbnail;
    return (
      <div>
        <Divider />
        <ListItem
          leftIcon={<img src={thumbnail} alt={post.subreddit_id} style={styles.leftIcon} />}
          primaryText={<a href={`${this.baseUrl}${post.permalink}`} target="_blank" style={styles.primaryText} visited={styles.visited}>{post.title}</a>}
          secondaryText={<div style={styles.secondaryText} >by {post.author.name} to <a href={`https://reddit.com/${post.subreddit_name_prefixed}`} target="_blank" style={{ color: '#000000' }}>{post.subreddit_name_prefixed}</a> upvotes: {post.ups}</div>}
          style={styles.listItemStyle}
          rightIcon={
            post.url.match(regex) ||
            post.media != null ||
            post.is_reddit_media_domain ? null : <div />
          }
          nestedItems={[mediaToDisplay(post)]}
        />
        <Divider />
      </div>
    );
  }
  login() {
    const redirectUrl = chrome.identity.getRedirectURL('reddit');
    const clientId = 'AxqQbiVl2sTS8Q';
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=token&state=random&scope=read&redirect_uri=${encodeURIComponent(redirectUrl)}`;
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      (responseUrl) => {
        const token = responseUrl.match(/#(?:access_token)=([\S\s]*?)&/)[1];
        this.setState({ accessToken: token });
        this.getRedditHot();
      },
    );
  }
  handleChange(event, index, value) {
    this.getRedditHot(value);
    this.setState({ countValue: value });
  }
  render() {
    return (
      <div style={styles.expand2}>
        <div style={styles.headerBar}>
          <FlatButton onClick={this.login} label="login" style={styles.loginButton} />
          <SelectField
            value={this.state.countValue}
            onChange={this.handleChange}
            style={styles.selectField}
          >
            {countItems}
          </SelectField>
          <IconButton style={styles.refreshIconButton}>
            <NavigationRefresh onClick={this.getRedditHot} color="gray" />
          </IconButton>
        </div>
        <div style={styles.expand}>
          <List>
            {this.state.hotList.map(item => this.redditList(item))}
          </List>
        </div>
      </div>
    );
  }
}

export default Reddit;
