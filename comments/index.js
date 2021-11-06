const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT || 4001;
const EVENT_BUS_API_DOMAIN = process.env.EVENT_BUS_API_DOMAIN;

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    const status = 'pending';

    comments.push({ id, content, status });

    commentsByPostId[req.params.id] = comments;

    await axios.post(`${EVENT_BUS_API_DOMAIN}/events`, {
        type: 'CommentCreated',
        data: {
            id,
            content,
            postId: req.params.id,
            status,
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('recieved event: ', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => comment.id === id);
        comment.status = status;

        await axios.post(`${EVENT_BUS_API_DOMAIN}/events`, {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content,
            }
        }).catch(err => console.error(err.message));
    }

    res.send({});
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
