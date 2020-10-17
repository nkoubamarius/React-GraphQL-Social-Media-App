import React, { useState , useContext} from 'react'
import { Button, Form, Icon } from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {useForm} from '../util/hooks';
import {AuthContext} from '../context/auth';

function Register(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors]=useState({});

    const {onChange, onSubmit, values}=useForm(registerUser, {
        username: '',
        email:'',
        password:'',
        confirmPassword:''
    });
 
     const [addUser, {loading}]=useMutation(REGISTER_USER,{
         update(_,  {data: {login: userData}}){
            context.login(userData);
             props.history.push('/');
         },
         onError(err){
             setErrors(err.graphQLErrors[0].extensions.exception.errors);
         },
         variables: values
     });

     function registerUser(){
         addUser();
     }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading? 'loading':''}>
                <h1>Register</h1>
                <Form.Input label='Username' type='text' error={errors.username? true:false} placeholder='Username...' name="username" value={values.username} onChange={onChange} />
                <Form.Input label='email' type='email' error={errors.email? true:false} placeholder='Email...' name="email" value={values.email} onChange={onChange} />
                <Form.Input label='Enter Password' error={errors.password? true:false} placeholder="Password..." type='password' name="password" value={values.password} onChange={onChange} />
                <Form.Input label='Confirm Password' error={errors.confirmPassword? true:false} placeholder="Confirm the Password..." type='password' name="confirmPassword" value={values.confirmPassword} onChange={onChange} />
                <Button type="submit" primary>
                    Register &nbsp;&nbsp;<Icon name='send' />
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $password: String!
        $confirmPassword: String!
        $email:String!
    ){
        register(registerInput:{
            username: $username
            password: $password
            confirmPassword: $confirmPassword
            email:$email
        }
        ){
            id
            email
            token
            username
            createdAt
        }
    }
`;

export default Register
