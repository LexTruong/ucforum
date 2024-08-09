import "../css/signinPage.css"

export default function SignInPage() {
    return (
        <div className="signincontainer">
            <form className="signinform">
                <input type="email" name="email"
                    placeholder="Email Address"  required className="enterform"></input>
                <input type="password" name="password"
                    placeholder="Password" required className="enterform"></input>
                <input type="submit" value="Sign In" className="signinbtn"></input>
            </form>
            <a href="google.com"><p className="forgot"> Forget Password?</p></a>
            <hr></hr>
            <button type="button" className="createAccountbtn">Create Account</button>
        </div>
    )
}