import { CheckCircle } from 'lucide-react';

export default function InternshipTimeline() {
  const timelineData = [
    {
      day: "Today",
      title: "Start Your Journey",
      color: "bg-blue-100 text-blue-800",
      items: [
        "Profile matching begins instantly",
        "AI starts analyzing your skills and preferences", 
        "Access to curated internship opportunities"
      ]
    },
    {
      day: "Day 7", 
      title: "Optimized Matching",
      color: "bg-yellow-100 text-yellow-800",
      items: [
        "AI optimizes 30% more relevant internship matches",
        "Applications automatically prioritize best-fit companies",
        "Interview preparation resources unlock"
      ]
    },
    {
      day: "Day 30",
      title: "Maximum Results",
      color: "bg-green-100 text-green-800", 
      items: [
        "Match quality increases by 60%",
        "Interview success rate improves by 25%",
        "Career trajectory optimization completes"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Land your dream internship in <span className="text-green-600">30 days</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our AI-powered platform accelerates your internship search with smart matching and personalized recommendations
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line - positioned relative to the day badges */}
          <div className="absolute top-6 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-yellow-400 to-green-400 rounded-full hidden md:block z-10"></div>
          
          <div className="grid md:grid-cols-3 gap-6 relative">
            {timelineData.map((phase, index) => (
              <div key={index} className="relative">
                {/* Day Badge positioned on top of the line */}
                <div className="relative mb-6 flex justify-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold relative z-30 bg-white border-2 ${phase.color.includes('blue') ? 'border-blue-400' : phase.color.includes('yellow') ? 'border-yellow-400' : 'border-green-400'}`}>
                    {phase.day}
                  </div>
                </div>
                
                {/* Timeline Card */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                  {/* Phase Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {phase.title}
                  </h3>
                  
                  {/* Features List */}
                  <div className="space-y-4">
                    {phase.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl">
              Start Your Journey
            </button>
            <button className="text-green-600 hover:text-green-700 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:border-green-700 transition-colors duration-200">
              Explore Success Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}