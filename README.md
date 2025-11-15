# AH Interviews Platform

A full-stack web application for managing company interviews with admin panel and public frontend.

## Features

### Public Routes
- GET / : Homepage with hero image, animated logo bar, NGO feed, MK Studio latest video, About link
- GET /about : Render sanitized HTML from DB
- GET /company/:slug : Company detail and filters for round types
- GET /api/companies, /api/companies/:slug, /api/companies/:slug/videos

### Admin Routes & UI
- Admin login page: POST /api/auth/login (username + password)
- Admin dashboard: Manage companies, videos, NGO posts, mkstudio posts, about content
- NGO post management supports image upload (multipart) -> upload to Cloudinary and store URL in DB
- About editor uses WYSIWYG; save HTML to DB after server-side sanitize

### Admin Panel Modules
- **Company & Videos Management**: Add/edit/delete companies and their interview videos
- **NGO Feed Management**: Post updates with images and captions
- **MK Studio Management**: Manage podcast-related YouTube videos
- **About Me Editor**: Rich text editor for personal profile content
- **Site Settings**: Update hero image, tagline, social links, colors
- **User Management**: Add/remove admin accounts and change passwords

### Security
- Hash passwords with bcrypt
- Rate-limit login endpoint
- Helmet security headers
- CORS restricted to FRONTEND_URL
- Use HttpOnly sameSite cookies for JWTs
- Refresh token rotation

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT for authentication
- bcrypt for password hashing
- Zod for validation

### Frontend
- React with Vite
- Tailwind CSS
- React Router

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Security
JWT_SECRET=your_jwt_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_admin_password

# Server
PORT=3000
CORS_ORIGIN=http://localhost:3002
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Seed the database:
   ```bash
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following models:

- **Users**: id, username, password_hash, role
- **Companies**: id, name, slug, logo_url, short_bio, order_index
- **Videos**: id, company_id, youtube_id, title, round_type, published_at
- **NGO_posts**: id, image_url, caption, posted_at
- **mkstudio_posts**: id, youtube_id, title, description, published_at
- **site_content**: key, value (for about_html, hero_tagline, hero_image_url)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and clear refresh token

### Public Content
- `GET /api/public/companies` - Get all companies (alphabetical order)
- `GET /api/public/companies/:slug` - Get company by slug
- `GET /api/public/about` - Get about page content
- `GET /api/public/hero` - Get hero content
- `GET /api/public/ngo-posts` - Get NGO posts
- `GET /api/public/mkstudio-posts` - Get MK Studio posts
- `GET /api/public/mkstudio-latest` - Get latest MK Studio video

### Admin (Requires Authentication)
- `GET /api/admin/companies` - Get all companies
- `GET /api/admin/companies/:id` - Get company by ID
- `POST /api/admin/companies` - Create new company
- `PUT /api/admin/companies/:id` - Update company
- `DELETE /api/admin/companies/:id` - Delete company
- `GET /api/admin/videos` - Get all videos
- `POST /api/admin/videos` - Create new video
- `PUT /api/admin/videos/:id` - Update video
- `DELETE /api/admin/videos/:id` - Delete video
- `GET /api/admin/ngo-posts` - Get all NGO posts
- `POST /api/admin/ngo-posts` - Create new NGO post
- `PUT /api/admin/ngo-posts/:id` - Update NGO post
- `DELETE /api/admin/ngo-posts/:id` - Delete NGO post
- `GET /api/admin/mkstudio-posts` - Get all MK Studio posts
- `POST /api/admin/mkstudio-posts` - Create new MK Studio post
- `PUT /api/admin/mkstudio-posts/:id` - Update MK Studio post
- `DELETE /api/admin/mkstudio-posts/:id` - Delete MK Studio post
- `GET /api/admin/site-content/:key` - Get site content by key
- `PUT /api/admin/site-content/:key` - Update site content by key
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/password` - Change user password

## Admin Panel Credentials

Default admin credentials:
- Username: `admin`
- Password: `admin123`

To change credentials, update the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables in your `.env` file.

## Development

### Code Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── ...
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    └── ...
```

## Deployment

### Production Environment Variables

For production deployment, ensure you set the following environment variables:

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_secure_jwt_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_admin_password
CORS_ORIGIN=your_frontend_domain
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.