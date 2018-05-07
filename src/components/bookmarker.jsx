import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { FlatButton } from 'material-ui';
import LocalStorageAPI from './../helpers/localstorageAPI';

const iconButtonElement = (
  <IconButton
    touch
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color="gray" />
  </IconButton>
);

const styles = {
  horizontalListElement: {
    display: 'inline',
    whiteSpace: 'nowrap',
  },
  dialogStyle: {
    maxWidth: '450px',
  },
  buttonAlignment: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  iconAlignment: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  iconButtonAlignment: {
    display: 'inline-block',
    verticalAlign: 'middle',
    whiteSpace: 'noWrap',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'noWrap',
    overflowX: 'auto',
  },
  divContainer: {
    display: 'flex',
    flexWrap: 'noWrap',
    paddingRight: '20px',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

class Bookmarkers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: [],
      nameInput: null,
      urlInput: null,
      dialogOpen: false,
      storageKey: this.constructor.name,
    };

    const localBookmarks = LocalStorageAPI.get(this.state.storageKey);
    this.state.bookmarks = localBookmarks || [];

    this.saveClicked = this.saveClicked.bind(this);
    this.listMapping = this.listMapping.bind(this);
    this.dialogEvent = this.dialogEvent.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.cancelDialogEvent = this.cancelDialogEvent.bind(this);
    this.saveDialogEvent = this.saveDialogEvent.bind(this);
  }

  dialogEvent(evt, listValue) {
    const objIndex = this.state.bookmarks.findIndex((obj => obj.id === listValue.id));
    const newBookmarks = this.state.bookmarks;
    newBookmarks[objIndex].dialogOpen = !(listValue.dialogOpen);
    this.setState({ bookmarks: newBookmarks });
  }
  cancelDialogEvent(evt, listValue) {
    const objIndex = this.state.bookmarks.findIndex((obj => obj.id === listValue.id));
    const newBookmarks = this.state.bookmarks;
    newBookmarks[objIndex].dialogOpen = false;
    newBookmarks[objIndex].nameInput = listValue.name;
    newBookmarks[objIndex].urlInput = listValue.url;
    this.setState({ bookmarks: newBookmarks });
  }
  saveDialogEvent(evt, listValue) {
    const objIndex = this.state.bookmarks.findIndex((obj => obj.id === listValue.id));
    const newBookmarks = this.state.bookmarks;
    newBookmarks[objIndex].dialogOpen = false;
    newBookmarks[objIndex].name = listValue.nameInput;
    const checkHttp = '^https?://';
    const httpRegex = new RegExp(checkHttp);
    let siteUrl = listValue.urlInput;
    if (!httpRegex.test(siteUrl)) {
      siteUrl = `https://${siteUrl}`;
    }
    newBookmarks[objIndex].url = siteUrl;
    this.setState({ bookmarks: newBookmarks });
  }
  rightIconMenu(listValue) {
    return (
      <IconMenu iconButtonElement={iconButtonElement} style={styles.buttonAlignment}>
        <MenuItem key='edit' onClick={evt => this.dialogEvent(evt, listValue)}>Edit</MenuItem>
        <MenuItem key='delete' onClick={evt => this.deleteItem(evt, listValue)}>Delete</MenuItem>
      </IconMenu>
    );
  }
  handleUrlChange(evt, listValue) {
    const objIndex = this.state.bookmarks.findIndex((obj => obj.id === listValue.id));
    const newBookmarks = this.state.bookmarks;
    newBookmarks[objIndex].urlInput = evt.target.value;
    this.setState({ bookmarks: newBookmarks });
  }
  handleNameChange(evt, listValue) {
    const objIndex = this.state.bookmarks.findIndex((obj => obj.id === listValue.id));
    const newBookmarks = this.state.bookmarks;
    newBookmarks[objIndex].nameInput = evt.target.value;
    this.setState({ bookmarks: newBookmarks });
  }
  listMapping(listValue) {
    const actions = [
      <FlatButton
        key="cancel-button"
        label="Cancel"
        primary
        onClick={evt => this.cancelDialogEvent(evt, listValue)}
      />,
      <FlatButton
        key="save-button"      
        label="Save"
        primary
        keyboardFocused
        onClick={evt => this.saveDialogEvent(evt, listValue)}
      />,
    ];
    return (
      // key should be a unique ID, not the name
      <div key={listValue.name} style={styles.horizontalListElement}>
        <FlatButton
          style={styles.buttonAlignment}
          label={listValue.name}
          href={listValue.url}
          target="_blank"
          icon={<img
            src={`chrome://favicon/${listValue.url}`}
            alt={listValue.name}
            style={styles.iconAlignment}
          />}
        />
        <div style={styles.iconAlignment}>
          {this.rightIconMenu(listValue)}
        </div>
        <Dialog
          open={listValue.dialogOpen}
          title="Edit"
          actions={actions}
          contentStyle={styles.dialogStyle}
        >
          <TextField
            defaultValue={listValue.name}
            floatingLabelText="name"
            onInput={evt => this.handleNameChange(evt, listValue)}
          /><br />
          <TextField
            defaultValue={listValue.url}
            floatingLabelText="link"
            onInput={evt => this.handleUrlChange(evt, listValue)}
          /><br />
        </Dialog>
      </div>
    );
  }
  deleteItem(evt, listValue) {
    const newBookmarks = this.state.bookmarks.filter(bookmark => bookmark.id !== listValue.id);
    LocalStorageAPI.put(this.state.storageKey, newBookmarks);
    this.setState({ bookmarks: newBookmarks });
  }
  saveClicked() {
    // Get form values
    const siteName = this.state.nameInput;
    let siteUrl = this.state.urlInput;

    if (!siteName || !siteUrl) {
      return;
    }

    const expression = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    const checkHttp = '^https?://';
    const httpRegex = new RegExp(checkHttp);

    if (!siteUrl.match(regex)) {
      this.setState({ dialogOpen: false, urlInput: null, nameInput: null });
      return;
    }
    if (!httpRegex.test(siteUrl)) {
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
      dialogOpen: false,
      urlInput: siteUrl,
      nameInput: siteName,
    };
    const newBookmarks = this.state.bookmarks;
    newBookmarks.push(bookmark);
    this.setState({
      bookmarks: newBookmarks,
      dialogOpen: false,
      nameInput: null,
      urlInput: null,
    });
    LocalStorageAPI.put(this.state.storageKey, this.state.bookmarks);
  }
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={() => this.setState({ dialogOpen: false, nameInput: null, urlInput: null })}
      />,
      <FlatButton
        label="Save"
        primary
        onClick={this.saveClicked}
      />,
    ];
    return (
      <div>
        <div style={styles.divContainer} >
          <div style={styles.gridList}>
            {this.state.bookmarks.map(this.listMapping)}
          </div>
          <IconButton
            style={styles.iconButtonAlignment}
            onClick={
              () => this.setState({ dialogOpen: true })
            }
          >
            <ContentAdd color="gray" />
          </IconButton>
        </div>
        <Dialog
          open={this.state.dialogOpen}
          title="Add Link"
          actions={actions}
          contentStyle={styles.dialogStyle}
        >
          <TextField
            defaultValue=""
            floatingLabelText="name"
            onInput={evt => this.setState({ nameInput: evt.target.value })}
          /><br />
          <TextField
            defaultValue=""
            floatingLabelText="link"
            onInput={evt => this.setState({ urlInput: evt.target.value })}
          /><br />
        </Dialog>
      </div>
    );
  }
}

export default Bookmarkers;

