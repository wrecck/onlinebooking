# Resort Booking System

A modern, full-featured online booking system for resorts, hotels, and vacation rentals built with Next.js 15, TypeScript, Tailwind CSS, and Prisma.

![Resort Booking](https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=400&fit=crop)

## Features

### Guest Features
- Browse and search accommodations (rooms, cottages, villas, etc.)
- Real-time availability checking
- Secure booking flow with date selection
- User authentication and account management
- View and manage bookings
- Responsive design for all devices

### Admin Features
- Dashboard with key metrics and analytics
- Accommodation management (CRUD operations)
- Booking management and status updates
- Guest management
- Pricing rules configuration
- Blocked dates management

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Icons:** Lucide React
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Neon/Supabase/Vercel Postgres)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resort-booking.git
cd resort-booking
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/resort_booking"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Seed the database with sample data:
```bash
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── accommodations/     # Accommodation listing and details
│   ├── admin/              # Admin dashboard and management
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── booking/            # Booking flow
│   └── account/            # User account pages
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components (Header, Footer)
│   └── booking/            # Booking-specific components
├── lib/                    # Utility functions and configurations
├── types/                  # TypeScript type definitions
└── generated/              # Prisma generated client
```

## Database Schema

The application uses the following main models:

- **User** - Guest and admin accounts
- **Property** - Resort/hotel information
- **Accommodation** - Rooms, cottages, villas, etc.
- **Booking** - Reservations
- **Payment** - Payment transactions
- **Review** - Guest reviews
- **PricingRule** - Dynamic pricing rules
- **BlockedDate** - Unavailable dates

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/resort-booking)

### Manual Deploy

1. Push your code to GitHub

2. Connect your repository to Vercel

3. Set up environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_URL` - Your production URL (e.g., https://yourapp.vercel.app)
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

4. Deploy!

### Database Setup for Production

We recommend using one of these PostgreSQL providers:

- **[Neon](https://neon.tech)** - Serverless Postgres, great free tier
- **[Supabase](https://supabase.com)** - Postgres + extras, 500MB free
- **[Vercel Postgres](https://vercel.com/storage/postgres)** - Native Vercel integration

## API Endpoints

### Accommodations
- `GET /api/accommodations` - List all accommodations
- `GET /api/accommodations/[slug]` - Get single accommodation
- `GET /api/accommodations/[slug]/availability` - Check availability
- `POST /api/accommodations` - Create accommodation (admin)
- `PATCH /api/accommodations/[slug]` - Update accommodation (admin)
- `DELETE /api/accommodations/[slug]` - Delete accommodation (admin)

### Bookings
- `GET /api/bookings` - List user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get booking details
- `PATCH /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking (admin)

### Authentication
- `POST /api/auth/register` - Register new user
- NextAuth.js handles `/api/auth/*` routes

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | For payments |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | For payments |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@resort.com or create an issue in this repository.
