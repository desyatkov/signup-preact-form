import React, { useState, useEffect } from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';
import pick from 'lodash/pick';
import values from 'lodash/values';
import axios from 'axios';
import style from '../style/style.scss'

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

const Label = ({error, className, children, ...props}) => {
    return (
        <label className={className} {...props}>
            {children}
        </label>
    );
};

function Checkbox({id, label, error, value, onChange, className, ...props}) {
    const classes = classnames(
        style.inputGroupCheckBox,
        {
            [style.error]: !!error
        },
        className
    );

    return (
        <div className={classes}>
            <Label error={error} className={style.checkboxLabel}>
                <input
                    id={id}
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    {...props} />
                <span className={style.checkboxCustom} />
                <div className={style.checkboxLblText}>{label}</div>
            </Label>
        </div>
    );
}

const TextInput = ({type, id, label, error, touched, value, onChange, className, ...props}) => {
    const classes = classnames(
        style.inputGroup,
        {
            [style.error]: !!error,
            [style.touched]: touched
        },
        className
    );
    return (
        <div className={classes} >
            <input
                autocomplete="off"
                id={id}
                className={style.textInput}
                type={type}
                value={value}
                onChange={onChange}
                {...props}
            />
            <div className={style.fieldLabel}>
                {label}
            </div>
        </div>
    );
};

const GenerateError = ({touched, errors, serverErr}) => {
    const touchedTrue = Object.keys(touched);
    const errorList = values(pick(errors, touchedTrue));

    if (serverErr && serverErr.server && serverErr.server.error) {
        errorList.push(serverErr.server.message);
    }

    return <div className={style.errorsBox}>
        {errorList.map((err)=>(<div className={style.errorsBoxItem}>*{err}</div>))}
    </div>
};

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
            {stat && stat.loading ? <div>Hello World</div> : null}

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
                    SIGN UP
                </button>
            </div>
        </form>
    );
};

const MyEnhancedForm = enhancer(MyForm);

const SigninForm = ({redirect, clickHandler, forgotHandler}) => (
    <div className={style.app}>
        <p className={style.title}>
            Kaaching! We want to give you 500 free spins - where should we send it?
        </p>
        <MyEnhancedForm
            forgotHandlerClick={forgotHandler}
            user={
                {
                    email: '',
                    password: '',
                    redirect: redirect,
                }
            }
        />

        <div className={style.changeView} onClick={clickHandler}>New user? sign up</div>
    </div>
);


export default SigninForm;
