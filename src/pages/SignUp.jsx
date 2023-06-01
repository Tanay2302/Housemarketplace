import React from "react";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { db } from '../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import Oauth from "../components/Oauth";

function SignUp() {
  const [showpass, setshowpass] = useState(false);
  const [formdata, setformdata] = useState({
    name:'',
    email: "",
    password: "",
  });
  const { name,email, password } = formdata;
  const navigate = useNavigate();
  const onChange = (e) => {
    setformdata({...formdata,[e.target.id]:e.target.value})
  }
  const onSubmit = async(e) => {
    e.preventDefault()
    try{
      const auth=getAuth()
      const userCredential=await createUserWithEmailAndPassword(auth,email,password)
      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name,
      })
      const formcopy={...formdata}
      delete formcopy.password
      formcopy.timestamp=serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formcopy)
      navigate('/')
    }
    catch(error){
      toast.error('bad')

    }
  
  }
  return (
    <div className="pageContainer" >
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>
      <form onSubmit={onSubmit}>
      <input
          type="text"
          className="nameInput"
          placeholder="Name"
          id="name"
          value={name}
          onChange={onChange}
        />
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
          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>
            <button className='signUpButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>

      </form>
      <Oauth/>
      <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
     
    
     
    </div>
  );
}

export default SignUp;
