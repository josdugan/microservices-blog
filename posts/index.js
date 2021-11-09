const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT || 4000;
const EVENT_BUS_API_DOMAIN = process.env.EVENT_BUS_API_DOMAIN;

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    await axios.post(`${EVENT_BUS_API_DOMAIN}/events`, {
        type: 'PostCreated',
        data: {
            id, title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('recieved event: ', req.body.type);

    res.send({});
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
