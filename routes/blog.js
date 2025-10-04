const {Router} = require('express');
const blog = require('../models/blog');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');

 const router = Router();

  const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));  
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })
    

    router.get('/add-new', (req, res) => {
        res.render('addblog', {
            user: req.user
        });
    });

    // Debug route to see all blogs
    router.get('/list/all', async (req, res) => {
        try {
            const allBlogs = await Blog.find({}).populate('createdBy');
            res.json({
                count: allBlogs.length,
                blogs: allBlogs.map(blog => ({
                    id: blog._id,
                    title: blog.title,
                    author: blog.createdBy?.fullname || 'Unknown',
                    createdAt: blog.createdAt
                }))
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    router.get('/create-sample', async (req, res) => {
        if (!req.user) {
            return res.redirect('/user/signin');
        }
        
        try {
            const sampleBlog = await Blog.create({
                title: 'Sample Blog Post - ' + new Date().toISOString(),
                body: 'This is a sample blog post created for testing purposes. It contains enough content to demonstrate the blog viewing functionality. You can create your own blogs using the Add Blog feature.',
                coverImageURL: 'https://via.placeholder.com/600x300/28a745/ffffff?text=Sample+Blog',
                createdBy: req.user._id
            });
            
            console.log('Sample blog created:', sampleBlog._id);
            res.redirect(`/blog/${sampleBlog._id}`);
        } catch (error) {
            console.error('Error creating sample blog:', error);
            res.status(500).send('Error creating sample blog: ' + error.message);
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            console.log('Blog route accessed with ID:', req.params.id);
            
            // Check if it's a valid MongoDB ObjectId
            if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                console.log('Invalid blog ID format');
                return res.status(400).send('Invalid blog ID format');
            }
            
            const blog = await Blog.findById(req.params.id).populate('createdBy');
            console.log('Blog found:', blog ? 'Yes' : 'No');
            
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            
            res.render('blog', {
                user: req.user,
                blog: blog
            });
        } catch (error) {
            console.error('Error fetching blog:', error);
            return res.status(500).send('Error loading blog: ' + error.message);
        }
    });


    router.post('/', upload.single('CoverImage'),  async (req,res) =>{
         const { title, body } = req.body;
          const blog =  await Blog.create({
            title,
            body,
            coverImageURL: `/uploads/${req.file.filename}`,
            createdBy: req.user._id 
        });
        return res.redirect(`/blog/${blog._id}`);
    });

    module.exports = router;    