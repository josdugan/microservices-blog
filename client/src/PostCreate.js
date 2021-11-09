import { useState } from 'react';
import axios from 'axios';

const PostCreate = () => {
    const [ title, setTitle ] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();

        await axios.post(`${process.env.REACT_APP_POSTS_API_DOMAIN}/posts/create`, {
            title
        });

        setTitle('');
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input 
                        id="title" 
                        type="text" 
                        className="form-control" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default PostCreate;
