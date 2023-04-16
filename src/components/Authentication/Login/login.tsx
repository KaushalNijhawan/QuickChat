import { useNavigate } from "react-router-dom";

export const Login = () => {
	const navigate = useNavigate();
	const handleLoginClick = () =>{
		navigate("/chat");
	}

	const handleSignInClick = () =>{
		navigate("/signUp");
	}

    return (
        <div className="container">
		<div className="row justify-content-center">
			<div className="col-lg-5 col-md-8 col-sm-10">
				<div className="card mt-5">
					<div className="card-body">
						<h3 className="text-center mb-4">Login</h3>
						<form>
							<div className="mb-3">
								<label htmlFor="username" className="form-label">Username</label>
								<input type="text" className="form-control" id="username" name="username" required />
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">Password</label>
								<input type="password" className="form-control" id="password" name="password" required />
							</div>
							<button type="submit" className="btn btn-primary w-100" onClick={handleLoginClick}>Login</button>
                            <button type="submit" className="btn btn-dark w-100" style={{marginTop:"1%"}} onClick={handleSignInClick}>Register</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
    );
}