import React from 'react';
import firebase from '../../firebase'; //to get the auth dependancy
import md5 from 'md5'; //usually used for hash messages, used to create a unique value to gravatar.com

//using import to make the register components
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';

import { Link } from 'react-router-dom'

class Register extends React.Component {
    //used to corresponds with the components that we are using 
    state={
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    };
    
    //to prevent the form being valid and is not empty
    isFormValid = () =>{
        let errors =[]; //to return error from the isFormEmpty function
        let error;

        if(this.isFormEmpty(this.state)){
            error = {message: 'Fill in the form Please!'};
            this.setState({errors: errors.concat(error)});
            return false; // indicating it should not be executed
        } else if (!this.isPasswordValid(this.state)) {
            error = {message: 'Password is Invalid!'};
            this.setState({errors: errors.concat(error)});
            return false;
        } else {
            // form valid 
            return true;
        }
    }

    //taking each components to be checked by counting its length and 
    //turning it into its opposite boolean value, if its 0, it became true which means the form is empty
    isFormEmpty = ({username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    //to check if the password are valid
    isPasswordValid = ({password, passwordConfirmation}) => {
        if (password.length < 6 || passwordConfirmation.length < 6) { //checking the password and confirmation is not less than 6
            return false;
        } else if (password !== passwordConfirmation){ //checking the password and confirmation are the same
            return false;
        } else {
            return true;
        }
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>); //to display to the user the errors
    
    //used to update state according to the value type that is tied to this input
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault(); //to avoid the default action of sending a form which is to reload the page
        if(this.isFormValid()) {
        this.setState({errors: [], loading: true}); // to prevent the clicking submit twice as an error
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password) //to register the user.
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon` //making a user avatar, identicon to generate it
                })
                .then(()=>{
                    this.saveUser(createdUser).then (()=>{
                        console.log('user saved');
                    })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ errors: this.state.errors.concat(err), loading: false});
                })
            })
            .catch(err => { //to catch any error and save it in a simple err
                console.error(err);
                this.setState({errors: this.state.errors.concat(err), loading:false}); //back to initialization of loading funtion
            });
    }
};

//what the user will look like inside the app
saveUser = createdUser => {
    return this.state.userRef.child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        avatar: createdUser.user.photoURL
    });
    //uid is within the console after submitting registration
}
//to show the user which field has been taken and where the error occured
handleInputError= (errors, inputName) => {
    return errors.some(error=> error.message.toLowerCase().includes('email')) ? "error" : ""
}

    render () { //layout of register page
        //used to allow the form to reset after a submission, each components will 
        //be bounded with a value type on each perspective code.
        const {username, email, password, passwordConfirmation, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style ={{maxWidth: 450}}>
                    <Header as="h1" icon color ="blue" textAlign="center">
                        <Icon name="code branch" color="pink" />
                        Register for Ringer
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" //username
                            placeholder="Username" onChange={this.handleChange} value={username} 
                            type="text" />

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" //user email
                            placeholder="Email Address" onChange={this.handleChange} value={email} 
                            className={this.handleInputError(errors, 'email')} type="email" />  

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" //password
                            placeholder="Password" onChange={this.handleChange} value={password} 
                            className={this.handleInputError(errors, 'password')} type="password" />
                            
                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" //re-typing password
                            placeholder="Re-type your password" onChange={this.handleChange} value={passwordConfirmation} 
                            className={this.handleInputError(errors, 'password')} type="password" />
                            
                            <Button disabled={loading} // to make sure that the person being registered can't click submit button twice
                            className={loading ? 'loading' : ''} color="purple" fluid size="large">
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
                        Already a user?
                        <Link to="/login">
                            Login
                        </Link>
                    </Message>
            </Grid.Column>
            </Grid>
        )
    }
}
//to run the program
export default Register;