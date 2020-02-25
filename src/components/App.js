import React, { Fragment } from 'react';
import classnames from 'classnames';
import axios from 'axios';

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
    const { urlRedirect = '' } = props;
    const [displayView, setDisplayView] = useState({
        initView: false,
        initQuizUp: true,
        signUpView: true,
        signInView: false,
        forgotView: false,
    });

    const element = document.querySelectorAll('[data-user-logged-in="true"]');
    const logout = document.querySelector('[data-user-logged-in="logout"]');

    const initViewHandler = () => {
        setDisplayView(previewView => ({ ...displayView, initView: !previewView.initView,  signUpView: true, signInView: false, forgotView: false }))
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://client.playgorithm.com/latest?renderMode=html&containerId=playgorithm-unit-1659&token=eyJzaXRlSWQiOjQ3NCwiZW1iZWRJZCI6MTY1OSwidG9rZW4iOiIkMnkkMTAkYXd2T3lwTHRXUlBuUHpvQWR0ZmpDdWhCWnY1N0FtQnl0bWx2Ym5VN3RydDdrZTliaUhTeksiLCJ0aW1lc3RhbXAiOjE1ODE5MzMxNDh9&lang=en&noPoweredBy=1';
        document.body.appendChild(scriptTag);
        window.addEventListener("playgorithm-game-ended",(e) => {
            setDisplayView(previewView => ({ ...displayView, initQuizUp: false, initView: true }))
        });
    };

    const initViewHandlerClose = () => {
        setDisplayView(previewView => ({ ...displayView, initView: !previewView.initView,  signUpView: true, signInView: false, forgotView: false }))
        document.body.classList.remove("lock-scroll");
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
        for (let i = 0; i < element.length; i++) {
            element[i].addEventListener('mousedown', initViewHandler, false);
        }
        return () => {
            for (let i = 0; i < element.length; i++) {
                element.removeEventListener("mousedown", initViewHandler);
            }
        };
    };

    const logoutHandler = ()=>{
        axios.post("api/v1/auth/logout").then(()=>{
            window.location.reload();
        });
    };

    const logoutEvent = () => {
        if(logout){
            logout.addEventListener('mousedown', logoutHandler, false);
            return () => {
                logout.addEventListener('mousedown', logoutHandler, false);
            };
        }
    };

    useEffect(() => {
        toggleData();
        logoutEvent();
    }, []);

    const classNameAuthGroup = classnames(
        style.authGroup,
        {
            [style.signUp]: displayView.signUpView,
            [style.signIn]: displayView.signInView,
            [style.forgot]: displayView.forgotView,
        }
    );

    return displayView.initView ? (
        <Fragment>
            <div className={style.backHolder}/>
            <div className={classNameAuthGroup}>
                <CloseBtn clickHandler={initViewHandlerClose} />
                {displayView.initQuizUp ? (
                    <div id='playgorithm-unit-1659' className={style.quizWrap}/>
                ) : (
                    <Fragment>
                        {displayView.signUpView ? <SignupForm redirect={urlRedirect} clickHandler={changeViewSignIn}/> : null}
                        {displayView.signInView ? <SigninForm redirect={urlRedirect} clickHandler={changeViewSignUp} forgotHandler={changeViewForgot}/> : null}
                        {displayView.forgotView ? <ForgotForm clickHandler={changeViewSignIn}/> : null}
                    </Fragment>
                )}
            </div>
        </Fragment>
    ) : null
};

export default App
