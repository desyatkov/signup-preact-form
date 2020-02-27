import style from '../style/style.scss';
import classnames from 'classnames';
import values from 'lodash/values';
import pick from 'lodash/pick';

const Loader = ({status}) => {
    return status && status.loading ? <div className={style.ldsRing}>
        <div />
        <div />
        <div />
        <div />
    </div> : null
};

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

    if (serverErr && serverErr.server && serverErr.server.message) {
        errorList.push(serverErr.server.message);
    }

    return <div className={style.errorsBox}>
        {errorList.length > 0 ? errorList.map((err)=>(<div className={style.errorsBoxItem}>*{err.replace('username', 'email')}</div>)) : null}
    </div>
};

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

export {
    Loader,
    TextInput,
    GenerateError,
    Checkbox,
    Label
}
