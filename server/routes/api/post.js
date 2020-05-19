const router = require('express').Router();
const mongodb = require('mongodb');
const dotenv = require('dotenv').config();

// Get posts
router.get('/', async (req, res) => {
    const posts = await loadPostCollection();
    res.send(await posts.find({}).toArray());
});

// Add posts
router.post('/', async (req, res) => {
    const posts = await loadPostCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});

// Delete posts
router.delete('/:id', async (req, res) => {
    const posts = await loadPostCollection();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
})


// Mongodb connnection
async function loadPostCollection(){
    const client = await mongodb.MongoClient.connect(
        process.env.DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        }
    );
    return client.db('vue_express').collection('posts');
}


module.exports = router