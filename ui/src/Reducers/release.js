const initialState = {release: 'master', distro: 'centos9'}

const release = (state = initialState, action) => {
    switch (action.type){
        case "SET_RELEASE":
            console.log("SET RELEASE Called")
            console.log(state, action)
            return {
                ...state,
                release: action.payload 
            };
        case "SET_DISTRO":
            return {
                ...state,
                distro: action.payload
            };

        default:
            return state
    }
}

export default release