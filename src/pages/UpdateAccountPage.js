import { useNavigate } from "react-router-dom"
import "../css/signupPage.css"
import { useEffect } from "react"
import validator from "validator"
import { useState } from "react"
import "../css/updateAccountPage.css"

export default function UpdateAccountPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState()
    const [first, setFirst] = useState()
    const [last, setLast] = useState()
    const [school, setSchool] = useState()
    const [position, setPosition] = useState()

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
    
    const updateAccount = (e) => {
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

            fetch("http://localhost:8080/updateAccount", {
                method: "PUT",
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "Content-type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Email Taken") {
                    alert("Email Taken Already")
                    navigate(0)
                } else {
                    localStorage.setItem("token", data.token)
                    navigate("/account")
                    navigate(0)
                }
            })
        }
    }

    // get previous account info to fill in inputs
    useEffect(() => {
        fetch("http://localhost:8080/account", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
        })
        .then(res => res.json())
        .then(userDoc => {
            setEmail(userDoc.email)
            setPosition(userDoc.position)
            setSchool(userDoc.school)

            const first = userDoc.first.charAt(0).toUpperCase() + userDoc.first.slice(1)
            const last = userDoc.last.charAt(0).toUpperCase() + userDoc.last.slice(1)
            setFirst(first)
            setLast(last)
        })
    }, [])
    
    return (
        <div className="signupcontainer">
            <h1 className="updateAccountTitle">Update Account Information</h1>
            <form className="signupform" onSubmit={e => updateAccount(e)}>
                <div className="fullname">
                    <input className="input" type="text" name="fname" value={first} required onChange={e => setFirst(e.target.value)}/>
                    <input className="input" type="text" name="lname" value={last} required onChange={e => setLast(e.target.value)}/>
                </div>
                <div className="dropdowns">
                    <select action="#" name="school" value={school} required onChange={e => setSchool(e.target.value)}>
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
                    <select name="position" value={position} required onChange={e => setPosition(e.target.value)}>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Super Senior">Super Senior</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Faculty">Faculty</option>
                    </select>
                </div>
                <input className="input" type="email" name="email" value={email} required onChange={e => setEmail(e.target.value)} />
                <input className="input" type="password" name="password" placeholder="Old or New Password" required />
                <input className="input create" type="submit" value="Update Account" />
            </form>
        </div>
    )
}