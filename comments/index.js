const express = require('express');
const { randomBytes } = require('crypto');

const app = express();
app.use(express.json());
const port = process.env.PORT || 4001;

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id, content });

    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
