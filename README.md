<div align="center">

# 🌟 BrightMindAid

**Empowering Sri Lankan students with free, community-driven study resources and tools.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Live Demo](https://sithija-jayasinghe.github.io/BrightMindAid) · [Report Bug](https://github.com/sithija-jayasinghe/BrightMindAid/issues) · [Request Feature](https://github.com/sithija-jayasinghe/BrightMindAid/issues)

</div>

---

## 🎯 About The Project

**BrightMindAid** is an open-source web platform designed specifically to democratize education for Sri Lankan students. It provides a centralized, community-driven hub to access, share, and request study materials, including notes, past papers, revision cards, and curated video tutorials.

For recruiters, developers, and potential contributors: This project demonstrates a complete full-stack web application with secure authentication, complex database relationships, storage management, and a highly responsive, modern user interface.

### ✨ Key Features

- **📚 Resource Library:** Browse and search for notes, past papers, marking schemes, and more, efficiently organized by grade, subject, and type.
- **🤝 Community Contributions:** Authenticated users can seamlessly upload and share their own study materials to help others.
- **🙋 Request Board:** Can't find what you need? Request specific notes or resources, and upvote existing requests from peers.
- **📊 Impact Dashboard:** Visualize community impact! Track contributions, global downloads, and fulfilled student requests in real-time.
- **📅 Study Planner:** A built-in tool that allows students to schedule their study sessions and track their progress over time.
- **🗂️ Revision Cards:** Quick-access flashcards specifically tailored for key concepts in major O/L and A/L subjects.
- **📺 Video Tutorials:** Seamlessly curated and embedded YouTube resources specifically suited for the Sri Lankan syllabus.
- **💖 Thank You Wall:** A dedicated space to share gratitude and feedback with active contributors.
- **📱 PWA & Mobile-First:** Installable as a Progressive Web App (PWA) with a fluid, responsive UI built on Tailwind CSS.

---

## 🛠️ Tech Stack & Architecture

BrightMindAid is built with modern web technologies, focusing on performance, scalability, and an exceptional developer experience (DX).

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (for lightning-fast HMR and optimized builds)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (utility-first, responsive design system)
- **Icons:** [Lucide React](https://lucide.dev/) (clean, consistent SVG icons)
- **Routing:** [React Router v7](https://reactrouter.com/) (powerful client-side routing)
- **PWA Capabilities:** `vite-plugin-pwa` for offline support, caching, and mobile installability

### Backend & Database (BaaS)
- **Platform:** [Supabase](https://supabase.com/) (an open-source Firebase alternative)
- **Database:** PostgreSQL (with Row Level Security - RLS for strict data protection)
- **Authentication:** Supabase Auth (Supporting Email/Password and scalable identity management)
- **Storage:** Supabase Storage (for securely hosting uploaded study materials, PDFs, and metadata)

### Infrastructure & Deployment
- **Hosting:** [GitHub Pages](https://pages.github.com/) & [Firebase Hosting](https://firebase.google.com/products/hosting)
- **CI/CD:** Automated builds and static deployments configured via `gh-pages` and modern scripts.

---

## 📂 Project Structure

```text
BrightMindAid/
├── public/                 # Static assets, robots.txt, sitemap
├── src/
│   ├── components/         # Reusable UI components (Header, Footer, Hero, NoteCard, etc.)
│   ├── lib/                # Supabase client configurations and global SEO definitions
│   ├── pages/              # Main application pages (Browse, RequestBoard, etc.)
│   ├── App.jsx             # Main app router and layout configuration
│   └── main.jsx            # React strict mode entry point
├── database_updates.sql    # Incremental database updates
├── supabase_schema.sql     # Core PostgreSQL database schema & RLS policies
├── firebase.json           # Firebase hosting configuration (limits, rewrites & redirects)
├── tailwind.config.js      # Custom theme scaling and brand colors
└── package.json            # Dependencies and npm scripts definitions
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn`

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sithija-jayasinghe/BrightMindAid.git
   cd BrightMindAid
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure your Supabase Project:**
   - Create a new project at [Supabase](https://supabase.com/).
   - Navigate to the SQL Editor and execute the contents of `supabase_schema.sql` (and its updates) to generate the necessary tables and Row Level Security (RLS) policies.
   - Go to Storage and create a new public bucket named `study-materials`.
   - Retrieve your **Project URL** and **anon key** from Project Settings > API.

4. **Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **View the Application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser to see the app live.

---

## ☁️ Deployment

### Standard Static Deployment (GitHub Pages)

The project includes pre-configured scripts for rapid deployment to GitHub Pages.

1. Build the production assets:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder:
   ```bash
   npm run deploy
   ```

### Firebase Hosting

If you prefer Firebase Hosting, ensure you have the Firebase CLI installed (`npm i -g firebase-tools`).

1. Log in to Firebase: `firebase login`
2. Initialize your project: `firebase init hosting`
3. Deploy: `firebase deploy`

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. **Any contributions you make are greatly appreciated!**

If you have a suggestion that would make BrightMindAid better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. (Please see the repository for more specific licensing details if applicable).

---

## 🙏 Acknowledgements

- **[Supabase](https://supabase.com/)** - For providing a reliable and robust backend infrastructure.
- **[React](https://react.dev/)**, **[Vite](https://vitejs.dev/)**, and **[Tailwind CSS](https://tailwindcss.com/)** for an incredible frontend development foundation.
- **[Lucide Icons](https://lucide.dev/)** for gorgeous, consistent iconography.
- **The phenomenal Sri Lankan Student Community**—this project exists for you, and because of you!

<div align="center">
  <p><i>Together We Learn & Together We Grow 🇱🇰</i></p>
</div>
