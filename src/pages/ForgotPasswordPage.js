import "../css/forgotPassword.css"

export default function ForgotPassword() {
    return (
        <div>
            <form>
                <input className="emailInput" type="email" name="email" placeholder="Email Address" required />
                <input className="sendEmail" type="submit" value="Send Reset Request" ></input>
            </form>
        </div>
    )
}