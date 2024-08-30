import { useNavigate } from "react-router-dom"
import "../css/signupPage.css"
import { useEffect } from "react"
import validator from "validator"
 

export default function SignUpPage() {
    const navigate = useNavigate()

    const regex = /^[a-zA-Z]+$/;

    const validateEmail = (email) => {
        const atLocation = email.search("@")
        const afterAt = email.slice(atLocation+1)
        if(afterAt.includes("uci.edu") ||
            afterAt.includes("ucla.edu") ||
            afterAt.includes("berkeley.edu") ||
            afterAt.includes("ucr.edu") ||
            afterAt.includes("ucsc.edu") ||
            afterAt.includes("ucsd.edu") ||
            afterAt.includes("ucmerced.edu") ||
            afterAt.includes("ucsb.edu") ||
            afterAt.includes("ucdavis.edu")
        ) {
            return true
        } else {
            alert("Email must be from a University of California domain.")
            return false
        }
    }

    const validatePassword = (password) => {
        if (
            validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        ) {
            return true
        } else {
            alert("Passwords need to be 8 characters with at least 1 lower, 1 upper, 1 number, and 1 special character")
            return false
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault()

        const form = e.target
        if (validatePassword(form[5].value) && validateEmail(form[4].value)) 
            {
            const user = {
                first: form[0].value,
                last: form[1].value,
                school: form[2].value,
                position: form[3].value,
                email: form[4].value,
                password: form[5].value
            }
    
            if(!(regex.test(form[0].value)) || !((regex.test(form[1].value)))) {
                alert("First and Last Names May Only Contain Letters")
            }
            else if(!(form[5].value === form[6].value)) {
                alert("Passwords Must Match")
            }
            else {
                fetch("http://localhost:8080/register", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(user)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "Taken Email") {
                        alert("Email Taken Already")
                    } else {
                        navigate("/signin")
                        alert("Account Created")
                    }
                })
            }
        }
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
                        <option value="Berkeley">Berkeley</option>
                        <option value="Davis">Davis</option>
                        <option value="Irvine">Irvine</option>
                        <option value="Merced">Merced</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="San Diego">San Diego</option>
                        <option value="Santa Barbara">Santa Barbara</option>
                        <option value="Santa Cruz">Santa Cruz</option>
                        <option value="Riverside">Riverside</option>
                    </select>
                    <select name="position" required>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Super Senior">Super Senior</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Faculty">Faculty</option>
                    </select>
                </div>
                <input className="input" type="email" name="email" placeholder="Email" required />
                <input className="input" type="password" name="password" placeholder="Password" required />
                <input className="input" type="password" name="passwordCheck" placeholder="Confirm Password" required />
                <input className="input create" type="submit" value="Create Account" />
            </form>
        </div>
    )
}