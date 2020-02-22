import React, { useState, useEffect, Fragment } from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';
import axios from 'axios';
import { Loader, TextInput, GenerateError, Checkbox } from '../common'
import style from '../style/style.scss'

const API_LOGIN = '/api/v1/auth/login';
const VERIFIED_SIGN_UP = '/api/v1/auth/verified-sign-up';

const enhancer = withFormik({
    validationSchema: Yup.object().shape({
        name: Yup.string()
            .min(2, 'Your name is longer than that')
            .max(30, 'Your name is longer than 20 characters')
            .required('Display name can\'t be blank'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password can\'t be blank'),
        confirmpassword: Yup.string()
            .required('Confirm password can\'t be blank')
            .when("password", {
                is: val => (!!(val && val.length > 0)),
                then: Yup.string().oneOf(
                    [Yup.ref("password")],
                    "Incompatible password"
                )
        }),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required!'),
        privacy: Yup.bool()
            .oneOf([true], 'You must accept our terms'),
        offers: Yup.bool()
    }),

    mapPropsToValues: ({user}) => ({
        ...user,
    }),

    handleSubmit: (values, {setSubmitting, setStatus, setFieldValue}) => {
        const { email, name, password, privacy, offers, redirect} = values;

        const payload = {
            userData: {
                email,
                password,
                name
            },
            profileFields: [
                {
                    key: "privacy_terms_approved",
                    value: privacy
                },
                {
                    key: "newsletter_approved",
                    value: offers
                }
            ]
        };

        setStatus({ loading: true });

        axios.post(VERIFIED_SIGN_UP, payload)
            .then(function (response) {
                return axios.post(API_LOGIN, {email, password})
            })
            .then((response) => {
                const resp = response.data;
                setStatus({ loading: false, server: {error: false, message: resp.message} });

                if(redirect) {
                    window.location.href = redirect;
                    return true
                }
                window.location.reload();
            })
            .catch(function (error, data) {
                setStatus({ loading: false, server: {error: true, message: error.response.data.message} });
                setFieldValue('password', '', false);
                setFieldValue('confirmpassword', '', false);
            }).finally(()=>{
                setSubmitting(false);
            })
        },

    displayName: 'signup',
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
    } = props;

    const [stat, setStat] = useState({ loading: false, server: {error: false, message: ''}});

    useEffect(() => {
        setStat(status);
    }, [status]);

    return (
        <form onSubmit={handleSubmit}>
            <Loader status={stat}/>
            <TextInput
                id="name"
                type="text"
                label="Display name"
                placeholder=""
                error={touched.name && errors.name}
                value={values.name}
                touched={touched.name}
                onChange={handleChange}
                onBlur={handleBlur}
            />

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

            <TextInput
                id="confirmpassword"
                type="password"
                label="Confirm password"
                placeholder=""
                error={touched.confirmpassword && errors.confirmpassword}
                value={values.confirmpassword}
                touched={touched.confirmpassword}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <Checkbox
                name="privacy"
                type="checkbox"
                checked={values.privacy}
                error={touched.privacy && errors.privacy}
                value={values.privacy}
                onChange={handleChange}
                onBlur={handleBlur}
                label={(()=>(<Fragment>I am over 18 and have accepted the <a href="/terms-of-use" target="_blank">Terms</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a></Fragment>))()}
            />

            <Checkbox
                name="offers"
                type="checkbox"
                checked={values.offers}
                error={touched.offers && errors.offers}
                value={values.offers}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Send me tips & exclusive offers"
            />


            <GenerateError touched={touched} errors={errors} serverErr={stat} />

            <div className={style.submitWrap}>
                <button className={style.submitButton} type="submit" disabled={!(dirty && !Object.keys(pick(errors, ["email", "name", "password", "confirmpassword"])).length) || isSubmitting}>
                    LET'S GO
                </button>
            </div>
        </form>
    );
};

const MyEnhancedForm = enhancer(MyForm);

const SignupForm = ({clickHandler, redirect = ''}) => (
    <div className={style.app}>
        <p className={style.title}>
            Just one thing left to do – leave your details to unlock exclusive offers, and stay up to date on new ones
        </p>

        <MyEnhancedForm
            user={
                {
                    email: '',
                    name: '',
                    password: '',
                    confirmpassword: '',
                    privacy: false,
                    offers: false,
                    redirect: redirect
                }
            }
        />

        <div className={style.changeView} onClick={clickHandler}>Already a user? sign in</div>
    </div>
);


export default SignupForm;
