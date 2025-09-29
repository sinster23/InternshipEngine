import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Testimonials() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const hoveredRef = useRef(false);

  const SPEED_PX_PER_SEC = 40; // pixels per second — tweak this

  const testimonials = [
    { name: "Sarah Chen", role: "PM Intern at Google", content: "This platform helped me land my dream internship! The matching system is incredibly accurate and the support team was amazing throughout the process.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c14c?w=150&h=150&fit=crop&crop=face" },
    { name: "Alex Rodriguez", role: "PM Intern at Meta", content: "Amazing experience. The recommendations were spot-on and the application process was seamless. Couldn't have asked for better guidance.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { name: "Emily Zhang", role: "PM Intern at Microsoft", content: "Found the perfect internship match in just 2 weeks. The platform's AI matching is truly revolutionary. Highly recommend!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    { name: "Marcus Johnson", role: "PM Intern at Amazon", content: "The personalized approach made all the difference. Got multiple offers and found my ideal role with their expert guidance.", rating: 5, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { name: "Priya Patel", role: "PM Intern at Apple", content: "Incredible platform! The mentorship program and interview prep were game-changers. Thank you for making my dreams come true!", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
    { name: "David Kim", role: "PM Intern at Netflix", content: "The most comprehensive internship platform I've used. From application to offer, everything was handled professionally.", rating: 5, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" }
  ];

  // duplicate for seamless loop
  const loopItems = [...testimonials, ...testimonials];

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Wait for images to load so width measurement is accurate
    const imgs = content.querySelectorAll("img");
    const imgPromises = Array.from(imgs).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((res) => {
        img.onload = img.onerror = res;
      });
    });

    let running = true;

    const calcLoopWidth = () => {
      // loop width is width of one set (half of duplicated content)
      const total = content.scrollWidth;
      loopWidthRef.current = total / 2;
      // if loopWidth is <= container width, center and don't animate
      if (loopWidthRef.current <= container.clientWidth) {
        offsetRef.current = 0;
        content.style.transform = `translateX(0px)`;
        return false;
      }
      return true;
    };

    const start = async () => {
      await Promise.all(imgPromises);
      const shouldAnimate = calcLoopWidth();

      if (!shouldAnimate) return; // nothing to animate

      lastTimeRef.current = performance.now();
      offsetRef.current = 0;

      const step = (now) => {
        if (!running) return;
        const dt = now - (lastTimeRef.current || now);
        lastTimeRef.current = now;

        if (!hoveredRef.current) {
          // advance offset based on elapsed time
          offsetRef.current += (SPEED_PX_PER_SEC * dt) / 1000;

          // wrap offset to keep it in [0, loopWidth)
          if (offsetRef.current >= loopWidthRef.current) {
            offsetRef.current -= loopWidthRef.current;
          }

          // translate negative to move content left
          // also use translate3d for better GPU optimization
          content.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }

        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
    };

    start();

    // Pause on hover/touch
    const onEnter = () => { hoveredRef.current = true; };
    const onLeave = () => { hoveredRef.current = false; lastTimeRef.current = performance.now(); };
    const onTouchStart = () => { hoveredRef.current = true; };
    const onTouchEnd = () => { hoveredRef.current = false; lastTimeRef.current = performance.now(); };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    // Recalculate on resize
    const onResize = () => {
      calcLoopWidth();
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, []); // run once

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Success Stories</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Hear from students who landed their dream PM internships through our platform.</p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

          {/* container (overflow hidden) */}
          <div ref={containerRef} className="w-full overflow-hidden">
            {/* content (translateX applied here) */}
            <div ref={contentRef} className="flex gap-6 will-change-transform">
              {loopItems.map((t, i) => (
                <div key={i} className="flex-shrink-0 w-80 bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-gray-600 group">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <img loading="lazy" src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover border-4 border-gray-600 group-hover:border-blue-400 transition-colors duration-300" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-white font-semibold text-lg">{t.name}</div>
                      <div className="text-blue-400 text-sm font-medium">{t.role}</div>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, k) => <Star key={k} className="w-5 h-5 text-yellow-400 fill-current" />)}
                  </div>

                  <p className="text-gray-300 leading-relaxed text-sm">"{t.content}"</p>

                  <div className="mt-6 flex justify-end">
                    <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-blue-400 text-lg mb-6">Ready to write your own success story?</p>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">Get Started Today</button>
        </div>
      </div>
    </section>
  );
}