import { Link } from "react-router-dom"
import "../css/signinPage.css"

export default function SignInPage() {
    return (
        <div className="signincontainer">
            <form className="signinform">
                <input className="input enterform" type="email" name="email"
                    placeholder="Email Address"  required></input>
                <input className="input enterform" type="password" name="password"
                    placeholder="Password" required></input>
                <input className="signinbtn" type="submit" value="Sign In" ></input>
            </form>
            <a href="google.com"><p className="forgot">Forget Password?</p></a>
            <hr></hr>
            <Link to="/signup">
                <button type="button" className="createAccountbtn">Create Account</button>
            </Link>
        </div>
    )
}