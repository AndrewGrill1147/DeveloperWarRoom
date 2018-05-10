// note: does not filter sub objects currently
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
	id: "",
	name: "",
	owner: {
	}

};

function applyFilter(data, filter) {
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

function recApplyFilter(data, filter) {
  const filteredData = {};

  for (const key in filter) {
    if (!(key in data)) {
      continue;
    }

    filteredData[key] = isObject(data[key]) ? recApplyFilter(data[key], filter[key]) : data[key];
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
