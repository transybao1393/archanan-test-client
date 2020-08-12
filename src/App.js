import React, { useState } from 'react';
import './App.scss';
import {Input, Row, Col, Button, notification} from 'antd';
// import Home from './components/Home/Home';
import Auth from '@aws-amplify/auth';
// import awsExports from './awsExports';
import Amplify, {API} from "aws-amplify";

// Amplify.configure(awsExports);
Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'ap-southeast-1', 
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-southeast-1_ihWPvETFg', 
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '5mhq4tjs8nuscdjr1cee65ev9i',
  },
  API: {
    endpoints: [
        {
            name: "myGolangServer",
            endpoint: "http://localhost:6001"
        }
    ]
}
});

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLoginButtonOnclick = async () => {
    console.log('email', email, 'pass', password);
    
    //- call directly
    Auth.signIn(email, password)
    .then(userCred => {
      console.log('Login success', userCred);
      if(userCred.challengeName === "NEW_PASSWORD_REQUIRED") {
        return Auth.completeNewPassword(userCred, "transybao93")
        .then(() => {
          return Auth.currentSession();
        });
      }else{
        return Auth.currentSession();
      }
    })
    .then((currentSession) => {
      console.log('current session', currentSession);
      let accessToken = currentSession.getAccessToken().getJwtToken();
      let idToken = currentSession.getIdToken().getJwtToken();

      console.log('accessToken', accessToken);
      console.log('idToken', idToken);
      //- calling api

      return API.post('myGolangServer', '/internal', {
        body: {idToken}
      });
    })
    .then((apiResult) => {
      console.log('apiResult', apiResult);
      //- success
      notification['success']({
        message: 'Logged in successfully!',
        description: JSON.stringify(apiResult)
      });
    })
    .catch(async (err) => {
      console.log('error when calling api...', err);
      notification['error']({
        message: 'Error',
        description: err.message
      });
      await API.post('myGolangServer', '/internal2', {
        body: {
          errorCode: err.code,
          errorMessage: err.message
        }
      });
    });
  }

  return (
    <div className="App">
      <Row style={{ marginBottom: 8 }}>
        <Col span={6}>
          <Input placeholder="Your email" onChange={(e) => setEmail(e.target.value)} />
        </Col>
      </Row>

      <Row style={{ marginBottom: 8 }}>
        <Col span={6}>
          <Input.Password placeholder="Your password" onChange={(e) => setPassword(e.target.value)}/>
        </Col>
      </Row>

      <Row>
        <Col span={1}>
          <Button onClick={handleLoginButtonOnclick}>Login</Button>
        </Col>
        <Col span={2}>
          <Button>Clear</Button>
        </Col>
      </Row>
      
    </div>
  );
}

export default App;
