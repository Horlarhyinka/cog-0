export const paginate = (item, page, size) =>item.slice(page * size, size + 1)

export const trimUser = (user) =>{
    if(!user)return user;
    user.password = undefined;
    user.resetToken = undefined;
    user.tokenExpiresIn = undefined;
    return user;
}