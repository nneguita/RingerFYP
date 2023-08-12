import React from 'react';
import firebase from '../../firebase'; //to get the auth dependancy

//using import to make the register components
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';

import { Link } from 'react-router-dom'

class Login extends React.Component {
    //used to corresponds with the components that we are using 
    state={
        email: "",
        password: "",
        errors: [],
        loading: false,
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>); //to display to the user the errors
    
    //used to update state according to the value type that is tied to this input
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value}); 
    };

    handleSubmit = event => {
        event.preventDefault(); //to avoid the default action of sending a form which is to reload the page
        if(this.isFormValid(this.state)) {
        this.setState({errors: [], loading: true}); // to prevent the clicking submit twice as an error
        firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
            console.log(signedInUser);
        })
        .catch(err => {
            console.error(err);
            this.setState({
            errors: this.state.errors.concat(err), loading: false
            })
        })
    }
};

// a new isFormValid for Login
isFormValid = ({email, password}) => email && password;
//to show the user which field has been taken and where the error occured
handleInputError= (errors, inputName) => {
    return errors.some(error=> error.message.toLowerCase().includes('email')) ? "error" : ""
}

    render () { //layout of register page
        //used to allow the form to reset after a submission, each components will 
        //be bounded with a value type on each perspective code.
        const {email, password, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style ={{maxWidth: 450}}>
                    <Header as="h1" icon color ="blue" textAlign="center">
                        <Icon name="code branch" color="pink" />
                        Login to Ringer
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" //user email
                            placeholder="Email Address" onChange={this.handleChange} value={email} 
                            className={this.handleInputError(errors, 'email')} type="email" />  

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" //password
                            placeholder="Password" onChange={this.handleChange} value={password} 
                            className={this.handleInputError(errors, 'password')} type="password" />
                            
                            <Button disabled={loading} // to make sure that the person being registered can't click submit button twice
                            className={loading ? 'loading' : ''} color="red" fluid size="large">
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                        <h3>Error</h3>
                        {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Dont have an account?
                        <Link to="/register">
                            Register
                        </Link>
                    </Message>
            </Grid.Column>
            </Grid>
        )
    }
}
//to run the program
export default Login;