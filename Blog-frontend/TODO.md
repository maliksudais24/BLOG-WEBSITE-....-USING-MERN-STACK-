\ 
- [x] 5. Fix API endpoint paths to match backend (/blog and /category)
- [x] 6. Add category filtering with purple highlighting in Home.jsx
- [x] 7. Update BlogPosts.jsx to filter by selected category

## Status: Completed ✓

### Summary
All components have been implemented and fixed:

1. **api.js** - Fixed API endpoints to match backend:
   - `/blog/*` instead of `/api/blogs/*`
   - `/category` instead of `/api/categories`
   
2. **Write.jsx** - Blog creation form with:
   - Title, content, image upload, category selection
   - Fetches categories from `/category` endpoint
   - Uploads blog as multipart/form-data
   
3. **App.jsx** - Added route for `/write`

4. **BlogPosts.jsx** - Updated to:
   - Fetch real blogs from API
   - Accept `selectedCategory` prop for filtering
   - Filter displayed blogs based on category selection

5. **Home.jsx** - Category filtering added:
   - Fetches categories from API
   - "All" button shows all blogs
   - Selected category button highlights in purple
   - Passes `selectedCategory` to BlogPosts

### Note
Make sure:
1. Backend server is running on `http://localhost:3000`
2. Categories exist in the database (you may need to create some via POST /category/create)
3. Frontend runs on `http://localhost:5173`


