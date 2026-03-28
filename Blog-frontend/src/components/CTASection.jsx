import { useState, useEffect } from 'react';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* CTA Content - Fade in + Slide up */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Main Heading */}
          <h2 className="text-5xl md:text-4xl font-bold mb-6 transition-all duration-700 delay-100 ease-out transform drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Want to Share Your Story?
          </h2>

          {/* Subtext */}
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg transition-all duration-700 delay-200 ease-out">
            Join thousands of writers and share your insights with our growing community.
          </p>

          {/* Start Writing Button */}
          <button
            onClick={() => window.location.href = '/write'}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 hover:scale-105 active:scale-95 border border-purple-500 shadow-lg shadow-purple-500/25"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s ease-out',
              transitionDelay: '300ms',
            }}
          >
            Start Writing
          </button>
        </div>
      </div>
    </section>
  );
}

