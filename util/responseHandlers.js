
export const sendMissingDependency = (res, dependency) =>{
    const message = !dependency? 'missing dependency': dependency + " is required";
    return res.status(400).json({message})
}

export const sendResourceNotFound = (res, resource) =>{
    const message = `${!resource? "": resource} not found`
    return res.status(404).json({message})
}

export const sendServerFailed = (req, action) =>{
    const message = `server failed ${!action?"":"to "+action}`
}