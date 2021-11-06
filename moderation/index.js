const express = require('express');
const axios = require('axios');

const PORT = process.env.PORT || 4003;
const EVENT_BUS_API_DOMAIN = process.env.EVENT_BUS_API_DOMAIN;

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post(`${EVENT_BUS_API_DOMAIN}/events`, {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content,
            }
        }).catch(err => console.error(err.message));
    }

    res.send({});
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
