import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import LocalStorageAPI from './../../helpers/localstorageAPI';
/* global chrome */
/* global navigator */

const Snoowrap = require('snoowrap');

const styles = {
  primaryText: {
    display: 'block',
    marginLeft: '50px',
    color: '#00bcd4',
  },
  loginButton: {
    marginTop: '5px',
  },
  headerBar: {
    height: '40px',
  },
  refreshIconButton: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    color: 'gray',
  },
  refreshIcon: {
    color: 'gray',
    height: '30px',
    width: '30px',
  },
  secondaryText: {
    display: 'block',
    marginLeft: '50px',
  },
  img: {
    maxWidth: '100%',
  },
  leftIcon: {
    height: 'auto',
    maxHeight: '80px',
    maxWidth: '100px',
    width: 'auto',
    margin: 'auto',
    padding: 'auto',
  },
  tabHeadline: {
    fontSize: 12,
    paddingTop: 2,
    marginBottom: 2,
    fontWeight: 200,
  },
  listStyle: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  divStyle: {
    display: 'flex',
    flexDirection: 'column',
    background: '#75a3a3',
    width: '100%',
    height: '100%',
  },
  expand: {
    width: '100%',
    height: 'calc(100% - 40px)',
    maxHeight: 'calc(100% - 40px)',
    overflow: 'auto',
  },
  expand2: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
  },
  listItemStyle: {
    minHeight: '100px',
    maxHeight: 'auto',
  },
};

class Reddit extends Component {
  constructor(props) {
    super(props);
    this.baseUrl = 'https://www.reddit.com';
    this.state = { accessToken: null, hotList: [], storageKey: this.constructor.name };
    this.state.accessToken = LocalStorageAPI.get(this.state.storageKey);
    this.login = this.login.bind(this);
    this.redditHot = this.redditHot.bind(this);
  }
  login() {
    const redirectUrl = chrome.identity.getRedirectURL('reddit');
    const clientId = 'AxqQbiVl2sTS8Q';
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=token&state=random&scope=read&redirect_uri=${encodeURIComponent(redirectUrl)}`;
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      (responseUrl) => {
        const token = responseUrl.match(/#(?:access_token)=([\S\s]*?)&/)[1];
        console.log(token);
        LocalStorageAPI.put(this.state.storageKey, token);
        this.setState({ accessToken: token });
      },
    );
  }
  mediaToDisplay(post) {
    const token = this.state.accessToken;
    const expression = '^https?://.*(.jpg)$';
    const regex = new RegExp(expression);
    if (post.media != null) {
      if (post.is_reddit_media_domain) {
        console.log('returned reddit media');
        return <iframe src={post.media.reddit_video.fallback_url} title={post.title} style={styles.img} />;
      }
      return <div dangerouslySetInnerHTML={{ __html: post.media_embed.content }} style={styles.img} />;
    }
    if (post.url.match(regex)) {
      return <img src={post.url} alt={post.url} style={styles.img} />;
    }
    return null;
  }
  redditList(post) {
    console.log(post);
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
          rightIcon={post.url.match(regex) || post.media != null || post.is_reddit_media_domain ? null : <div />}
          nestedItems={[this.mediaToDisplay(post)]}
        />
        <Divider />
      </div>
    );
  }

  redditHot() {
    const token = this.state.accessToken;
    const r = new Snoowrap({
      userAgent: navigator.userAgent,
      accessToken: token,
    });
    console.log('getting list');
    r.getHot({ limit: 100 }).then(posts => this.setState({ hotList: posts }));
    console.log(this.state.hotList);
  }
  render() {
    return (
      <div style={styles.expand2}>
        <div style={styles.headerBar}>
          <FlatButton onClick={this.login} label="login" style={styles.loginButton} />
          <IconButton style={styles.refreshIconButton}>
            <NavigationRefresh onClick={this.redditHot} color="gray" />
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
