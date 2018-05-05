
// note: does not filter sub objects currently
const PR_FILTER = {
    id: "",
    html_url: "",
    assignee: {
        login: "",
        id: ""
        // ...
    },
    user: {
        avatar_url: "",
        
    },
    body: "",
    title: "",
    number: "",
    state: "",
    comments_url: "",
    created_at: ""
}

const REPO_FILTER = {};


function applyFilter(data, filter) {
    let filteredData = {};
    
    Object.keys(filter).forEach(key => {
        if (key in data) {
            filteredData[key] = data[key];
        }
    });
    return filteredData;
}


function FilterPullRequestData(pullRequestData) {
    /* returns a filtered pullRequest object in O(|keys|) time */
    // TODO: filter sub-objects recursively
    return applyFilter(pullRequestData, PR_FILTER);
}

function FilterRepoData(repoData) {
    return {};
}


export { FilterPullRequestData, FilterRepoData };