import React from 'react';
import "./style/style.scss";
import {useEffect, useState} from 'preact/hooks';
import SignUp from './signup'
import SigninForm from './signin'

const App = () => {
    const [display, setDisplay] = useState(true);
    const element = document.getElementById('click-me');
    const toggleData = () => {
        const toggle = () => setDisplay(display => !display);
        element.addEventListener("mousedown", toggle);
        return () => {
            element.removeEventListener("mousedown", toggle);
        };
    };

    useEffect(() => {
        toggleData();
    }, []);

    return display ? (
        <div>
            <SignUp />
            <SigninForm />
        </div>
    ) : null;
};


export default App
