# Blogify 📝

A modern, clean blog application built with Node.js, Express, and MongoDB. Blogify allows users to create, read, and manage blog posts with a beautiful, responsive user interface.

## ✨ Features

- **User Authentication**: Secure signup, signin, and logout functionality
- **Blog Management**: Create, view, and manage blog posts with cover images
- **User Profiles**: Personal profile pages showing user's blog posts
- **Settings Panel**: Comprehensive account settings with profile updates and password changes
- **Responsive Design**: Clean, modern UI that works on all devices
- **File Upload**: Support for blog cover images
- **Real-time Statistics**: Track blog posts and user activity

## 🚀 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **File Upload**: Multer middleware
- **Template Engine**: EJS
- **Frontend**: Bootstrap 5, FontAwesome icons
- **Security**: bcrypt for password hashing, crypto for additional security

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mubashirrao1122/Blogify.git
   cd Blogify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Visit the application**
   Open your browser and navigate to `http://localhost:8000`

## 🏗️ Project Structure

```
Blogify/
├── controllers/          # Route controllers (if any)
├── middlewares/         # Custom middleware functions
│   └── authentication.js
├── models/              # Database models
│   ├── user.js
│   └── blog.js
├── public/              # Static files
│   ├── css/
│   ├── js/
│   └── uploads/         # Uploaded blog images
├── routes/              # Route definitions
│   ├── user.js
│   └── blog.js
├── services/            # Service layer (if any)
├── views/               # EJS templates
│   ├── partials/        # Reusable components
│   ├── home.ejs
│   ├── blog.ejs
│   ├── addblog.ejs
│   ├── profile.ejs
│   ├── settings.ejs
│   ├── signin.ejs
│   └── signup.ejs
├── index.js             # Main application file
├── package.json
└── README.md
```

## 🔧 Key Features

### Authentication System
- Secure user registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes and middleware

### Blog Management
- Create blog posts with rich content
- Upload and manage cover images
- View individual blog posts
- Responsive blog cards on home page

### User Experience
- Clean, modern interface design
- Responsive layout for all devices
- Professional color scheme
- Smooth animations and transitions

### Settings & Profile
- User profile management
- Password change functionality
- Account settings panel
- User statistics and blog listings

## 🎨 Design Philosophy

Blogify follows a clean, minimalist design approach with:
- **Simple Color Palette**: Gray-scale theme for professional appearance
- **Clean Typography**: Readable fonts and proper hierarchy
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **User-Centered Design**: Intuitive navigation and user experience

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for token storage
- Input validation and sanitization
- Protected routes and middleware

## 📱 Responsive Design

The application is fully responsive and includes:
- Mobile-first design approach
- Flexible grid system using Bootstrap 5
- Touch-friendly interface elements
- Optimized images and content

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Deployment

The application can be deployed on various platforms:
- **Heroku**: Easy deployment with MongoDB Atlas
- **Vercel**: Serverless deployment option
- **DigitalOcean**: VPS deployment
- **AWS**: Cloud deployment with various services

## 📞 Support

If you have any questions or need help with the application, please feel free to:
- Open an issue on GitHub
- Contact the maintainer

## 🙏 Acknowledgments

- Bootstrap team for the amazing CSS framework
- FontAwesome for the beautiful icons
- MongoDB team for the excellent database solution
- Express.js team for the robust web framework

---

**Built with ❤️ by [Mubashir Rao](https://github.com/mubashirrao1122)**
