import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom"
import { setSignupData } from "../../../Slice/authSlice";
import { signup } from "../../../Services/Operations/authAPI";


const SignupForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const {firstName, lastName, email, password, confirmPassword} = formData;

    const changeHandler = (e) =>{
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value,
        }))
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if(password!==confirmPassword){
            toast.error("Password mistmatch!");
            return;
        }
        const signupData = {
            ...formData
        }
        dispatch(setSignupData(signupData));
        //console.log(signupData);
        dispatch(signup(formData, navigate))
        //send otp for email verification

        setFormData({
            firstName:"",
            lastName:"",
            email:"",
            password:"",
            confirmPassword:""
        })
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>
                        <p>First Name<sup>*</sup></p>
                        <input
                            required
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={changeHandler}
                            placeholder="Enter Your First Name"
                        />
                    </label>
                    <label>
                        <p>Last Name<sup>*</sup></p>
                        <input
                            required
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={changeHandler}
                            placeholder="Enter Your Last Name"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <p>Email<sup>*</sup></p>
                        <input
                            required
                            type="text"
                            name="email"
                            value={email}
                            onChange={changeHandler}
                            placeholder="Enter You Email Id (Username)"
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
                            placeholder="Enter Password"
                        />
                    </label>
                    <label>
                        <p>Confirm Password<sup>*</sup></p>
                        <input
                            required
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={changeHandler}
                            placeholder="Confirm Password"
                        />
                    </label>
                </div>
                <button type="submit">
                    Create Account
                </button>
            </form>
        </div>
    )
};

export default SignupForm;