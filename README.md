# B A D R — Premium E-Commerce Platform

A high-performance, minimalist e-commerce web application built for a Moroccan streetwear brand. Designed with a clean, high-fashion aesthetic inspired by Spanish minimalism.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & React Server Components)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons:** [Lucide React](https://lucide.dev/)

## ✨ Key Features

- **Responsive Minimalist UI:** A sleek, image-forward design that perfectly adapts to mobile and desktop screens.
- **Dynamic Catalog:** Browse products by categories with real-time stock status.
- **WhatsApp Integration:** Direct order system routing customers to WhatsApp for sizing advisory and fast-track orders.
- **Shopping Bag & Local State:** Persistent cart state using React Context.
- **Admin Dashboard:** Secure, PIN-protected dashboard (`/admin`) to add products, manage inventory, and track orders directly connected to the database.
- **Cash on Delivery:** Built-in checkout form tailored for Moroccan Cash on Delivery workflows.

## 🛠️ Local Development Setup

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Clone and Install
```bash
# Install dependencies
npm install
```

### 3. Database Setup (Supabase)
1. Create a free project on [Supabase](https://supabase.com).


### 4. Environment Variables
Create a `.env` file in the root of the project and add your Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 5. Run the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result!


## 🚀 Deployment
This project is fully optimized to be deployed instantly on [Vercel](https://vercel.com). Simply push the repository to GitHub and connect it to a new Vercel project for a free, high-speed global deployment.
