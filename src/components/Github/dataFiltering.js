
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

function FilterPullRequestData(pullRequest) {
    /* returns a filtered pullRequest object in O(|keys|) time */
    // TODO: filter sub-objects recursively
    let filteredRequest = {};

    Object.keys(PR_FILTER).forEach(key => {
        if (key in pullRequest) {
            filteredRequest[key] = pullRequest[key];
        }
    });
    return filteredRequest;
}



export { FilterPullRequestData };