import { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_COMMENTS_API_DOMAIN}/posts/${postId}/comments`);

        setComments(res.data);
    };

    const renderedComments = comments.map(comment => (
        <li key={comment.id}>{comment.content}</li>
    ));

    return (
        <ul>
            {renderedComments}
        </ul>
    );
};

export default CommentList;
