const path = require('path');
const userRoute = require('./routes/user');  
const blogRoute = require('./routes/blog'); 
const mongoose = require('mongoose');   
const express = require('express');
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog');

const {checkforAuthentication} = require('./middlewares/authentication');


const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/blogify').then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
 
   
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.static(path.resolve('./public'))); // Serve static files


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(checkforAuthentication()); // Custom middleware to check for authentication


app.get('/', async(req, res) => {
    let allBlogs = await Blog.find({}).populate('createdBy').sort({ createdAt: -1 });
    
    // Add fake data for demonstration if no blogs exist
    if (allBlogs.length === 0) {
        allBlogs = [
            {
                _id: 'fake1',
                title: 'Getting Started with Node.js',
                body: 'Node.js is a powerful runtime that allows you to build scalable applications using JavaScript on the server side. In this comprehensive guide, we\'ll explore the fundamentals of Node.js development.',
                coverImageURL: 'https://via.placeholder.com/400x200/007bff/ffffff?text=Node.js',
                createdBy: { fullname: 'John Doe', _id: 'user1' },
                createdAt: new Date('2024-01-15')
            },
            {
                _id: 'fake2', 
                title: 'Understanding React Hooks',
                body: 'React Hooks revolutionized the way we write React components. Learn how useState, useEffect, and custom hooks can make your code more efficient and reusable.',
                coverImageURL: 'https://via.placeholder.com/400x200/61dafb/000000?text=React',
                createdBy: { fullname: 'Jane Smith', _id: 'user2' },
                createdAt: new Date('2024-01-10')
            },
            {
                _id: 'fake3',
                title: 'CSS Grid vs Flexbox',
                body: 'Both CSS Grid and Flexbox are powerful layout systems. This article explains when to use each one and how they can work together to create responsive designs.',
                coverImageURL: 'https://via.placeholder.com/400x200/ff6b6b/ffffff?text=CSS',
                createdBy: { fullname: 'Mike Johnson', _id: 'user3' },
                createdAt: new Date('2024-01-05')
            },
            {
                _id: 'fake4',
                title: 'JavaScript ES6+ Features',
                body: 'Modern JavaScript includes many powerful features like arrow functions, destructuring, async/await, and modules. Master these concepts to write cleaner code.',
                coverImageURL: 'https://via.placeholder.com/400x200/f39c12/000000?text=JavaScript',
                createdBy: { fullname: 'Sarah Wilson', _id: 'user4' },
                createdAt: new Date('2024-01-01')
            },
            {
                _id: 'fake5',
                title: 'Building REST APIs with Express',
                body: 'Express.js makes it easy to build robust REST APIs. Learn about routing, middleware, error handling, and best practices for API development.',
                coverImageURL: 'https://via.placeholder.com/400x200/28a745/ffffff?text=Express',
                createdBy: { fullname: 'Alex Brown', _id: 'user5' },
                createdAt: new Date('2023-12-28')
            },
            {
                _id: 'fake6',
                title: 'MongoDB Database Design',
                body: 'Designing efficient MongoDB schemas is crucial for application performance. Explore document structure, indexing strategies, and query optimization.',
                coverImageURL: 'https://via.placeholder.com/400x200/4caf50/ffffff?text=MongoDB',
                createdBy: { fullname: 'Emma Davis', _id: 'user6' },
                createdAt: new Date('2023-12-25')
            }
        ];
    }
    
    console.log('User in request:', req.user); // Debug line
    res.render('home.ejs', {
        user: req.user,
        blogs: allBlogs
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Debug route to check authentication
app.get('/debug/user', (req, res) => {
    res.json({
        user: req.user,
        cookies: req.cookies,
        headers: req.headers.cookie
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});