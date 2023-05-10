
export default (fn) =>{
    return (req, res, next) =>{
        try{
            fn(req, res, next)
        }catch(ex){
            next(ex)
        }
    }
}