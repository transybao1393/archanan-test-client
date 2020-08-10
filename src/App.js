import React, { useState } from 'react';
import './App.scss';
import {Input, Row, Col, Button, notification} from 'antd';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLoginButtonOnclick = async () => {
    console.log('email', email, 'pass', password);

    //- login logic
    await fetch('http://localhost:6001/internal', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then((res) => {
      return res.json();
    })
    .then(rs => {
      console.log('response', rs);
      if(rs.challengeName === "NEW_PASSWORD_REQUIRED") {
        console.log('need to reset password');
        notification['info']({
          message: 'Need to reset',
          description: "need to reset password"
        });
      }else if(rs.error !== null){
        notification['error']({
          message: 'Error',
          description: JSON.stringify(rs)
        });
      }else{
        notification['success']({
          message: 'Logged in',
          description: JSON.stringify(rs)
        });
      }
    })
    .catch(err => {
      console.error('err when calling api', err);
      notification['error']({
        message: 'Error when calling api',
        description: JSON.stringify(err)
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
