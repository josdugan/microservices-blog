const express = require('express');
const axios = require('axios');

const PORT = process.env.PORT || 4005;
const POSTS_API_DOMAIN = process.env.POSTS_API_DOMAIN;
const COMMENTS_API_DOMAIN = process.env.COMMENTS_API_DOMAIN;
const QUERY_API_DOMAIN = process.env.QUERY_API_DOMAIN;
const MODERATION_API_DOMAIN = process.env.MODERATION_API_DOMAIN;

const app = express();
app.use(express.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post(`${POSTS_API_DOMAIN}/events`, event).catch(err => console.log(err.message));
    axios.post(`${COMMENTS_API_DOMAIN}/events`, event).catch(err => console.log(err.message));
    axios.post(`${QUERY_API_DOMAIN}/events`, event).catch(err => console.log(err.message));
    axios.post(`${MODERATION_API_DOMAIN}/events`, event).catch(err => console.log(err.message));

    res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
