import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid, Image, Loader, Segment } from 'semantic-ui-react';
import PostCard from '../components/PostCard';


function Home() {
    const {loading, data}= useQuery(FETCH_POSTS_QUERY);
        console.log(data)
    return (
    <Grid columns={3}>
        <Grid.Row centered className="page-title">
            <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
            {loading ? (
                <h1>
                <Loader active />
                </h1>
            ):(
                data && data.getPosts.map(post=>(
                    <Grid.Column key={post.id} style={{marginBottom:20}}>
                        <PostCard post={post} />
                    </Grid.Column>
                ))
            )}
        </Grid.Row>
    </Grid>
    );
};

const FETCH_POSTS_QUERY=gql`
{
    getPosts{
        id
        body
        createdAt
        username
        likeCount
        likes{
            username
        }
        commentCount
        comments{
            id
            createdAt
            username
            body
        }
    }
}
`
export default Home
