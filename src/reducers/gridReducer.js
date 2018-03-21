export default function (state = [], action) {
    switch(action.type) {
        case 'TEST':
            console.log('In reducer - test action');
            return [...state,
                Object.assign({}, action.param)
            ];
        default:
            return state
    }
}