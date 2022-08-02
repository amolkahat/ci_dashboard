const initialState = {release: 'master', distro: 'centos9'}

const release = (state = initialState, action) => {
    switch (action.type){
        case "SET_RELEASE":
            console.log("SET RELEASE Called")
            console.log(state, action)
            if (action.payload !== 'undefined'){
                return {
                    ...state,
                    release: action.payload
                };
            }else{
                return state
            }

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
