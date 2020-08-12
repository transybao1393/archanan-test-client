import React, { Component } from 'react';
//- this component will implement Amplify
import Auth from '@aws-amplify/auth';
import awsExports from './awsExports'
import Amplify from "aws-amplify";

class Home extends Component {

    constructor(props) {
        super(props);
        let username = 'transybao28@gmail.com';
        let password = 'transybao93';
        let email = 'transybao28@gmail.com';
        Amplify.configure(awsExports);

        // Auth.signUp({
        //     username,
        //     password,
        //     attributes: {
        //         email
        //     },
        // });
        
        Auth.signIn(username, password)
            .then(success => console.log('Login success', success))
            .catch(err => console.log('error when log in', err));
    }

    render() {
        return (
            <div>
                <p>This is Home component</p>
            </div>
        );
    }
}

export default Home;