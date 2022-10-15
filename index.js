const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./schemas/post');
const User = require('./schemas/user');
const Comment = require('./schemas/comment');

const mongoDb = 'mongodb://127.0.0.1/mongoose-test';
mongoose.connect(mongoDb, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to mongoDb at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false}));


// mongoose fetch statements
app.get('/' , (req, res) => {
    const bobby = new User({
        name: 'Robert',
        email: 'Bobby@test.com',
        meta: {
            age: 30, 
            website: 'https://chris.me'
        }
    });
    
    bobby.save((err) => {
        if (err) return console.log(err);
        console.log('User Created!');
    });

    res.send(bobby.sayHello());
})

app.get('/findAll', (req,res) => {
    User.find({}, (err, users) => {
        if (err) res.send(`Failed to find record, mongodb error ${err}`);
        res.send(users);
    })
})

app.get('/findById/:id', (req,res) => {
    User.findById(req.params.id, (err, users) => {
        if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
        res.send(users);
    })

    //find by Id without the findByID command, not ideal
    // User.find({_id: mongoose.Types.ObjectId(req.params.id)}, (err, users) => {
    //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
    //     res.send(users);
    // })
})

app.get('/findByEmail/:email', (req,res) => {
    User.findOne({email: req.params.email}, (err, users) => {
        if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
        res.send(users);
    })
})

//Mongoose create statements
// creating users directly form model using model.save() and creating user using mode.Create
// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// })

// const newUser = new User({
//     name: 'created using new USer and Save()',
//     email: 'Tester3@gmail.com'
// });

// newUser.save((err) => {
//     if (err) return console.log(err);
//     console.log('created new user');
// })

// Creating a simple post document in the post collection
// Post.create({
//     content: 'This ia pst content...'
// });

// Mongoose update statements

// User.updateOne({name: 'Robert'}, {
//     meta: {
//         age: 56
//     }
// }, (err, updateOutcome) => {
//     if(err) return console.log(err);
//     console.log(`updated user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`)
// });

// Returns full object prior to update
// User.findOneAndUpdate({name: 'Robert'},
// {
//     meta: {
//         age: 61,
//         website: 'somethingNew.com'
//     }
// }, (err, user) => {
//     if(err) return console.log(err);
//     console.log(user);
// })

// mongoose delete statements(deletes all that match)
// User.remove({name: 'Robert'}, (err) => {
//     if (err) return console.log(err)
//     console.log('user record deleted');
// })
// finds first instance of chris and deletes it
// User.findOneAndRemove({name: 'Chris'}, (err, user) => {
//     if(err) return console.log(err);
//     console.log(user);
// })

// Post schema with association to comments

// const newPost = new Post({
//     title: " our first post",
//     body: 'Some body text for our post',
// })

// newPost.comments.push({
//     header: "our first comment",
//     content: 'this is my comment text',
// })

// newPost.save(function(err) {
//     if (err) return console.log(err)
//     console.log(`Created post`);
// })

// creating post with reference to a comment

// const createPosts = async () => {
    // const refPost = new Post({
    //     title: 'testing post 1003',
    //     body: 'Body for ref by comments', 
    // });

    // const refComment = new Comment({
    //     header: "Our ref comment tester",
    //     content: 'this is my ref comment text',
    // });
    // refComment.save();

    // refPost.refComments.push(refComment);
    // refPost.save();
// };
// await createPosts();

// find all comments on a post by ref
// populate should be done via the field name on the parent document, in this case post, so because our refComments are on post.refComments we'll pass 'refComments' into our populate method
Post.findOne({title: 'testing post 1003'}).populate('refComments').exec((err, post) => {
    console.log(post);
});

app.listen(8000, () => {
    console.log('Running port 8000')
});

