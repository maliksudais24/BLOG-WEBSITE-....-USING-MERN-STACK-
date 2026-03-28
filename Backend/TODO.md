# Backend Fixes TODO List

## HIGH PRIORITY
- [ ] Fix syntax error in blogmodel.js (extra closing brace in image field)
- [ ] Fix avatar field in usermodel.js
- [ ] Fix export name mismatch in comment-controller.js (cmntcontroler -> commentController)
- [ ] Fix export name mismatch in categore-controller.js (categoreController -> categoryController)
- [ ] Add getBlogById function to Blog-controller.js
- [ ] Add getUserBlogs function to Blog-controller.js (public access)
- [ ] Register blog routes in app.js
- [ ] Register category routes in app.js
- [ ] Remove verifyjwt from sendResetCode/resetPassword in userroute.js
- [ ] Add new blog routes to blogroute.js

## MEDIUM PRIORITY
- [ ] Add error handling to createBlog function
- [ ] Add deleteComment function to comment-controller.js
- [ ] Add updateComment function to comment-controller.js
- [ ] Add deleteCategory function to categore-controller.js
- [ ] Add updateCategory function to categore-controller.js
- [ ] Add validation to comment/category controllers

## LOW PRIORITY
- [ ] Add pagination to getAllBlogs
- [ ] Add uniqueness validation for category names
- [ ] Test all endpoints with database
