import {Component} from 'preact';
import {Form, validateField, Validators} from 'preact-forms-helper';

const FormValues = ({form}) => {
    let values = form.getValues();
    console.log(form.getValues());
    return values ? <pre>{JSON.stringify(values, null, 2)}</pre> : null;
};

export default class SignUpForm extends Component {
    // constructor(props) {
    //     super(props);
    //
    //     this.state = {
    //         form: new Form({
    //             name: {validators: [Validators.required()]},
    //             privacy: {value: false, validators: [Validators.required()]},
    //             subscription: {value: false, validators: []},
    //         }),
    //         privacy_toggle: false,
    //         subscription_toggle: false,
    //     };
    // }
    //
    // setCheckboxState(toggle, name) {
    //     const {form} = this.state;
    //     const n = this.state[toggle + '_toggle'];
    //     form.setValue(name, !n);
    //     this.setState({[toggle + '_toggle']: !n});
    //     validateField(this, form)
    // }
    //
    // render({}, {form}) {
    //     return (
    //         <form onSubmit={e => e.preventDefault()}>
    //             <div>
    //                 <label htmlFor="name">Name [required]</label>
    //                 <input id="name" type="text" name="name" onInput={validateField(this, form)} />
    //             </div>
    //             <br />
    //             <div className="info-zone">
    //                 {form.hasErrors('name') ? <b>Error(s) : {form.getErrors('name').join(' - ')}</b> :
    //                     <i>Ok</i>}
    //                 {form.isTouched('name') ? <s>Touched</s> : <s>Not touched</s>}
    //             </div>
    //             <br />
    //             <div>
    //                 <div className="radio-line">
    //                     <input type="checkbox" id="tea"
    //                         name="privacy"
    //                         value="true"
    //                         onChange={(e) => {
    //                             this.setCheckboxState(e.target.name, 'privacy')
    //                         }}
    //                         checked={form.isSelected('privacy', true)} />
    //                     <label htmlFor="privacy">Privacy</label>
    //                 </div>
    //             </div>
    //
    //             <br />
    //             <div className="info-zone">
    //                 {form.hasErrors('privacy') ? <b>Error(s) : {form.getErrors('privacy').join(' - ')}</b> : <i>Ok</i>}
    //                 {form.isTouched('privacy') ? <s>Touched</s> : <s>Not touched</s>}
    //             </div>
    //
    //
    //             {/*---------------------------------- */}
    //
    //             <br />
    //             <div>
    //                 <div className="radio-line">
    //                     <input type="checkbox" id="tea"
    //                         name="subscription"
    //                         value="true"
    //                         onChange={(e) => {
    //                             this.setCheckboxState(e.target.name, 'subscription')
    //                         }}
    //                         checked={form.isSelected('subscription', true)} />
    //                     <label htmlFor="subscription">Over</label>
    //                 </div>
    //             </div>
    //
    //             <br />
    //             <div className="info-zone">
    //                 {form.hasErrors('subscription') ? <b>Error(s) : {form.getErrors('subscription').join(' - ')}</b> : <i>Ok</i>}
    //                 {form.isTouched('subscription') ? <s>Touched</s> : <s>Not touched</s>}
    //             </div>
    //
    //             <br />
    //             <div className="line">
    //                 <div>{form.getErrors(['name'])}</div>
    //                 <input disabled={!form.isValid()} type="submit" value="Submit form" />
    //                 {form.isValid() ? <i>Form valid</i> : <b>Form invalid</b>}
    //             </div>
    //             <br />
    //             <FormValues form={form} />
    //         </form>
    //     )
    // }
};
