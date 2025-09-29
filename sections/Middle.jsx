import { Users, Target, TrendingUp, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';

export default function () {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Target,
      title: "AI-Powered Matching Algorithm",
      description: "Our advanced AI analyzes your profile, skills, and preferences to match you with the most relevant PM internships at top companies."
    },
    {
      icon: Users,
      title: "Exclusive Company Partnerships",
      description: "Access internships at Google, Meta, Stripe, and other top companies through our exclusive partnership network."
    },
    {
      icon: TrendingUp,
      title: "Real-time Application Tracking",
      description: "Track your applications in real-time with detailed analytics and insights to improve your success rate."
    }
  ];

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Full Width Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 whitespace-nowrap">
              Why choose our <span className="text-blue-400">AI platform?</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Get matched with top PM internships using advanced AI algorithms that understand your skills, preferences, and career goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const isActive = activeFeature === index;
                
                return (
                  <div
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`rounded-xl p-6 transform transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      isActive
                        ? 'bg-gray-800 border-2 border-gray-600'
                        : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          isActive
                            ? 'bg-blue-600'
                            : 'bg-gray-600 group-hover:bg-blue-600'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                            isActive
                              ? 'text-white'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className={`transition-colors duration-300 ${
                            isActive
                              ? 'text-gray-300'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Image/GIF Section */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-700">
                {/* Placeholder for your GIF */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-600">
                  <img 
                    src="/og.gif" 
                    alt="AI matching process visualization"
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Floating elements for visual interest */}
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                  <Star className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}