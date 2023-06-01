import React from "react";
import { useState } from "react";


import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import Oauth from "../components/Oauth";

function SignIn() {
  const [showpass, setshowpass] = useState(false);
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formdata;
  const navigate = useNavigate();
  const onChange = (e) => {
    setformdata((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value

    }))
  }
  const onSubmit=async(e)=>{
    e.preventDefault()

    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      if (userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      toast.error('Bad User Credentials')
    }

  }
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          className="emailInput"
          placeholder="Email"
          id="email"
          value={email}
          onChange={onChange}
        />
        <div className="passwordInputDiv">
          <input
            type={showpass ? "text" : "password"}
            className="passwordInput"
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
          />
             <img
              src={visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setshowpass((prevState) => !prevState)}
            />
           

        </div>
        <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link>
          <div className='signInBar'>
            <p className='signInText'>Sign In</p>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>

      </form>
      <Link to='/sign-up' className='registerLink'>
          Sign Up Instead
        </Link>
    <Oauth/>
     
    </div>
  );
}

export default SignIn;
