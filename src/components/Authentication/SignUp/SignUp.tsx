import axios from "axios";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Constants } from "../../../Constants/Constants";
import validator from "validator";
import "./SignUp.css";
import { useForm } from "react-hook-form";

interface User {
	username: string;
	password: string;
	confirmPassword: string;
	email: string;
}
export const Signup = () => {
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);

	const {register , handleSubmit , formState : {errors}, getValues, setValue, setError, clearErrors} = useForm({
		defaultValues:{
			username : "",
			password: "",
			confirmPassword : "",
			email : ""
		}
	});
	const reducer = (state = { username: "", password: "", email: "", confirmPassword: "" }, action: any): User => {

		switch (action.type) {
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

	const handleChange = (event: any, type: string , errorMessage?: string) => {
		if(type) {
			if (type == "username") {
				dispatch({ type: type, username: event.target.value });
			} else if (type == "password") {
				dispatch({ type: type, password: event.target.value });
			} else if (type == "email") {
				dispatch({ type: type, email: event.target.value });
			} else if(type == "confirmPassword"){
				dispatch({ type: type, confirmPassword: event.target.value});
			}
		}
	}

	

	const [state, dispatch] = useReducer(reducer, { username: "", password: "", email: "", confirmPassword: ""});

	const handleLoginClick = () => {
		navigate("/");
	}

	const handleSignInClick = async (data: User) => {
		let user: User = data;
		if (user && user.email && user.password && user.username && user.confirmPassword) {
			setLoading(true);
			let signUpRequest = {
				username: user.username,
				password: user.password,
				email: user.email
			}
			try {
				const response = await axios.post(`http://${Constants.CHAT_AUTH_IP}:3000/auth/signUp`, signUpRequest, {
					headers: {
						Accept: "application/json"
					}
				});
				console.log(response);
				navigate("/");
			}catch(err){
				console.log(err);
			}

			setLoading(false);
		}
	}


	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-lg-5 col-md-8 col-sm-10">
					<div className="card mt-5">
						<div className="card-body">
							<h3 className="text-center mb-4">Signup</h3>
							<form onSubmit={handleSubmit(handleSignInClick)}>
								<div className="mb-3">
									<label htmlFor="name" className="form-label">Name</label>
									<input type="text" className="form-control" id="name" required {...register('username' , {required : "Username is Required" , minLength:{
										message:"Username should be ateast 8 length", value : 8}
									}) } />
									<p className="error">{errors.username?.message}</p>
								</div>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Email</label>
									<input type="text" className="form-control" id="email" {...register('email' ,{required :"Email is Required" , onChange(event) {
										let email = event.target.value;

										if(!validator.isEmail(email)){
											setError("email" ,{message :"Invalid Email"})
										}else{
											clearErrors("email");
										}
									},})} />
									<p className="error">{errors.email?.message}</p>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">Password</label>
									<input type="password" className="form-control" id="password" {...register('password', {minLength :{value : 8 , message : "Password should be atleast 8 character length!" } , required :"Password is Required!"})}/>
									<p className="error">{errors.password?.message}</p>
								</div>
								<div className="mb-3">
									<label htmlFor="confirm_password" className="form-label">Confirm Password</label>
									<input type="password" className="form-control" id="confirm_password" {...register('confirmPassword' ,{required : "Required Field!" , onChange (event) {
										let confirmPassword : string = event.target.value;
										let password : string  = getValues('password');
										if(password != confirmPassword){
											setError("confirmPassword",{message : "Password and confirm password doesn't match!"}) ;
										}else{
											clearErrors("confirmPassword");
										}
									},})} />
									<p className="error">{errors.confirmPassword?.message}</p>
									
								</div>
								<button type="submit" className="btn btn-dark w-100" >Signup</button>
								<button className="btn btn-primary w-100" style={{ marginTop: "1%" }} onClick={handleLoginClick}>Login</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}