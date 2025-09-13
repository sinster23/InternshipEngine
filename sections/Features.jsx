import { Users, Target, TrendingUp, Clock, Calendar, BarChart3 } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function () {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  const companies = [
    'Mindtree', 'TCS', 'Wipro', 'Tech Mahindra', 'Instacart', 'Spotify',
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Infosys'
  ];

  const features = [
    {
      icon: <Clock className="w-12 h-12 text-green-600" />,
      value: "7.6",
      label: "more focus time",
      sublabel: "hours/week",
      description: "Smart matching reduces time spent searching for the right internship"
    },
    {
      icon: <Calendar className="w-12 h-12 text-green-600" />,
      value: "2.3",
      label: "fewer unnecessary",
      sublabel: "interviews/week",
      description: "Pre-qualified matches mean better interview-to-offer ratios"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-green-600" />,
      value: "4.5",
      label: "fewer overtime",
      sublabel: "hours/week",
      description: "Efficient matching process saves time for what matters most"
    },
    {
      icon: <Target className="w-12 h-12 text-green-600" />,
      value: "60%",
      label: "less unproductive",
      sublabel: "application switching",
      description: "Focused applications to companies that match your profile"
    }
  ];

  return (
    <>
      {/* Trusted Companies Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-white text-lg font-medium mb-8">
              Where our students get hired - 10,000+ PM internships available
            </h2>
            <div 
              ref={scrollRef}
              className="flex space-x-12 overflow-hidden whitespace-nowrap"
              style={{ scrollBehavior: 'smooth' }}
            >
              {[...companies, ...companies].map((company, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 text-white/80 text-2xl font-bold tracking-wide"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Focus Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-gray-600 text-lg mb-6">
              Deleting meetings doesn't work – you need to prioritize focus time.
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">
              Reclaim <span className="text-green-600">395</span> hours of focus time/user every year
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <div className="text-6xl md:text-7xl font-bold text-green-600 mb-2">
                  {feature.value}
                </div>
                <div className="text-gray-800 font-medium text-lg mb-1">
                  {feature.label}
                </div>
                <div className="text-gray-600 text-sm mb-4">
                  {feature.sublabel}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}