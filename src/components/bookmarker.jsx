
/* eslint-env browser */
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import { FlatButton } from 'material-ui';

const iconButtonElement = (
  <IconButton
    touch
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon />
  </IconButton>
);

const styles = {
  horizontalListElement: {
    display: 'inline',
    width: 'auto',
    whiteSpace: 'nowrap',
  },
  buttonAlignment: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  iconAlignment: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'noWrap',
    overflowX: 'scroll',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

class Bookmarkers extends Component {
  constructor(props) {
    super(props);
    let localBookmarks = [];
    if (localStorage.getItem('bookmarks') !== null) {
      localBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    this.state = {
      bookmarks: localBookmarks,
    };
    this.clicked = this.clicked.bind(this);
    this.listMapping = this.listMapping.bind(this);
  }
  rightIconMenu(listValue) {
    return (
      <IconMenu iconButtonElement={iconButtonElement} style={styles.buttonAlignment}>
        <MenuItem >Rename</MenuItem>
        <MenuItem >Url Change</MenuItem>
        <MenuItem onClick={evt => this.deleteItem(evt, listValue)}>Delete</MenuItem>
      </IconMenu>
    );
  }
  listMapping(listValue) {
    return (
      <div style={styles.horizontalListElement}>
        <FlatButton
          style={styles.buttonAlignment}
          label={listValue.name}
          href={listValue.url}
          target="_blank"
        />
        <div style={styles.iconAlignment}>
          {this.rightIconMenu(listValue)}
        </div>
      </div>
    );
  }
  deleteItem(evt, listValue) {
    const newBookmarks = this.state.bookmarks.filter(bookmark => bookmark.id !== listValue.id);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    this.setState({ bookmarks: newBookmarks });
  }
  clicked(event) {
    event.preventDefault();
    // Get form values
    const siteName = document.getElementById('siteName').value;
    let siteUrl = document.getElementById('siteUrl').value;
    if (!siteName || !siteUrl) {
      return;
    }

    const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    const checkHttp = '^https?://';
    const httpRegex = new RegExp(checkHttp);

    if (!siteUrl.match(regex)) {
      alert('Please use a valid URL');
      return;
    }
    if (!httpRegex.test(siteUrl)) {
      console.log('adding https://');
      siteUrl = `https://${siteUrl}`;
    }
    let bookmarkId = 0;
    if (this.state.bookmarks.length > 0) {
      const lastBookmark = this.state.bookmarks[this.state.bookmarks.length - 1];
      bookmarkId = lastBookmark.id + 1;
    }
    const bookmark = {
      name: siteName,
      url: siteUrl,
      id: bookmarkId,
    };
    const newBookmarks = this.state.bookmarks;
    console.log(newBookmarks);
    newBookmarks.push(bookmark);
    this.setState({ bookmarks: newBookmarks });
    console.log(this.state.bookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
  }
  render() {
    return (
      <div className="nav">
        <form id="myForm">
          <div style={styles.gridList}>
            {this.state.bookmarks.map(this.listMapping)}
          </div>
          <div className="favorites-bar" />
          <TextField type="text" className="form-control" id="siteName" placeholder="  Website Name" />
          <TextField type="text" className="form-control" id="siteUrl" placeholder="  Website URL" />
          <button onClick={this.clicked}>Save Bookmark</button>
        </form>
        <div className="resul">
          <div id="bookmarksresults" />
        </div>
      </div>
    );
  }
}

export default Bookmarkers;

