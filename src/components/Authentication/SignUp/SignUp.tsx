import { useNavigate } from "react-router-dom";

export const Signup = () =>{
	const navigate = useNavigate();

	const handleLoginClick = () =>{
		navigate("/");
	}

	const handleSignInClick = () =>{
	
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
								<input type="text" className="form-control" id="name" name="name" required />
							</div>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">Email</label>
								<input type="email" className="form-control" id="email" name="email" required />
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">Password</label>
								<input type="password" className="form-control" id="password" name="password" required />
							</div>
							<div className="mb-3">
								<label htmlFor="confirm_password" className="form-label">Confirm Password</label>
								<input type="password" className="form-control" id="confirm_password" name="confirm_password" required />
							</div>
							<button type="submit" className="btn btn-dark w-100" onClick = {handleSignInClick}>Signup</button>
                            <button type="submit" className="btn btn-primary w-100" style={{marginTop:"1%"}} onClick = {handleLoginClick}>Login</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
    );
}