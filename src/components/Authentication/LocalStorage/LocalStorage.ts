export const setItemsToLocalStorage = (token : string, username: string  , email : string) =>{
    const user  = {
        token : token,
        username : username,
        email : email
    }
    localStorage.setItem('user' , JSON.stringify(user));
}