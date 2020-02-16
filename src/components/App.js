import React from 'react';
import {useEffect, useState} from 'preact/hooks';
import SigninForm from './signinForm'
import SignupForm from './signupForm'
import ForgotForm from './forgotForm'
import style from './style/style.scss';

const CloseBtn = ({clickHandler}) => (
    <div onClick={clickHandler} className={style.closeBtnWrap}>
        <div className={style.closeBtn} />
    </div>
);

const App = (props) => {
    const [displayView, setDisplayView] = useState({
        initView: false,
        signUpView: true,
        signInView: false,
        forgotView: false,
    });
    const element = document.getElementById('click-me');

    const initViewHandler = () => {
        setDisplayView(previewView => ({ ...displayView, initView: !previewView.initView,  signUpView: true, signInView: false, forgotView: false }))
    };

    const changeViewSignUp = () => {
        setDisplayView({ ...displayView, signUpView: true, signInView: false, forgotView: false })
    };

    const changeViewSignIn = () => {
        setDisplayView({ ...displayView, signUpView: false, signInView: true, forgotView: false })
    };

    const changeViewForgot = () => {
        setDisplayView({ ...displayView, signUpView: false, signInView: false, forgotView: true })
    };

    const toggleData = () => {
        element.addEventListener("mousedown", initViewHandler);
        return () => {
            element.removeEventListener("mousedown", initViewHandler);
        };
    };

    useEffect(() => {
        toggleData();
    }, []);

    return displayView.initView ? (
        <div className={style.authGroup}>
            <CloseBtn clickHandler={initViewHandler} />
            {displayView.signUpView ? <SignupForm redirect={props.urlRedirect} clickHandler={changeViewSignIn}/> : null}
            {displayView.signInView ? <SigninForm redirect={props.urlRedirect} clickHandler={changeViewSignUp} forgotHandler={changeViewForgot}/> : null}
            {displayView.forgotView ? <ForgotForm clickHandler={changeViewSignIn}/> : null}
        </div>
    ) : null;
};

export default App
