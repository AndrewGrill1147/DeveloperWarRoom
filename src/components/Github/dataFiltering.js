
/*
  How to construct a filter,
  const NAME_FILTER = {
  }

  if a key maps to a sub object, {}, then the subobject will
  be filtered according to the keys it holds. If you would rather not
  filter recursively, or for any key with a non-{} value, the entire value
  will be assigned in the filter object.

  e.g

  given,
  data = {
    key: {
      one: 1,
      two: 2,
      three: 3
    }
  }

  a filter of,
  {
    key: ''
  }

  will return a clone of data

  and,
  {
    key: {
      one: ''
    }
  }

  will return
  {
    key: {
      one: 1
    }
  }
*/

const PR_FILTER = {
  id: '',
  html_url: '',
  assignee: {
    login: '',
    id: '',
    // ...
  },
  user: {
    avatar_url: '',
    login: '',
    fakeKey: '',
  },
  body: '',
  title: '',
  number: '',
  state: '',
  comments_url: '',
  created_at: '',
};

const REPO_FILTER = {
  id: '',
  name: '',
  owner: {
    name: '',
    login: '',
  },
  created_at: '',
};

function basicApplyFilter(data, filter) {
  const filteredData = {};

  Object.keys(filter).forEach((key) => {
    if (key in data) {
      filteredData[key] = data[key];
    }
  });
  return filteredData;
}

function isObject(object) {
  return object !== null && typeof (object) === 'object' && !Array.isArray(object);
}

function applyFilter(data, filter) {
  const filteredData = {};

  for (const key in filter) {
    if (!(key in data)) {
      continue;
    }

    // if a key is a sub object {}, then continue filtering recursively
    filteredData[key] = isObject(data[key]) ? applyFilter(data[key], filter[key]) : data[key];
  }
  return filteredData;
}

function FilterPullRequestData(pullRequestData) {
  /* returns a filtered pullRequest object in O(|keys|) time */
  // TODO: filter sub-objects recursively
  return applyFilter(pullRequestData, PR_FILTER);
}

function FilterRepoData(repoData) {
  return applyFilter(repoData, REPO_FILTER);
}

export { FilterPullRequestData, FilterRepoData };
