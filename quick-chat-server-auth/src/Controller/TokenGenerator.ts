import { User } from "../Datastore/UserModel/UserModel";
import { sign, verify, decode, JwtPayload } from "jsonwebtoken";
export const tokenGenerator = (user: User): string => {
    if (user && user.username && user.password) {
        const payload = {
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),

        }
        let token = sign(payload, user.username + "," + user.email);

        return token;
    }

    return "";
}

export const tokenVerify = (token: string, username: string, email: string): Boolean => {
    if (token && username && email) {
        try {
            const secretKey = username + "," + email;
            let response = verify(token, secretKey);
            return true;
        } catch (err) {
            console.log(err);
        }
    }
    return false;
}

export const checkTokenExpiry = () => {

}