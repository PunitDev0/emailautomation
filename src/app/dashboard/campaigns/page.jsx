import Image from "next/image";

export default function CampaignsSection() {
  return (
    <section className="min-h-screen bg-black text-white flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Overlay with Gradient */}
      <div className="absolute  bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-95 z-0" />

      {/* Main Content */}
      <div className="max-w-7xl w-full relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-white tracking-tight text-center md:text-left">
          Campaigns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Campaign Card */}
          <div
            className="bg-black shadow-white p-6 rounded-xl shadow-sm w-full transform hover:shadow-2xl transition-shadow duration-300"
            role="region"
            aria-labelledby="campaign-card"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <p className="text-sm text-gray-400 font-medium">Company</p>
                <p className="text-sm text-gray-500">About | News | Shop</p>
              </div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium w-full sm:w-auto"
                aria-label="Edit campaign"
              >
                Edit
              </button>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg mb-6 overflow-hidden">
              <Image
                src="/assets/campaign-preview.png"
                alt="Campaign preview image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-auto"
                priority
              />
            </div>
            <div className="text-sm text-gray-300 space-y-4">
              <input
                type="text"
                placeholder="Write your title here"
                className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none focus:border-green-500 transition-colors duration-200 py-2"
                aria-label="Campaign title input"
              />
              <p className="text-xs text-gray-400 leading-relaxed">
                Start typing to create your newsletter. Drag and drop new blocks from the sidebar to customize your campaign!
              </p>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium w-full sm:w-auto"
                aria-label="Preview campaign"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Instructions Card */}
          <div
            className="bg-black shadow-white p-6 rounded-xl shadow-sm w-full transform hover:shadow-2xl transition-shadow duration-300"
            role="region"
            aria-labelledby="instructions-card"
          >
            <h3 id="instructions-card" className="text-2xl font-semibold mb-4 text-white">
              Create Your First Campaign
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Design a stunning campaign in minutes with any editor, then supercharge it with these advanced features.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-3 text-sm">
              <li>A/B testing to optimize your campaign performance</li>
              <li>Auto-resend for higher open rates</li>
              <li>RSS campaigns for automated content updates</li>
              <li>Pre-designed templates tailored to your goals</li>
              <li>Surveys, dynamic content, and social media blocks for engagement</li>
            </ul>
            <button
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 mt-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium w-full sm:w-auto"
              aria-label="Start creating a campaign"
            >
              Start Creating
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}