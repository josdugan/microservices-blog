const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT || 4002;
const EVENT_BUS_API_DOMAIN = process.env.EVENT_BUS_API_DOMAIN;

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: []}
    }
    else if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({ id, content, status });
    }
    else if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);

        comment.status = status;
        comment.content = content;
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(PORT, async () => {
    console.log(`Listening on port: ${PORT}`);

    const res = await axios.get(`${EVENT_BUS_API_DOMAIN}/events`).catch(err => console.error(err.message));

    for (let event of res.data) {
        console.log('Processing event:', event.type);

        handleEvent(event.type, event.data);
    }
});
