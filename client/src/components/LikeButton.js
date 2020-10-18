import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import { Button, Icon, Label } from 'semantic-ui-react';

function LikeButton({user, post:{id,likeCount, likes}}) {
    const [liked, setLiked]=useState(false);

    useEffect(() => {
        if(user && likes.find(like=>like.username===user.username)){
            setLiked(true);
        }else setLiked(false);
    }, [user, likes]);

    const [likePost]=useMutation(LIKE_POST_MUTATION,{
        variables:{ postId: id}
    });

    const likedButton= user ? (
        liked? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ):(
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ):(
        <Button color='teal' basic as={Link} to='/login'>
            <Icon name='heart' />
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick={likePost} style={{marginBottom:10}} >
            {likedButton}
            <Label as='a' basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}
const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`
export default LikeButton
