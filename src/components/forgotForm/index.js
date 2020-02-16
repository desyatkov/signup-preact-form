import React, { useState, useEffect, Fragment } from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';
import axios from 'axios';
import style from '../style/style.scss'
import { Loader, TextInput, GenerateError } from '../common';

const API_LOGIN_FORGOT = 'api/v1/auth/reset-password';
const API_LOGIN_CONFIRM = 'api/v1/auth/reset-confirm';

const enhancer = withFormik({
    validationSchema: Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required!'),
        newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password can\'t be blank'),
        confirmationCode: Yup.string()
            .min(5, 'Code must be at least 6 characters')
            .required('Confirmation code can\'t be blank'),
    }),

    mapPropsToValues: ({user}) => ({
        ...user,
    }),

    handleSubmit: (values, {setSubmitting, setStatus, setValues, setFieldValue}) => {
        const { email, confirmationCode, newPassword} = values;

        setStatus({ loading: true });

        if(values && values.nextStep) {
            axios.post(API_LOGIN_CONFIRM, {email, confirmationCode, newPassword})
                .then((response) => {
                    setValues({...values, nextStep: "done",});
                    const resp = response.data;
                    setStatus({ nextStep: false, loading: false, server: {error: false, message: resp.message} });
                })
                .catch(function (error, data) {
                    setStatus({ nextStep: false, loading: false, server: {error: true, message: error.response.data.message} });
                }).finally(()=>{
                setSubmitting(false);
            })
        } else {
            axios.post(API_LOGIN_FORGOT, {email})
                .then((response) => {
                    const resp = response.data;
                    setValues({...values, nextStep: true,});
                    setFieldValue('newPassword', '', false);
                    setFieldValue('confirmationCode', '', false);
                    setStatus({ nextStep: false, loading: false, server: {error: false, message: resp.message} });

                })
                .catch(function (error, data) {
                    setStatus({ nextStep: false, loading: false, server: {error: true, message: error.response.data.message} });
                }).finally(()=>{
                setSubmitting(false);
            })
        }
    },

    displayName: 'forgot',
});

const Forgot = props => {
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
                disabled={values && values.nextStep}
            />

            { values && values.nextStep ? <Fragment>
                <div style={{marginBottom: 9}}>Check your email</div>
                <TextInput
                    id="confirmationCode"
                    type="text"
                    label="Confirmation Code"
                    placeholder=""
                    error={touched.confirmationCode && errors.confirmationCode}
                    value={values.confirmationCode}
                    touched={touched.confirmationCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />

                <TextInput
                    id="newPassword"
                    type="password"
                    label="New Password"
                    placeholder=""
                    error={touched.newPassword && errors.newPassword}
                    value={values.newPassword}
                    touched={touched.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </Fragment> : null}

            <GenerateError touched={touched} errors={errors} serverErr={stat} />
            {values && values.nextStep === 'done' ? <div>Your password has been changed successfully!</div> : null}
            {values && values.nextStep === 'done' ? null : <div className={style.submitWrap}>
                <button className={style.submitButton} type="submit" disabled={!(dirty && !Object.keys(pick(errors, ["email"])).length) || isSubmitting}>
                    {values && values.nextStep ? "Done" : "Reset" }
                </button>
            </div>}
        </form>
    );
};

const MyEnhancedForgot = enhancer(Forgot);

const ForgotForm = ({redirect, clickHandler}) => (
    <div className={style.app}>
        <p className={style.title}>
            Enter your email to reset your password
        </p>

        <MyEnhancedForgot
            user={
                {
                    email: '',
                    redirect: redirect,
                    confirmationCode: 'XXXXXXXX',
                    newPassword: 'XXXXXXXX',
                    nextStep: false,
                }
            }
        />

        <div className={style.changeView} onClick={clickHandler}>Sign in</div>
    </div>
);


export default ForgotForm;
