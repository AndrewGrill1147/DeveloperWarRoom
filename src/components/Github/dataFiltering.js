const PR_FILTER = {
    id: "",
    url: "",

    assignee: {
        login: "",
        id: ""
        // ...
    },
    user: {},
    body: "",
    title: "",
    number: "",
    state: "",
    comments_url: ""
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