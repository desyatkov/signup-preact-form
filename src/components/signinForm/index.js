import React, { useState, useEffect } from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';
import axios from 'axios';
import style from '../style/style.scss'
import { Loader, TextInput, GenerateError } from '../common';

const API_LOGIN = '/api/v1/auth/login';

const enhancer = withFormik({
    validationSchema: Yup.object().shape({
        password: Yup.string()
            .required('Password can\'t be blank'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required!')
    }),

    mapPropsToValues: ({user}) => ({
        ...user,
    }),

    handleSubmit: (values, {setSubmitting, setStatus, setFieldValue}) => {
        const { email, password, redirect} = values;

        setStatus({ loading: true });

        axios.post(API_LOGIN, {email, password})
            .then((response) => {
                const resp = response.data;
                setStatus({ loading: false, server: {error: false, message: resp.message} });
                if(redirect) {
                    window.location.href = "redirect";
                }
                window.location.reload();
            })
            .catch(function (error, data) {
                setStatus({ loading: false, server: {error: true, message: error.response.data.message} });
                setFieldValue('password', '', false);
            }).finally(()=>{
                setSubmitting(false);
            })
        },

    displayName: 'signin',
});

const MyForm = props => {
    const {
        values,
        touched,
        errors,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        status,
        forgotHandlerClick,
    } = props;

    const [stat, setStat] = useState({ loading: false, server: {error: false, message: ''}});

    useEffect(() => {
        setStat(status);
    }, [status]);

    return (
        <form onSubmit={handleSubmit}>
            <Loader status={stat}/>

            <TextInput
                id="email"
                type="email"
                label="Email"
                placeholder=""
                error={touched.email && errors.email}
                value={values.email}
                touched={touched.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <TextInput
                id="password"
                type="password"
                label="Password"
                placeholder=""
                error={touched.password && errors.password}
                value={values.password}
                touched={touched.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <div className={style.changeView} onClick={forgotHandlerClick}>Forgot password?</div>

            <GenerateError touched={touched} errors={errors} serverErr={stat} />

            <div className={style.submitWrap}>
                <button className={style.submitButton} type="submit" disabled={!(dirty && !Object.keys(pick(errors, ["email", "name", "password", "confirmpassword"])).length) || isSubmitting}>
                    SIGN IN
                </button>
            </div>
        </form>
    );
};

const MyEnhancedForm = enhancer(MyForm);

const SigninForm = ({redirect, clickHandler, forgotHandler}) => (
    <div className={style.app}>
        <p className={style.title}>
            Sign in to get your new exclusive offers
        </p>
        <MyEnhancedForm
            forgotHandlerClick={forgotHandler}
            user={
                {
                    email: '',
                    password: '',
                    redirect: '',
                }
            }
        />

        <div className={style.changeView} onClick={clickHandler}>New user? sign up</div>
    </div>
);


export default SigninForm;
