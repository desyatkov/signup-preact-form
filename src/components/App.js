import React from 'react';
import {useEffect, useState} from 'preact/hooks';
import SignUp from './signup'
import SignupForm from './signupForm'
import style from './style/style.scss';

const CloseBtn = ({clickHandler}) => (
    <div onClick={clickHandler} className={style.closeBtnWrap}>
        <div className={style.closeBtn} />
    </div>
);

const App = (props) => {
    const [display, setDisplay] = useState(true);
    const element = document.getElementById('click-me');
    const closeHandler = () => {
        setDisplay(display => !display)
    };

    const toggleData = () => {
        element.addEventListener("mousedown", closeHandler);
        return () => {
            element.removeEventListener("mousedown", closeHandler);
        };
    };

    useEffect(() => {
        toggleData();
    }, []);

    return display ? (
        <div className={style.authGroup}>
            <CloseBtn clickHandler={closeHandler} />
            <SignUp />
            <SignupForm redirect={props.urlRedirect}/>
        </div>
    ) : null;
};


export default App
