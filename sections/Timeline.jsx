import { CheckCircle } from 'lucide-react';

export default function InternshipTimeline() {
  const timelineData = [
    {
      day: "Today",
      title: "Start Your Journey",
      color: "bg-gray-700 text-blue-400",
      items: [
        "Profile matching begins instantly",
        "AI starts analyzing your skills and preferences", 
        "Access to curated internship opportunities"
      ]
    },
    {
      day: "Day 7", 
      title: "Optimized Matching",
      color: "bg-gray-700 text-yellow-400",
      items: [
        "AI optimizes 30% more relevant internship matches",
        "Applications automatically prioritize best-fit companies",
        "Interview preparation resources unlock"
      ]
    },
    {
      day: "Day 30",
      title: "Maximum Results",
      color: "bg-gray-700 text-green-400", 
      items: [
        "Match quality increases by 60%",
        "Interview success rate improves by 25%",
        "Career trajectory optimization completes"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Land your dream internship in <span className="text-blue-400">30 days</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
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
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold relative z-30 bg-gray-800 border-2 ${phase.color.includes('blue') ? 'border-blue-400' : phase.color.includes('yellow') ? 'border-yellow-400' : 'border-green-400'}`}>
                    <span className="text-white">{phase.day}</span>
                  </div>
                </div>
                
                {/* Timeline Card */}
                <div className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-700 hover:border-gray-600">
                  {/* Phase Title */}
                  <h3 className="text-xl font-bold text-white mb-6">
                    {phase.title}
                  </h3>
                  
                  {/* Features List */}
                  <div className="space-y-4">
                    {phase.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl">
              Start Your Journey
            </button>
            <button className="text-blue-400 hover:text-blue-300 px-8 py-3 rounded-lg font-semibold border-2 border-blue-400 hover:border-blue-300 transition-colors duration-200">
              Explore Success Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}