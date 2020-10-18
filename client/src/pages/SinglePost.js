import React,{useContext} from 'react';
import {Link} from 'react-router-dom';
import gql from 'graphql-tag';
import {useQuery, useMutation} from '@apollo/react-hooks';
import { Button, Card, Grid, Icon, Image, Label, Loader } from 'semantic-ui-react';
import moment from 'moment';
import {AuthContext} from "../context/auth";
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function SinglePost(props) {
    const postId=props.match.params.postId;
    const {user}=useContext(AuthContext);

    const {
        data
      } = useQuery(FETCH_POST_QUERY, {
        variables: {
          postId
        }
    });

    console.log(data);

    function deletePostCallback(){
        props.history.push('/');
    }

    
    let postMarkup;
    if(!data){
        postMarkup=<Loader active />
    }else{
        const id=data.getPost.id ,likes=data.getPost.likes, likeCount=data.getPost.likeCount;
        postMarkup=(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        size="small" float="right"/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{data.getPost.username}</Card.Header>
                                <Card.Meta>{moment(data.getPost.createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{data.getPost.body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                
                                <LikeButton user={user} post={{id, likeCount, likes}}/>

                                <Button as="div" labelPosition="right" >
                                    <Button basic color="blue">
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {data.getPost.commentCount}
                                    </Label>
                                </Button>
                                {user && user.username===data.getPost.username &&(
                                    <DeleteButton postId={data.getPost.id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup;
}

const FETCH_POST_QUERY=gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`

export default SinglePost
