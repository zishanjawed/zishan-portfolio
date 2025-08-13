import { generateHomePageMetadata } from "../../lib/seo/metadata";
import { PersonStructuredData } from "../../components/seo/person-schema";
import { PerformanceMonitor } from "../../components/analytics/performance-monitor";
import type { Metadata } from "next";

export const metadata: Metadata = generateHomePageMetadata();

export default function Home() {
  return (
    <>
      <PersonStructuredData />
      <PerformanceMonitor pageName="home" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              Zishan Jawed
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8">
              Backend Engineer & Fintech Specialist
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
              I build scalable, high-performance systems for fintech and ecommerce companies. 
              Expert in Node.js, Python, microservices, and cloud architecture with a focus on 
              payment processing and real-time analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Projects
              </a>
              <a
                href="/writing"
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Read Articles
              </a>
              <a
                href="/contact"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get in Touch
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Backend Engineering
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Building scalable microservices, APIs, and data processing systems with Node.js, Python, and cloud technologies.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Fintech Solutions
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Specialized in payment processing platforms, financial APIs, and secure transaction systems with PCI DSS compliance.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Cloud Architecture
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Designing and implementing cloud-native solutions with AWS, Docker, Kubernetes, and infrastructure-as-code.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
