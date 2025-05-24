import { useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../Services/Operations/authAPI";


const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email:"", password:""
    });
    const {email, password} = formData;
    const changeHandler = (e) => {
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value,
        }))
    };
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(formData, navigate));
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>
                        <p>Email Id<sup>*</sup></p>
                        <input
                            required
                            type="text"
                            name="email"
                            value={email}
                            onChange={changeHandler}
                            placeholder="Enter you Email or Username"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <p>Password<sup>*</sup></p>
                        <input
                            required
                            type="password"
                            name="password"
                            value={password}
                            onChange={changeHandler}
                            placeholder="Enter Your Password"
                        />
                    </label>
                </div>
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginForm;