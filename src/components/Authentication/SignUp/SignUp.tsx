import axios from "axios";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";

interface User { 
	username : string;
	password: string;
	confirmPassword: string;
	email : string;
}
export const Signup = () =>{
	const navigate = useNavigate();

	const reducer = (state = {username : "" , password : "" , email : "" , confirmPassword : ""}, action : any ): User=>{
		
		switch(action.type){
			case "username":
				state.username = action.username;
				return state;
			case "password":
				state.password = action.password;
				return state;
			case "confirmPassword":
				state.confirmPassword = action.confirmPassword;
				return state;
			case "email":
				state.email = action.email;
				return state;
			default:
				return state;
		}
	}

	const handleChange = (event: any , type : string)=>{
		if(event && type){
			if(type == "username"){
				dispatch({type: type , username : event.target.value});
			}else if(type == "password"){
				dispatch({type: type , password : event.target.value});
			}else if(type == "email"){
				dispatch({type: type , email : event.target.value});
			}else{
				dispatch({type: type , confirmPassword : event.target.value});
			}
			
		}
	}

	const [state , dispatch] = useReducer(reducer, {username : "" , password : "", email : "" , confirmPassword : ""});
	
	const handleLoginClick = () =>{
		navigate("/");
	}

	const handleSignInClick = async (event : any) =>{
		event?.preventDefault();
		if(state && state.email && state.password && state.username && state.confirmPassword){
			let signUpRequest = { 
				username : state.username,
				password : state.password,
				email : state.email
			}
			const response = await axios.post("http://quick-chat-auth-service:3000/auth/signUp" , signUpRequest , {
				headers:{
					Accept : "application/json"
				}
			});
			console.log(response);
			navigate("/");
		}
	}


    return (
        <div className="container">
		<div className="row justify-content-center">
			<div className="col-lg-5 col-md-8 col-sm-10">
				<div className="card mt-5">
					<div className="card-body">
						<h3 className="text-center mb-4">Signup</h3>
						<form>
							<div className="mb-3">
								<label htmlFor="name" className="form-label">Name</label>
								<input type="text" className="form-control" id="name" name="name" required onChange={(e) =>  handleChange(e, "username")}/>
							</div>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">Email</label>
								<input type="email" className="form-control" id="email" name="email" required onChange={(e) =>  handleChange(e, "email")}/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">Password</label>
								<input type="password" className="form-control" id="password" name="password" required onChange={(e) =>  handleChange(e, "password")} />
							</div>
							<div className="mb-3">
								<label htmlFor="confirm_password" className="form-label">Confirm Password</label>
								<input type="password" className="form-control" id="confirm_password" name="confirm_password" required onChange={(e) =>  handleChange(e, "confirmPassword")}/>
							</div>
							<button type="submit" className="btn btn-dark w-100" onClick = {(e) => handleSignInClick(e)}>Signup</button>
                            <button type="submit" className="btn btn-primary w-100" style={{marginTop:"1%"}} onClick = {handleLoginClick}>Login</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
    );
}