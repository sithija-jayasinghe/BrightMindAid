
# BrightMindAid

> Empowering Sri Lankan students with free, community-driven study resources and tools.

## Overview

BrightMindAid is an open-source web platform designed to help Sri Lankan students access, share, and request study materials, including notes, past papers, revision cards, and video tutorials. The platform fosters a collaborative learning environment, enabling students and educators to contribute and benefit from a growing repository of educational content.

## Features

- **Browse & Search Study Materials:** Find notes, past papers, marking schemes, and more, organized by grade, subject, and type.
- **Upload & Share:** Easily upload your own study materials to help others.
- **Request Board:** Request specific notes or resources and upvote requests from others.
- **Impact Dashboard:** Visualize community contributions, downloads, and fulfilled requests.
- **Study Planner:** Plan your study schedule and track progress.
- **Revision Cards:** Quick-access flashcards for key concepts in major subjects.
- **Video Tutorials:** Curated YouTube resources for O/L and A/L students.
- **Thank You Wall:** Share gratitude and feedback with contributors.
- **Mobile-Friendly & Fast:** Built with React, Vite, and Tailwind CSS for a modern, responsive experience.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage)
- **Other Integrations:** Firebase Hosting (optional), GitHub Pages (for static deploy), ESLint, PWA support

## Project Structure

```
src/
  components/      # Reusable UI components (Header, Footer, Hero, NoteCard, etc.)
  lib/             # Supabase client, SEO hooks
  pages/           # Main app pages (Browse, RequestBoard, ImpactDashboard, etc.)
  App.jsx          # Main app router and layout
  main.jsx         # App entry point
public/            # Static assets, robots.txt, sitemap
supabase_schema.sql# Database schema for Supabase
firebase.json      # Firebase hosting config (optional)
vite.config.js     # Vite build config
tailwind.config.js # Tailwind CSS config
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase account (for backend)

### Setup
1. **Clone the repository:**
	```sh
	git clone https://github.com/sithija-jayasinghe/BrightMindAid.git
	cd BrightMindAid
	```
2. **Install dependencies:**
	```sh
	npm install
	# or
	yarn install
	```
3. **Configure Supabase:**
	- Create a new project at [Supabase](https://supabase.com/).
	- Run the SQL in `supabase_schema.sql` in your Supabase SQL editor to set up tables and policies.
	- Create a storage bucket named `study-materials`.
	- Copy your Supabase URL and anon key into `src/lib/supabase.js` (or use environment variables for production).
4. **Start the development server:**
	```sh
	npm run dev
	# or
	yarn dev
	```
5. **Open [http://localhost:5173](http://localhost:5173) in your browser.**

### Deployment
- **Static Hosting:** The app can be deployed to Firebase Hosting, GitHub Pages, Vercel, or Netlify.
- **Build for production:**
  ```sh
  npm run build
  ```
- **Deploy:**
  - For Firebase: see `firebase.json` and follow Firebase Hosting docs.
  - For GitHub Pages: `npm run deploy` (see `homepage` in `package.json`).

## Contributing

Contributions are welcome! You can help by:
- Reporting bugs or suggesting features via [GitHub Issues](https://github.com/sithija-jayasinghe/BrightMindAid/issues)
- Submitting pull requests for code, documentation, or new study materials
- Sharing the project with students and educators

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Supabase](https://supabase.com/) for the backend platform
- [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- All contributors and the Sri Lankan student community

---

*Together We Learn & Together We Grow*
