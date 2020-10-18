import React, { useContext, useState } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { AuthContext } from '../context/auth';

function DeleteButton({postId, callback}) {
    const context=useContext(AuthContext);
    const [confirmOpen, setConfirmOpen]=useState(false);
    const [deletePost]=useMutation(DELETE_POST_MUTATION,{
        update(proxy){
            setConfirmOpen(false);
            //TODO: remove post from cache
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            
            data.getPosts = data.getPosts.filter(p=>p.id !==postId);

            proxy.writeQuery({query: FETCH_POSTS_QUERY, data});
            context.loaddata(data);
            
            if(callback) callback();
        },
        variables:{
            postId
        }
    })

    return (
        <>
            <Button floated="right" as='div' color='red' basic onClick={()=>setConfirmOpen(true)}>
                <Icon name='trash' style={{margin:0}} />
            </Button>
            <Confirm 
                open={confirmOpen} 
                onCancel={()=>setConfirmOpen(false)} 
                onConfirm={deletePost} 
            />
        </>
    )
}
const DELETE_POST_MUTATION=gql`
    mutation deletePost($postId:ID!){
        deletePost(postId:$postId)
    }
`
export default DeleteButton
