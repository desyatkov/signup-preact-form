import React, { useState, useEffect } from 'react';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';
import pick from 'lodash/pick';
import values from 'lodash/values';
import axios from 'axios';

const enhancer = withFormik({
    validationSchema: Yup.object().shape({
        name: Yup.string()
            .min(2, 'Your name is longer than that')
            .required('Name can\'t be blank'),
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
        const { email, name, password, privacy, offers} = values;

        const payload = {
            userData: {
                email,
                password,
                name
            },
            profileFields: [
                {
                    key: "privacy-accept",
                    value: privacy
                },
                {
                    key: "subscription-accept",
                    value: offers
                }
            ]
        };

        setStatus({ loading: true });


        axios.post('/api/v1/auth/login', {
                email: "lklz1ws6@notua.com",
                password: "1234256Password!!"
            })
            .then(function (response) {
                setStatus({ loading: false, server: {error: false, message: response.data.message} });
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

const DisplayState = props => {
    return (<div style={{margin: '1rem 0'}}>
        <h3 style={{fontFamily: 'monospace'}} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
            <strong>props</strong> = {JSON.stringify(props, null, 2)}
        </pre>
    </div>)
};

const Label = ({error, className, children, ...props}) => {
    return (
        <label className="label" {...props}>
            {children}
        </label>
    );
};

function Checkbox({id, label, error, value, onChange, className, ...props}) {
    const classes = classnames(
        'input-group',
        {
            'error': !!error,
        },
        className
    );

    return (
        <div className={classes}>
            <label>
                <input
                    id={id}
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    {...props} />
                <span className="label">{label}</span>
            </label>
        </div>
    );
}

const TextInput = ({type, id, label, error, value, onChange, className, ...props}) => {
    const classes = classnames(
        'input-group',
        {
            'error': !!error,
        },
        className
    );
    return (
        <div className={classes}>
            <Label htmlFor={id} error={error}>
                {label}
            </Label>
            <input
                id={id}
                className="text-input"
                type={type}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
};

const GenerateError = ({touched, errors, serverErr}) => {
    const touchedTrue = Object.keys(touched);
    const errorList = values(pick(errors, touchedTrue));

    if (serverErr && serverErr.server && serverErr.server.error) {
        errorList.push(serverErr.server.message);
    }
    console.log(errorList)
    return <div>
        {errorList.map((err)=>(<div>{err}</div>))}
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
        handleReset,
        isSubmitting,
        submitting,
        status,
        reset,
    } = props;

    const [stat, setStat] = useState({ loading: false, server: {error: false, message: ''}});

    useEffect(() => {
        setStat(status);
    }, [status]);

    return (
        <form onSubmit={handleSubmit}>
            {stat && stat.loading ? <div>Hello World</div> : null}
            <TextInput
                id="name"
                type="text"
                label="Name"
                placeholder=""
                error={touched.name && errors.name}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="password"
                type="password"
                label="password"
                placeholder=""
                error={touched.password && errors.password}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <TextInput
                id="confirmpassword"
                type="password"
                label="confirm password"
                placeholder=""
                error={touched.confirmpassword && errors.confirmpassword}
                value={values.confirmpassword}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                error={touched.email && errors.email}
                value={values.email}
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
                label="I am over 18 and have accepted the Terms and Privacy Policy"
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


            <div>{
                <GenerateError touched={touched} errors={errors} serverErr={stat}/>
            }</div>

            <button type="submit" disabled={!(dirty && !Object.keys(pick(errors, ["email", "name", "password", "confirmpassword"])).length) || isSubmitting}>
                SIGN UP
            </button>
            <DisplayState {...props} />
        </form>
    );
};

const MyEnhancedForm = enhancer(MyForm);

const SigninForm = () => (
    <div className="app">
        <p>
            This example does just that. It demonstrates a custom text input, label, and form
            feedback components as well as a cool shake animation that's triggered if a field is
            invalid.
        </p>

        <MyEnhancedForm
            user={
                {
                    email: '',
                    name: '',
                    password: '',
                    confirmpassword: '',
                    privacy: false,
                    offers: false
                }
            }
        />
    </div>
);


export default SigninForm;
