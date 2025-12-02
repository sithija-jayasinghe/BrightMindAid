import { useEffect } from 'react';

// SEO configurations for each page
const seoConfig = {
  home: {
    title: 'BrightMindAid | Free Study Notes & Past Papers for Sri Lankan Students',
    description: 'Disaster support for students in Sri Lanka. Access free study notes, past papers & textbooks shared by our community. Helping students rebuild & succeed.'
  },
  browse: {
    title: 'Browse Study Materials | BrightMindAid',
    description: 'Browse free study notes, past papers, and textbooks by grade level. Find O/L and A/L materials for all subjects in Sinhala, Tamil & English.'
  },
  requests: {
    title: 'Request Study Materials | BrightMindAid',
    description: 'Can\'t find what you need? Request specific study materials and let our community help. Post requests for notes, past papers, or any educational content.'
  },
  videos: {
    title: 'Free Video Tutorials | BrightMindAid',
    description: 'Watch free educational video tutorials for O/L and A/L subjects. Learn from curated YouTube content covering Maths, Science, and more.'
  },
  planner: {
    title: 'Study Planner | BrightMindAid',
    description: 'Plan your study schedule effectively. Create tasks, set goals, and track your progress with our free study planner tool.'
  },
  revision: {
    title: 'Revision Flashcards | BrightMindAid',
    description: 'Create and study with flashcards. Effective revision tool for O/L and A/L exam preparation with spaced repetition learning.'
  },
  impact: {
    title: 'Our Impact | BrightMindAid',
    description: 'See how BrightMindAid is helping Sri Lankan students. Track downloads, uploads, and community contributions to education.'
  },
  thanks: {
    title: 'Thank You Notes | BrightMindAid',
    description: 'Read heartfelt messages from students and contributors. Share your gratitude with the BrightMindAid community.'
  }
};

/**
 * Custom hook to update page title and meta description
 * @param {string} page - The page key from seoConfig
 * @param {object} custom - Optional custom title/description overrides
 */
export function useSEO(page, custom = {}) {
  useEffect(() => {
    const config = seoConfig[page] || seoConfig.home;
    const title = custom.title || config.title;
    const description = custom.description || config.description;

    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    // Update Twitter tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }

    // Cleanup - reset to home when unmounting
    return () => {
      document.title = seoConfig.home.title;
    };
  }, [page, custom.title, custom.description]);
}

export default useSEO;
