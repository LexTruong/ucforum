import "../css/signupPage.css"

export default function SignUpPage() {
    return (
        <div className="signupcontainer">
            <form className="signupform">
                <div className="fullname">
                    <input className="input" type="text" name="fname" placeholder="First Name" required/>
                    <input className="input" type="text" name="lname" placeholder="Last Name" required/>
                </div>
                <div className="dropdowns">
                    <select action="#" name="school" required>
                        <option value="berkeley">Berkeley</option>
                        <option value="davis">Davis</option>
                        <option value="irvine">Irvine</option>
                        <option value="merced">Merced</option>
                        <option value="losangeles">Los Angeles</option>
                        <option value="sandiego">San Diego</option>
                        <option value="santabarbara">Santa Barbara</option>
                        <option value="santacruz">Santa Cruz</option>
                        <option value="riverside">Riverside</option>
                    </select>
                    <select name="position" required>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                        <option value="supersenior">Super Senior</option>
                        <option value="graduate">Graduate</option>
                        <option value="faculty">Faculty</option>
                    </select>
                </div>
                <input className="input" type="email" name="email" placeholder="Email" required />
                <input className="input" type="password" name="password" placeholder="Password" required />
                <input className="input create" type="submit" value="Create Account" />
            </form>
        </div>
    )
}