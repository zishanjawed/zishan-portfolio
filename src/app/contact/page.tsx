import { Metadata } from 'next';
import { ContactForm } from '../../../components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact - Zishan Jawed',
  description: 'Get in touch with Zishan Jawed for professional opportunities, collaborations, or just to say hello.',
  openGraph: {
    title: 'Contact - Zishan Jawed',
    description: 'Get in touch with Zishan Jawed for professional opportunities, collaborations, or just to say hello.',
    type: 'website',
  },
};

export default function ContactPage() {
  // In production, this would come from environment variables
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            I'm always interested in hearing about new opportunities, interesting projects, 
            or just connecting with fellow developers. Feel free to reach out!
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                <a 
                  href="mailto:dev.zishan@gmail.com" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  dev.zishan@gmail.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">India (Remote, IST / UTC+5:30)</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
              <p className="text-gray-600">Available for full-time and freelance opportunities</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600">Usually within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Send a Message
          </h2>
          <ContactForm siteKey={turnstileSiteKey} />
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            I typically respond to all messages within 24 hours. 
            For urgent matters, please mention it in your subject line.
          </p>
        </div>
      </div>
    </div>
  );
} 