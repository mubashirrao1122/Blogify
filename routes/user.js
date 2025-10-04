const {Router} = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');

 const router = Router();

 router.get('/signin', (req, res) => {
   res.render('signin');
});

 router.get('/signup', (req, res) => {
    res.render('signup');
 });

 router.post('/signup', async (req, res) => {
    
    try { 
      const {fullname, email, password} = req.body;
        await User.create({fullname, email, password});
        res.redirect('signin');
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Internal Server Error');
    }
 });

 router.post('/signin', async (req, res) => { 
      try {
         const { email, password } = req.body;
         User.matchPasswordandGenerateToken(email, password).then(token => {
            if (token) {
                // User authenticated successfully
                res.cookie('token', token ).redirect('/');
            } else {
                // Authentication failed
                res.render('signin', { error: 'Invalid email or password' });
            }
         }).catch(err => {
            console.error('Error during authentication:', err);
            res.status(500).send('Internal Server Error');
         });
      } catch (error) {
        console.error('Error during user sign-in:', error);
        res.status(500).send('Internal Server Error');
      }
 });  

 router.get('/signout', (req, res) => {
      res.clearCookie('token').redirect('/');
   });   

 // User Profile Route
 router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const profileUser = await User.findById(userId);
        
        if (!profileUser) {
            return res.status(404).send('User not found');
        }
        
        // Get all blogs by this user
        const userBlogs = await Blog.find({ createdBy: userId })
            .populate('createdBy')
            .sort({ createdAt: -1 });
        
        res.render('profile', {
            user: req.user, // Current logged-in user
            profileUser: profileUser, // User whose profile we're viewing
            blogs: userBlogs
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Error loading profile');
    }
 });

 // Current user's own profile
 router.get('/profile', (req, res) => {
    console.log('Profile route accessed, user:', req.user);
    if (!req.user) {
        console.log('No user found, redirecting to signin');
        return res.redirect('/user/signin');
    }
    console.log('Redirecting to user profile:', req.user._id);
    res.redirect(`/user/profile/${req.user._id}`);
 });

 // Settings page
 router.get('/settings', (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    
    res.render('settings', {
        user: req.user,
        success: null,
        error: null
    });
 });

 // Update profile settings
 router.post('/settings/profile', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    
    try {
        const { fullname, email } = req.body;
        
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ 
            email: email, 
            _id: { $ne: req.user._id } 
        });
        
        if (existingUser) {
            return res.render('settings', {
                user: req.user,
                error: 'Email is already taken by another user',
                success: null
            });
        }
        
        // Update user profile
        await User.findByIdAndUpdate(req.user._id, {
            fullname: fullname,
            email: email
        });
        
        res.render('settings', {
            user: { ...req.user, fullname, email },
            success: 'Profile updated successfully!',
            error: null
        });
        
    } catch (error) {
        console.error('Error updating profile:', error);
        res.render('settings', {
            user: req.user,
            error: 'Error updating profile. Please try again.',
            success: null
        });
    }
 });

 // Change password
 router.post('/settings/password', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        
        // Validate passwords
        if (newPassword !== confirmPassword) {
            return res.render('settings', {
                user: req.user,
                error: 'New passwords do not match',
                success: null
            });
        }
        
        if (newPassword.length < 6) {
            return res.render('settings', {
                user: req.user,
                error: 'New password must be at least 6 characters long',
                success: null
            });
        }
        
        // Get current user from database
        const currentUser = await User.findById(req.user._id);
        
        // Verify current password
        const { createHmac } = require('node:crypto');
        const hashedCurrentPassword = createHmac('sha256', currentUser.salt)
            .update(currentPassword)
            .digest('hex');
            
        if (hashedCurrentPassword !== currentUser.password) {
            return res.render('settings', {
                user: req.user,
                error: 'Current password is incorrect',
                success: null
            });
        }
        
        // Update password (will be hashed by pre-save middleware)
        currentUser.password = newPassword;
        await currentUser.save();
        
        res.render('settings', {
            user: req.user,
            success: 'Password changed successfully!',
            error: null
        });
        
    } catch (error) {
        console.error('Error changing password:', error);
        res.render('settings', {
            user: req.user,
            error: 'Error changing password. Please try again.',
            success: null
        });
    }
 });

 // Delete account
 router.post('/settings/delete-account', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    
    try {
        const { confirmDelete } = req.body;
        
        if (confirmDelete !== 'DELETE') {
            return res.render('settings', {
                user: req.user,
                error: 'Please type "DELETE" to confirm account deletion',
                success: null
            });
        }
        
        // Delete all user's blogs
        await Blog.deleteMany({ createdBy: req.user._id });
        
        // Delete user account
        await User.findByIdAndDelete(req.user._id);
        
        // Clear cookie and redirect
        res.clearCookie('token').redirect('/');
        
    } catch (error) {
        console.error('Error deleting account:', error);
        res.render('settings', {
            user: req.user,
            error: 'Error deleting account. Please try again.',
            success: null
        });
    }
 });

    module.exports = router;