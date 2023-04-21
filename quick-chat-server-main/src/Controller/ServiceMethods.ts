import axios from "axios";
export const verifyToken = async (token: string, username: string, email: string) => {
    try {
        let response = await axios.post("http://localhost:3000/auth/verifyToken", {
            token: token,
            username: username,
            email: email
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
}