
export const setRelease = releaseName => {
    return {
        type: "SET_RELEASE",
        payload: releaseName
    }
}

export const setDistro = distroName => {
    return {
        type: "SET_DISTRO",
        payload: distroName
    }
}


export default {setRelease, setDistro}