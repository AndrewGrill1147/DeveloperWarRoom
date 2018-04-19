
/* eslint-env browser */
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import { GridList, GridTile } from 'material-ui/GridList';
import {FlatButton} from 'material-ui';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'noWrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

const tilesData = [
  {
    title: 'Google',
  },
  {
    title: 'Youtube',
  },
];

class Bookmarkers extends Component {
/*
  deleteBookmark(url) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    for (let i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].url == url) {
        bookmarks.splice(i, 1);
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    const bookmarker = JSON.parse(localStorage.getItem('bookmarks'));
    const bookmarksResults = document.getElementById('bookmarksResults');
    bookmarksResults.innerHTML = '';
    for (let i = 0; i < bookmarker.length; i++) {
      const name = bookmarks[i].name;
      const url = bookmarks[i].url;
      bookmarksResults.innerHTML += (<div> +
        <h3>'+name+
          <a className="btn btn-default" target="_blank" href="'+url+'">Visit</a>  +
          <a onClick="deleteBookmark(\''+url+'\')" className="btn btn-danger" href="#">Delete</a> +
        </h3>+
      </div>);
    }
  }
  /* getBookmarks(){
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    const bookmarksResults = document.getElementById('bookmarksResults');
    bookmarksResults.innerHTML = '';
    for (let i = 0; i < bookmarks.length; i++) {
      const name = bookmarks[i].name;
      const url = bookmarks[i].url;
      bookmarksResults.innerHTML += (<div> +
        <h3>'+name+
          <a className="btn btn-default" target="_blank" href="'+url+'">Visit</a>  +
          <a onClick="deleteBookmark(\''+url+'\')" className="btn btn-danger" href="#">Delete</a> +
        </h3>+
      </div>);
    }
  } */
  constructor(props) {
    super(props);

    this.state = {
      bookmarks: [],

    };

    this.clicked = this.clicked.bind(this);
    this.state.bookmarks.map = this.state.bookmarks.map.bind(this);
  }

  clicked(event) {
    event.preventDefault();


    // Get form values
    const siteName = document.getElementById('siteName').value;
    const siteUrl = document.getElementById('siteUrl').value;

    if (!siteName || !siteUrl) {
      alert('Please fill in the form');
      return false;
    }

    const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (!siteUrl.match(regex)) {
      alert('Please use a valid URL');
      return false;
    }
    const bookmark = {
      name: siteName,
      url: siteUrl,
    };


    if (localStorage.getItem('bookmarks') === null) {
      const listArray = this.state.bookmarks;

      listArray.push(bookmark);

      this.setState({

        bookmarks: listArray,
      });

      localStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
    } else {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
      // Add bookmark to array
      if (bookmarks.length < 5) {
        const listArray = this.state.bookmarks;

        listArray.push(bookmark);

        this.setState({

          bookmarks: listArray,
        });
      } else {
        alert('Please only up to 5 bookmarks');
      }

      localStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
    }


    document.getElementById('myForm').reset();


    const listArray = JSON.parse(localStorage.getItem('bookmarks'));

    this.setState({

      bookmarks: listArray,
    });


    const bookmarksResults = document.getElementById('bookmarksresults');

    //  bookmarksResults.innerHTML = '';


    // for (let i = 0; i < this.state.bookmarks.length; i++) {
    // const name = this.state.bookmarks[i].name;
    // const url = this.state.bookmarks[i].url;

    // console.log(this.state.bookmarks[i].name);
    /*
      const output = this.state.bookmarks.map(function(name, url)
      {
        return (
          <div>
          <GridTile
          title={name}
          url={url}
          rows={0.25}
          cols={0.3}
        /> </div>)});
        */

    // document.getElementById("link").addEventListener("click", deleteBookmark(url));


    // event.preventDefault();
  }
  render() {
    return (
      <div className="nav">
        <form id="myForm">
          {this.state.bookmarks.map((listValue) => { 
            return (
              <FlatButton label= {listValue.name}
               href= {listvalue.url}
               />
           
            );
 })
          }
          <div className="favorites-bar" />
          <RaisedButton label="Site Name" />
          <TextField type="text" className="form-control" id="siteName" placeholder="  Website Name" />
          <RaisedButton label="Site URL" />
          <TextField type="text" className="form-control" id="siteUrl" placeholder="  Website URL" />
          <button onClick={this.clicked}>Save Bookmark</button>
        </form>
        <div className="resul">
          <div id="bookmarksresults" />
          )}


        </div>
      </div>
    );
  }
}

export default Bookmarkers;

