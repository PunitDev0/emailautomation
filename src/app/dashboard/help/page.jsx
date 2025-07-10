export default function HelpPage() {
    return (
      <div className="p-6 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Help & Support</h1>
  
          <div className="space-y-6">
            <div className="border border-white/20 bg-black p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Getting Started</h2>
              <div className="space-y-3 text-gray-300">
                <p>Welcome to Mail Automation Tool! Here's how to get started:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Configure your SMTP settings in the Settings page</li>
                  <li>Import your subscribers or add them manually</li>
                  <li>Create segments to organize your audience</li>
                  <li>Choose from pre-built templates for your campaigns</li>
                  <li>Set up automation workflows to engage subscribers</li>
                </ul>
              </div>
            </div>
  
            <div className="border border-white/20 bg-black p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium">How do I import subscribers?</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Go to the Subscribers page and click "Import". You can upload an Excel file (.xlsx) with columns for
                    name, email, and tags.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium">Can I schedule campaigns?</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Yes! When creating a campaign, choose "Schedule" and set your desired date and time.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium">How do automation workflows work?</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Automation workflows let you create triggered email sequences. For example, send a welcome email when
                    someone subscribes, then follow up after a few days.
                  </p>
                </div>
              </div>
            </div>
  
            <div className="border border-white/20 bg-black p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Contact Support</h2>
              <p className="text-gray-300 mb-4">Need help? Get in touch with our support team:</p>
              <div className="space-y-2 text-gray-300">
                <p>Email: support@mailautomation.com</p>
                <p>Phone: 1-800-MAIL-HELP</p>
                <p>Hours: Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  