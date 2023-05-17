
export const sendMissingDependency = (res, dependency) =>{
    const message = !dependency? 'missing dependency': dependency + " is required";
    return res.status(400).json({message})
}

export const sendResourceNotFound = (res, resource) =>{
    const message = `${!resource? "": resource} not found`
    return res.status(404).json({message})
}

export const sendServerFailed = (res, action) =>{
    const message = `server failed ${!action?"":"to "+action}`
    return res.status(500).json({message})
}

export const sendInvalidEntry = (res, field) =>{
    const message = `invalid ${!field?"entry": field}`
    return res.status(400).json({message})
}