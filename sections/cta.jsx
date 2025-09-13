import { ArrowRight } from "lucide-react";

export default function PMCareerSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#151f8b] via-[#5562eb] to-[#707bf6]">
      <div className="max-w-4xl mx-50 text-left">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
          Ready to Launch Your PM Career?
        </h2>
        <p className="text-lg text-white/80 mb-4 font-light">
          Join thousands of students who have already found their perfect internship match.
        </p>
        
        {/* Feature checkmarks */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-12 text-white/90">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">100% success rate</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">No application fees</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Personal career guidance</span>
          </div>
        </div>

        <button className="bg-white hover:bg-gray-50 text-indigo-600 px-6 py-3 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-xl">
          Start Your Journey Today
        </button>
      </div>
    </section>
  );
}