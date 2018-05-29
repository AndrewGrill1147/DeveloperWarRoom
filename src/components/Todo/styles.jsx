const styles = {
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
    height: '100%',
    maxHeight: '100%',
    overflow: 'auto',
  },
  groupTextField: {
    width: '100%',
    textAlign: 'center',
  },
  newTodoTextField: {
    top: '0px',
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '60%',
  },
  selectGroup: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '40%',
  },
  newTodoHint: {
    width: '98%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};

export default styles;
