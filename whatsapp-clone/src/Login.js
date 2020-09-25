import { auth, provider } from './firebase';
import React from 'react';
import "./Login.css";
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';

function Login() {
    // eslint-disable-next-line no-empty-pattern
    const [{}, dispatch] = useStateValue();

    const signIn = () => {
        auth.signInWithPopup(provider)
        .then((result) => {
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user,
            });
        })
        .catch((error) => alert(error.message));
    };

    return (
        <div className="login">
            <div className="login__container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/225px-WhatsApp.svg.png" alt="whatsapp" />
                <div className="login__text">
                    <h3>Sign In to WhatsApp</h3>
                </div>
                <div className="social-divider"></div>
                <div className="google-btn" onClick={signIn}>
                    <div className="google-icon-wrapper">
                        <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt=""/>
                    </div>
                    <p className="btn-text">Sign in with Google</p>
                </div>
            </div>
        </div>
    );
}

export default Login
