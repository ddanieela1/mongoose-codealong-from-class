const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');
const Comment = require('./models/comment');

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


//home
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to our API"
    })
    
});



//users
app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

app.get('/posts', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


///users/:email
app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


//post/:title
app.get('/posts/:title', (req, res) => {
    console.log('find post by', req.params.title)
    Post.findOne({
       title: req.params.title
    })
    .then(post => {
        console.log('Here is the post', post.title);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//comment/:header
app.get('/comments/:header', (req, res) => {
    console.log('find comment by', req.params.header)
    Comment.findOne({
       header: req.params.header
    })
    .then(comment => {
        console.log('Here is the comment', comment.header);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//meta is used to store objects with keys and values
//post user
app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

//post a post
app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
      
    })
    .then(post => {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

//post a comment
app.post('/comments', (req, res) => {
    Comment.create({
        header: req.body.header,
        content: req.body.content,
        date: req.body.date
      
    })
    .then(post => {
        console.log('New comment =>>', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

//udate user
app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(user => {
            console.log('User was updated', user);
            res.redirect(`/users/${req.params.email}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

//udate post
app.put('/post/:title', (req, res) => {
    console.log('route is being on PUT')
    Post.findOne({ title: req.params.title })
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findOneAndUpdate({ title: req.params.title}, 
        { 
            title: req.body.title ? req.body.title : foundUser.title,
            body: req.body.body ? req.body.body : foundUser.body,
        })
        .then(post => {
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.title}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});


//udate comment
app.put('/post/:comment', (req, res) => {
    console.log('route is being on PUT')
    Comment.findOne({ header: req.params.header })
    .then(foundComment => {
        console.log('Comment found', foundComment);
        Comment.findOneAndUpdate({ header: req.params.header}, 
        { 
            header: req.body.header ? req.body.header : foundUser.header,
           content: req.body.content ? req.body.content : foundUser.content,
           date: req.body.date ? req.body.date : foundUser.date,
        })
        .then(Comment => {
            console.log('Comment was updated', comment);
            res.redirect(`/comments/${req.params.header}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

app.delete('/posts/:title', (req, res) => {
    Post.findOneAndRemove({ title: req.params.title })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.title} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

app.delete('/comments/:header', (req, res) => {
    Comment.findOneAndRemove({ header: req.params.header })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.header} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});






// mongoose fetch statements
// app.get('/' , (req, res) => {
//     const bobby = new User({
//         name: 'Robert',
//         email: 'Bobby@test.com',
//         meta: {
//             age: 30, 
//             website: 'https://chris.me'
//         }
//     });
    
//     bobby.save((err) => {
//         if (err) return console.log(err);
//         console.log('User Created!');
//     });

//     res.send(bobby.sayHello());
// })

// app.get('/findAll', (req,res) => {
//     User.find({}, (err, users) => {
//         if (err) res.send(`Failed to find record, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// app.get('/findById/:id', (req,res) => {
//     User.findById(req.params.id, (err, users) => {
//         if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//         res.send(users);
//     })

//     //find by Id without the findByID command, not ideal
//     // User.find({_id: mongoose.Types.ObjectId(req.params.id)}, (err, users) => {
//     //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//     //     res.send(users);
//     // })
// })

// app.get('/findByEmail/:email', (req,res) => {
//     User.findOne({email: req.params.email}, (err, users) => {
//         if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// Mongoose create statements
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

// const refPost = new Post({
//     title: 'testing post 1004',
//     body: 'Body for ref by comments', 
// });

// const refComment = new Comment({
//     header: "Our ref comment tester",
//     content: 'this is my ref comment text',
// });
// refComment.save();

// refPost.refComments.push(refComment);
// refPost.save();

// // find all comments on a post by ref
// // populate should be done via the field name on the parent document, in this case post, so because our refComments are on post.refComments we'll pass 'refComments' into our populate method
// Post.findOne({title: 'testing post 1003'}).populate('refComments').exec((err, post) => {
//     console.log(post);
// });

app.listen(8000, () => {
    console.log('Running port 8000')
});

