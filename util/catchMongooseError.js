

export default (err)=>{
    if(err?._message?.toLowerCase().includes("validation failed")){
        const errors = Object.keys(err.errors).map(key =>err.errors[key]?.properties?.message)
        return {message: errors.join("\n").replace(/path/ig, "")}
    }
    return null;
}