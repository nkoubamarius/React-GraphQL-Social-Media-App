import React,{useState} from 'react';
import { Button, Form} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useForm} from '../util/hooks';
import {useMutation} from '@apollo/react-hooks';
import {FETCH_POSTS_QUERY} from '../util/graphql';

function PostForm() {
    const {onChange, onSubmit, values}=useForm( createPostCallback, {
        body:'',
    });

    const [createPost, {error}]=useMutation(CREATE_POST_MUTATION,{
        variables:values,
        update(proxy, result){
            const data=proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            data.getPosts=[result.data.createPost, ...data.getPosts];
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data});
            values.body='';
        },
    });

    function createPostCallback(){
        createPost().then((res)=>{
            //resposene
        });
    };

    return (
        <Form onSubmit={onSubmit} noValidate>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input 
                    type="text"
                    placeholder="Hi World!"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                 />
                 <Button type="submit" color="teal">
                     Submit
                 </Button>
            </Form.Field>
        </Form>
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
