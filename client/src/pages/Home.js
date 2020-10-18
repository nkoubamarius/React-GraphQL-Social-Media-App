import React, { useContext,useEffect } from 'react';
import {useQuery} from '@apollo/react-hooks';
import { Grid,  Loader , Transition} from 'semantic-ui-react';
import {AuthContext} from "../context/auth";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import {FETCH_POSTS_QUERY} from '../util/graphql';

function Home() {
    const context=useContext(AuthContext);
    const {loading, data}= useQuery(FETCH_POSTS_QUERY);

    useEffect(() => {    
        context.loaddata(data);
    }, [data]);
    
    return (
    <Grid columns={3}>
        <Grid.Row centered className="page-title">
            <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
            {context.user && (
                <Grid.Column>
                    <PostForm/>
                </Grid.Column>
            )}
            {loading ? (
                <h1>
                <Loader active />
                </h1>
            ):(
                <Transition.Group>
                    {
                        context.postsData && context.postsData.getPosts.map(post=>(
                            <Grid.Column key={post.id} style={{marginBottom:20}}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))
                    }
                </Transition.Group>                
            )}
        </Grid.Row>
    </Grid>
    );
};

export default Home
