import React,{useContext, useState} from 'react';
import { Button, Form} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useForm} from '../util/hooks';
import {useMutation} from '@apollo/react-hooks';
import {FETCH_POSTS_QUERY} from '../util/graphql';
import { AuthContext } from '../context/auth';

function PostForm() {
    const context=useContext(AuthContext);

    const {onChange, onSubmit, values}=useForm( createPostCallback, {
        body:'',
    });

    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
        variables : values,

        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            
            data.getPosts = [result.data.createPost, ...data.getPosts];

            proxy.writeQuery({query: FETCH_POSTS_QUERY, data});
            context.loaddata(data);
            values.body='';
        },
        onError(error) {
            console.error("error :>>", error.message);
          },
    });

    function createPostCallback(){
        createPost();
    };

    return (
        <>
            <Form onSubmit={onSubmit} noValidate>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input 
                    type="text"
                    placeholder="Hi World!"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error? true:false}
                 />
                 <Button type="submit" color="teal">
                     Submit
                 </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{marginBottom: 20}}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    )
}
const CREATE_POST_MUTATION = gql`
    mutation createPost(
        $body:String!
    ){
        createPost(
            body: $body
        ){
            id
            body
            username
            createdAt
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`;
export default PostForm
