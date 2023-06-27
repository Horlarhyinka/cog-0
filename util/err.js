
export const exToMssg = (ex) =>Object.keys(ex.errors).map(key =>ex.errors[key]?.properties?.message)

export const handleMongooseErrors = (ex) =>{
    let errors = []
    if(ex._message?.toLowerCase().includes("validation failed")){
        errors = exToMssg(ex)
        }
        return {message: errors.join("\n").replace(/path/ig, "")}
}