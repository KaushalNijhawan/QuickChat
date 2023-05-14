import { useNavigate } from "react-router-dom";
import {useReducer , useState} from "react";
import axios from "axios";
import { setCurrentUser } from "../../Redux/UserRedux";
import { store } from "../../Redux/store";
import { useDispatch } from "react-redux";
import { Constants } from "../../../Constants/Constants";
import FullPageLoader from "../../Loading-Spinner/Loader";
import { setItemsToLocalStorage } from "../LocalStorage/LocalStorage";
interface User{
	username : string;
	password: string;
	email: string;
}
export const Login = () => {
	const navigate = useNavigate();
	const dispatching = useDispatch();
	const [isLoading , setLoading] = useState(false);
	const reducer = (state = {username : "" , password : "" , email: ""}, action : any ): User =>{
		
		switch(action.type){
			case "username":
				state.username = action.username;
				return state;
			case "password":
				state.password = action.password;
				return state;
			default:
				return state;
		}
	}

	const [state , dispatch] = useReducer(reducer, {username : "" , password : "", email : ""});
	

	const handleLoginClick = async (event: any) =>{
		event.preventDefault();
		if(state.username && state.password){
			try{
				setLoading(true);
				const response = await axios.post(`http://${Constants.CHAT_AUTH_IP}:3000/auth/login` , state ,  {
				headers:{
					Accept: "application/json",
					"Content-Type":"application/json"
				}
				});
				if(response && response.data ){
					let responseData  = response.data;
					setItemsToLocalStorage(response.data.token,response.data.username ,response.data.email);
					dispatching(setCurrentUser(responseData));
					navigate("/chat");
				}
			}catch(err){
				console.log(err);
			}
			setLoading(false);
		}
		
	}

	const handleSignInClick = () =>{
		navigate("/signUp");
	}

	const handleChange = (event: any , type : string)=>{
		if(event && type){
			if(type == "username"){
				dispatch({type: type , username : event.target.value});
			}else{
				dispatch({type: type , password : event.target.value});
			}
			
		}
	}

    return (
        <div className="container">
		<div className="row justify-content-center">
			<FullPageLoader show = {isLoading}/>
			<div className="col-lg-5 col-md-8 col-sm-10">
				<div className="card mt-5">
					<div className="card-body">
						<h3 className="text-center mb-4">Login</h3>
						<form>
							<div className="mb-3">
								<label htmlFor="username" className="form-label">Username</label>
								<input type="text" className="form-control" id="username" name="username" required onChange={(e)=> handleChange(e, "username")}/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">Password</label>
								<input type="password" className="form-control" id="password" name="password" required onChange={(e)=> handleChange(e, "password")}/>
							</div>
							<button type="submit" className="btn btn-primary w-100" onClick={(e) => handleLoginClick(e)} >Login</button>
                            <button type="submit" className="btn btn-dark w-100" style={{marginTop:"1%"}} onClick={handleSignInClick}>Register</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
    );
}