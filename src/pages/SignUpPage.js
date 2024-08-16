import { useNavigate } from "react-router-dom"
import "../css/signupPage.css"
import { useEffect } from "react"

export default function SignUpPage() {
    const navigate = useNavigate()

    async function handleRegister(e) {
        e.preventDefault()

        const form = e.target
        const user = {
            email: form[4].value,
            password: form[5].value
        }

        fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            navigate("/")
            console.log(data)
        })
    }

    useEffect(() => {
        fetch("http://localhost:8080/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? navigate("/") : null)
    }, [navigate])    

    return (
        <div className="signupcontainer">
            <form className="signupform" onSubmit={e => handleRegister(e)}>
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