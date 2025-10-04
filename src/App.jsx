import React, { useState, useEffect } from 'react';
import SiteLoader from './sections/SiteLoader';
import LandingPage from './sections/LandingPage';
import LamboScroll from './sections/LamboScroll';
import LamboCrousel from './sections/LamboCrousel.jsx';
import Footer from './sections/Footer';
const App = () => {
  // A single state to manage the loading status of the entire application.
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs whenever 'isLoading' changes to control the body scroll.
  useEffect(() => {
    if (isLoading) {
      // Disable scroll when the loader is active.
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll once the main content is visible.
      document.body.style.overflow = 'auto';
    }

    // A cleanup function to ensure scrolling is always re-enabled if the component unmounts.
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  // Listen for the loader complete event
  useEffect(() => {
    const handleLoaderComplete = () => setIsLoading(false);
    window.addEventListener('loaderComplete', handleLoaderComplete);
    return () => window.removeEventListener('loaderComplete', handleLoaderComplete);
  }, []);

  // --- SECTION 1: SITE LOADER ---
  // While isLoading is true, only the SiteLoader is rendered.
  if (isLoading) {
    return <SiteLoader />;
  }

  // --- SECTION 2: MAIN SITE CONTENT ---
  // Once isLoading is false, the loader is removed, and the main site content is rendered.
  return (
    <>
      <main className="w-full">
        <LandingPage />
        <LamboScroll />
        <LamboCrousel/>
        {/* You can add other site sections here */}
      </main>
      <Footer />
    </>
  );
};

export default App;
