import React, { useContext, useState } from 'react'
import { Button, Form, Icon } from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {useFrom} from '../util/hooks';
import {AuthContext} from '../context/auth';

function Login(props) {
    const context=useContext(AuthContext);

    const [errors, setErrors]=useState({});

    const {onChange, onSubmit, values}=useFrom(loginrUserCallback, {
        username:'',
        password:'',
    });
 
     const [loginUser, {loading}]=useMutation(LOGIN_USER,{
         update(_, {data: {login: userData}}){
            context.login(userData);
            props.history.push('/');
         },
         onError(err){
             setErrors(err.graphQLErrors[0].extensions.exception.errors);
         },
         variables: values
     });

    function loginrUserCallback(){
        loginUser();
    }


    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading? 'loading':''}>
                <h1>Login</h1>
                <Form.Input label='username' type='username' error={errors.username? true:false} placeholder='username...' name="username" value={values.username} onChange={onChange} />
                <Form.Input label='Enter Password' error={errors.password? true:false} placeholder="Password..." type='password' name="password" value={values.password} onChange={onChange} />  
                <Button type="submit" primary>
                    Login &nbsp;&nbsp;<Icon name='send' />
                </Button>
            </Form>
            {Object.keys(errors).length>0 && (
                <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value=>(
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>
            )}            
        </div>
    )
};

const LOGIN_USER = gql`
    mutation login(
        $username:String!
        $password: String!
    ){
        login(
            username: $username password: $password
        ){
            id
            username
            token
            username
            createdAt
        }
    }
`;

export default Login
