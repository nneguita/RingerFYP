import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './Spinner';
import registerServiceWorker from './registerServiceWorker';
//this is imported from react website to import its components.
import 'semantic-ui-css/semantic.min.css'
//this is a listener for login page
import firebase from './firebase';

import { BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
//to make the data in available for global state
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux'; //connect is linking redux state and actions with react component
//to set up the dev tools extension
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
//
import { setUser, clearUser } from './actions';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
    componentDidMount(){ //to execute the listener
        console.log(this.props.isLoading)
        firebase.auth().onAuthStateChanged(user => {
            if(user) { //if user is detected, redirecting to home route
                //console.log(user); used to put the user's data in global state for web use
                this.props.setUser(user);
                this.props.history.push('/'); 
            } else {
                this.props.history.push('/login');
                this.props.clearUser(); //prevent loading stuck error after signing out
            }
        })
    }
    render(){
    return this.props.isLoading ? <Spinner /> :( //to make sure the user doesnt see blank screen
        <Switch>
            <Route exact path = "/" component = {App} />
            <Route path = "/login" component = {Login} />
            <Route path = "/register" component = {Register} />
        </Switch>
        );
    }
}

//state updates are asyncronous and it may take some time, code below is used to get the loading data from state object
const mapStateFromProps= state => ({
    isLoading: state.user.isLoading
});
//to log-in properly and will get being redirected to home as we have logged in
const RootWithAuth = withRouter(
    connect(
        mapStateFromProps, 
        { setUser, clearUser } //taking the set user actions included in the props object of the component that are wrapped with connect
        )(Root)); //to define push function in the history funtion


ReactDOM.render(
    <Provider store = {store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();