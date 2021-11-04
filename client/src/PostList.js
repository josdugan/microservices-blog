import { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
    const [ posts, setPosts ] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_POSTS_API_DOMAIN}/posts`);

        setPosts(res.data);
    };

    const renderedPosts = Object.values(posts).map(post => (
        <div 
            className="card"
            style={{ width: '30%', marginBottom: '20px' }}
            key={post.id}
        >
            <div className="card-body">
                <h3>{post.title}</h3>
                <CommentList postId={post.id} />
                <CommentCreate postId={post.id} />
            </div>
        </div>
    ));

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {renderedPosts}
        </div>
    );
};

export default PostList;
