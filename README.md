# Mini CMS - Laravel 11 + React Vite

A modern, feature-rich Content Management System built with Laravel 11 and React Vite, offering a robust solution for content publishing and website management.

## Features

### Content Management

-   Create and manage posts with scheduled publishing
-   Advanced image optimization system for uploaded content
-   Banner management system with scheduling capabilities for promotional content
-   Public-facing website optimized for SEO performance

### Security & Administration

-   Granular role-based permission system
-   IP blocking system for enhanced security
-   Web communication management system
-   Password recovery functionality

### Technical Highlights

-   Built with Laravel 11 and React Vite
-   Scheduled tasks for automated post and banner publishing
-   Image optimization for better performance
-   SEO-ready public website

## Requirements

-   PHP 8.2 or higher
-   Node.js 18 or higher
-   MySQL/PostgreSQL
-   Composer
-   npm or yarn

## Installation

1. Clone the repository

```bash
git clone [repository-url]
cd mini-cms
```

2. Install PHP dependencies

```bash
composer install
```

3. Install JavaScript dependencies

```bash
npm install
# or
yarn install
```

4. Configure environment variables

```bash
cp .env.example .env
php artisan key:generate
```

5. Set up the database

```bash
php artisan migrate
```

6. Build frontend assets

```bash
npm run build
# or
yarn build
```

## Configuration

### Scheduled Tasks

The system includes scheduler commands for automated publishing of posts and banners. Add the following Cron entry to your server:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### Image Optimization

Configure image optimization settings in the `.env` file:

```env
IMAGE_OPTIMIZATION_QUALITY=80
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
```

## Usage

### Development

```bash
# Run Laravel development server
php artisan serve

# Run Vite development server
npm run dev
# or
yarn dev
```

### Production

```bash
npm run build
# or
yarn build
```

## Security Features

### IP Blocking System

-   Configurable IP blocking rules
-   Automatic blocking for suspicious activities
-   Whitelist/blacklist management

### Role-based Permissions

-   Granular access control
-   Custom role creation
-   Permission inheritance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For any inquiries or questions about this project, please contact:

-   Email: angel.ccapb@gmail.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.
