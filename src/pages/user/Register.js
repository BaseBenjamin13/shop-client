import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../contexts/UserState';

function Register() {

    const { user, setUser } = useContext(UserContext);
    const initForm = {username: '', email: '', password: ''}
    const [registerForm, setRegisterForm] = useState(initForm)
    const [registerUser, setRegisterUser] = useState()

    const handleFormChange = (e) => {
        setRegisterForm({ ...registerForm, [e.target.id]: e.target.value})
        console.log(registerForm)
    }
    const submitRegisterForm = async (e) => {
        e.preventDefault()
        console.log(registerForm)
        setRegisterUser(registerForm)
    }

    if(registerUser) {
        axios.post('http://127.0.0.1:8000/api/auth/register', 
            {
                "username": registerUser.username,
                "email": registerUser.email,
                "password": registerUser.password
            }, 
            {
                headers: {'Content-Type': 'application/json'},
            })
            .then((res) => {
                console.log(res)
                setUser({
                    username: res.data.user.username,
                    email: res.data.user.email,
                    knoxToken: res.data.token
                })
                localStorage.setItem('username', res.data.user.username)
                localStorage.setItem('email', res.data.user.email)
                localStorage.setItem('knox_token', res.data.token)
            })
            .then(() => {
                axios.post('http://127.0.0.1:8000/user/carts', 
                {
                    "total": 0,
                    "order_completed": false,
                    "items": []
                },
                {
                    headers: {
                        'Authorization': `Token ${user.knoxToken}`
                    }
                })
                .then((res) => {
                    console.log(res)
                    // window.location.reload()
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

  return (
    <div className="register border-blue">
        <h1 className="register-title">Register</h1>
        <br></br>
            <div>
                <form className="register-form" onSubmit={submitRegisterForm}>
                    <div className="register-inner-form">

                    <label>Username:</label>
                    <input type="text" id="username" value={registerForm.username} onChange={handleFormChange}></input>
                    <br></br>
                    <label>Email:</label>
                    <input type="email" id="email" value={registerForm.email} onChange={handleFormChange}></input>
                    <br></br>
                    <label>Password:</label>
                    <input type="password" id="password" value={registerForm.password} onChange={handleFormChange}></input>
                    <br></br>
                    <button className="register-btn" type="submit">Register</button>
                    </div>
                </form>
                <Link className="link" to="/login">
                    <button className="login-link">Login</button>
                </Link>
            </div>   

    </div>
  )
}

export default Register