import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Home,
  BarChart3,
  Calendar,
  Clock,
  Zap,
  Settings,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Cloud,
  Shield,
  Grid3x3
} from 'lucide-react';
import { appConfig } from './appConfig';
import { Link } from 'react-router';

const MedExtractDocumentation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');


  useEffect(() => {

    document.title = "Documentation | " + appConfig.appName.first + appConfig.appName.second + " | Personic Health"
    
  }, []);
  const navigationItems = [
    { id: 'overview', text: 'Overview', icon: Home },
    { id: 'features', text: 'Key Features', icon: BarChart3 },
    { id: 'order-types', text: 'Order Types & Date Rules', icon: Calendar },
    { id: 'step-by-step', text: 'How to Use MedExtract', icon: Clock },
    { id: 'monday-integration', text: 'Monday.com Integration', icon: Zap },
    { id: 'notes', text: 'Notes & Best Practices', icon: Settings },
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="fixed top-0 w-full z-40 bg-black border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 hover:bg-[#151517] rounded-lg transition"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#141415] rounded-lg">
                  {/* <BarChart3 className="text-white" size={24} /> */}
                  <img src='./favicon.png' className='w-[24px]' />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg text-green-600">
                    {appConfig.appName.first}{appConfig.appName.second}
                  </h1>
                </div>
                <Link to='/'>Home</Link>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
              {appConfig.version}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-30 w-80 bg-black border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } mt-16 lg:mt-0`}
        >
          <div className="p-6 border-b flex items-center gap-3 border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-[#151517] border border-gray-700 rounded-lg">
               <img src='./favicon.png' className='w-[20px]' />
              </div>
              <div>
                <h2 className="text-white font-bold">{appConfig.appName.first}{appConfig.appName.second}</h2>
                <p className="text-gray-400 text-xs">Documentation</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold inline-block">
              {appConfig.version}
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-[#151517] border-l-4 border-green-600 text-white'
                      : 'text-gray-400 hover:bg-[#151517]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium text-left">{item.text}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div className="p-8 bg-[#151517] border border-gray-800 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-600/20 rounded-xl">
                      <BarChart3 className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Overview</h2>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    MedExtract is an advanced data processing and parsing platform designed to extract, 
                    normalize, and structure patient order records from EMR systems with{' '}
                    <span className="text-green-600 font-bold">
                      99.9% accuracy
                    </span>.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    The platform ensures reliable, consistent, and audit-ready data that can be seamlessly 
                    integrated into downstream systems such as analytics dashboards and workflow management tools.
                  </p>
                  
                  <div className="mt-8 p-4 bg-[#09090a] border border-gray-700 rounded-xl">
                    <p className="text-gray-200">
                      <strong className="text-green-600">MedExtract v4.7.5</strong> focuses on high-precision parsing of{' '}
                      <strong className="text-green-600">Patient Orders</strong>, enabling healthcare teams to efficiently process{' '}
                      <strong className="text-green-600">Ancillary</strong>, <strong className="text-green-600">Ultramist</strong>, and{' '}
                      <strong className="text-green-600">Surgical</strong> orders with minimal manual intervention.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-[#151517] border border-gray-800 rounded-xl hover:shadow-lg hover:shadow-green-600/20 transition-all transform hover:scale-105">
                    <div className="bg-green-600 p-4 rounded-full w-fit mx-auto mb-4">
                      <CheckCircle className="text-white" size={32} />
                    </div>
                    <h3 className="font-bold text-white text-center">99.9% Accuracy</h3>
                    <p className="text-gray-400 text-center mt-2 text-sm">Industry-leading extraction</p>
                  </div>

                  <div className="p-6 bg-[#151517] border border-gray-800 rounded-xl hover:shadow-lg hover:shadow-green-600/20 transition-all transform hover:scale-105">
                    <div className="bg-green-600 p-4 rounded-full w-fit mx-auto mb-4">
                      <Grid3x3 className="text-white" size={32} />
                    </div>
                    <h3 className="font-bold text-white text-center">Seamless Integration</h3>
                    <p className="text-gray-400 text-center mt-2 text-sm">Works with Monday.com</p>
                  </div>

                  <div className="p-6 bg-[#151517] border border-gray-800 rounded-xl hover:shadow-lg hover:shadow-green-600/20 transition-all transform hover:scale-105">
                    <div className="bg-green-600 p-4 rounded-full w-fit mx-auto mb-4">
                      <Cloud className="text-white" size={32} />
                    </div>
                    <h3 className="font-bold text-white text-center">Automated Processing</h3>
                    <p className="text-gray-400 text-center mt-2 text-sm">Minimal manual work</p>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            {activeSection === 'features' && (
              <div className="space-y-8">
                <div className="p-8 bg-[#151517] border border-gray-800 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-600/20 rounded-xl">
                      <BarChart3 className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Key Features</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'High-accuracy EMR data parsing', desc: '99.9% accuracy rate' },
                      { title: 'Automated order classification', desc: 'Ancillary, Ultramist, Surgical' },
                      { title: 'State-based data validation', desc: 'FL, MD, KY and more' },
                      { title: 'Ready-made dashboard views', desc: 'Processed data visualization' },
                      { title: 'CSV export', desc: 'Third-party integrations' },
                      { title: 'Monday.com integration', desc: 'Seamless workspace import' },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start p-6 bg-[#09090a] rounded-xl border border-gray-700 hover:border-green-600/50 transition-all">
                        <div className="bg-green-600/20 p-3 rounded-lg mr-4 flex-shrink-0">
                          <span className="text-green-600 font-bold text-lg">✓</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{feature.title}</h3>
                          <p className="text-gray-400 mt-1 text-sm">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Order Types Section */}
            {activeSection === 'order-types' && (
              <div className="space-y-8">
                <div className="p-8 bg-[#151517] border border-gray-800 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-600/20 rounded-xl">
                      <Calendar className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Order Types & Date Rules</h2>
                  </div>
                  
                  <div className="mb-8 p-4 bg-green-900/20 border border-green-700 rounded-xl">
                    <p className="text-green-100">
                      <strong>Important:</strong> Selecting an incorrect date range may result in missing or incomplete data.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#09090a] border-b border-gray-700">
                          <th className="text-green-600 font-bold text-left p-4">Order Type</th>
                          <th className="text-green-600 font-bold text-left p-4">Start Date Rule</th>
                          <th className="text-green-600 font-bold text-left p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { type: 'Ancillary', date: 'June 30, 2025 onward' },
                          { type: 'Ultramist', date: 'May 5, 2025 onward' },
                          { type: 'Surgical', date: 'January 1, 2025 onward' },
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30">
                            <td className="text-gray-200 p-4">
                              <span className="inline-block px-3 py-1 rounded-full text-white font-semibold text-sm bg-green-600">
                                {row.type}
                              </span>
                            </td>
                            <td className="text-gray-300 p-4">{row.date}</td>
                            <td className="p-4">
                              <span className="inline-block px-3 py-1 rounded-full text-white font-semibold text-sm bg-green-700">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-gray-400 mt-8 p-4 bg-[#09090a] rounded-lg border border-gray-700">
                    When generating pending order reports from the EMR (WoundExpert), ensure the correct 
                    <strong className="text-gray-200"> start date</strong> is selected based on the order type.
                  </p>
                </div>
              </div>
            )}

            {/* Step-by-Step Section */}
            {activeSection === 'step-by-step' && (
              <div className="space-y-8">
                <div className="p-8 bg-[#151517] border border-gray-800 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-600/20 rounded-xl">
                      <Clock className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">How to Use MedExtract</h2>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        num: 1,
                        title: 'Generate Pending Order Report',
                        steps: [
                          'Log in to your EMR system (WoundExpert)',
                          'Generate a Pending Order Report',
                          'Select the appropriate order type',
                          'Apply the correct start date based on the order type',
                          'Export the report file'
                        ]
                      },
                      {
                        num: 2,
                        title: 'Upload File to MedExtract',
                        steps: [
                          'Open MedExtract '+appConfig.version,
                          'Upload the exported report file',
                          'Select the appropriate State Code (e.g., FL, MD, KY)',
                          'Click Confirm to start processing'
                        ],
                        alert: 'Data processing may take some time depending on file size and order volume.'
                      },
                      {
                        num: 3,
                        title: 'Review Processed Data',
                        steps: [
                          'Once processing is complete, navigate to the Dashboard',
                          'Review the parsed and structured data',
                          'Select the relevant Order Type using the provided buttons'
                        ],
                        alert: 'Please review the data carefully to ensure all records are accurate and complete.'
                      },
                      {
                        num: 4,
                        title: 'Export Data',
                        steps: [
                          'Click the Export button',
                          'Download the data in CSV format'
                        ]
                      }
                    ].map((section, idx) => (
                      <div key={idx} className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="bg-green-600 p-3 rounded-full shadow-lg shadow-green-600/50">
                            <span className="text-white font-bold text-lg">{section.num}</span>
                          </div>
                          {idx < 3 && <div className="w-1 h-16 bg-gradient-to-b from-green-600 to-transparent mt-2"></div>}
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="font-bold text-white mb-4">{section.title}</h3>
                          <div className="p-6 bg-[#09090a] rounded-lg border border-gray-700 space-y-3">
                            {section.steps.map((step, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <span className="text-green-600 font-bold min-w-fit">{i + 1}.</span>
                                <span className="text-gray-300">{step}</span>
                              </div>
                            ))}
                            {section.alert && (
                              <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                                <p className="text-green-100 text-sm">{section.alert}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Monday Integration Section */}
            {activeSection === 'monday-integration' && (
              <div className="space-y-8">
                <div className="p-8 bg-[#151517] border border-gray-800 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-600/20 rounded-xl">
                      <Zap className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Monday.com Integration</h2>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-bold text-white mb-4">Override Rules</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#09090a] border-b border-gray-700">
                            <th className="text-green-600 font-bold text-left p-4">Order Type</th>
                            <th className="text-green-600 font-bold text-left p-4">Override Rule</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { type: 'Ancillary', rule: 'Override by UID' },
                            { type: 'Ultramist', rule: 'Override by MRN' },
                            { type: 'Surgical', rule: 'Override by MRN' },
                          ].map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30">
                              <td className="text-gray-200 p-4">
                                <span className="inline-block px-3 py-1 rounded-full text-white text-sm bg-green-600">
                                  {row.type}
                                </span>
                              </td>
                              <td className="text-gray-300 p-4">
                                <span className="inline-block px-3 py-1 rounded-full text-gray-200 text-sm bg-gray-700">
                                  {row.rule}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { step: 'Step 5: Open Monday.com', items: ['Log in to Monday.com', 'Navigate to the Patients Order Workspace', 'Open the appropriate board'] },
                      { step: 'Step 6: Import Data', items: ['Click the three-dot menu', 'Select More Actions', 'Click Import Patients Name', 'Upload the CSV file', 'Map columns correctly', 'Click Next'] },
                      { step: 'Step 7: Apply Override Rules', items: ['Select the correct override rule based on order type'] },
                      { step: 'Step 8: Start Upload', items: ['Confirm mappings', 'Start the upload', 'Wait for completion'] },
                    ].map((section, idx) => (
                      <details key={idx} className="bg-[#09090a] border border-gray-700 rounded-xl">
                        <summary className="p-4 cursor-pointer font-bold text-white flex items-center justify-between hover:bg-gray-800">
                          {section.step}
                          <ChevronDown size={20} />
                        </summary>
                        <div className="p-4 border-t border-gray-700 space-y-3">
                          {section.items.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="text-green-600 font-bold min-w-fit">{i + 1}.</span>
                              <span className="text-gray-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-green-900/20 border border-green-700 rounded-xl">
                    <h3 className="font-bold text-green-500 mb-3 flex items-center gap-2">
                      <CheckCircle size={20} />
                      Process Completion
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        Patient orders available in Monday.com board
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        Data ready for tracking and assignment
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        MedExtract processing cycle complete
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Section */}
            {activeSection === 'notes' && (
              <div className="space-y-8">
                <div className="p-8 bg-[#151517] border border-gray-800 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-600/20 rounded-xl">
                      <Settings className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Notes & Best Practices</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-green-900/20 border border-green-700 rounded-xl">
                      <p className="text-green-100">
                        <strong className="text-green-600">Version Compatibility:</strong> This documentation applies to MedExtract {appConfig.version}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <Shield className="text-green-600" size={20} />
                        Critical Checks
                      </h3>
                      <div className="space-y-3 pl-4 border-l-2 border-green-600/50">
                        {[
                          'Always verify order dates before generating EMR reports',
                          'Double-check state codes to avoid validation issues',
                          'Review dashboard data before exporting',
                          'Ensure column mappings in Monday.com are correct'
                        ].map((check, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <AlertCircle className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                            <span className="text-gray-300">{check}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <Zap className="text-green-600" size={20} />
                        Performance Tips
                      </h3>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300 ml-2">
                        <li>Process large files during off-peak hours</li>
                        <li>Keep MedExtract updated to latest version</li>
                        <li>Verify EMR system compatibility before processing</li>
                        <li>Regularly clear browser cache for optimal performance</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-[#09090a] rounded-xl border border-gray-700">
                      <p className="text-gray-300 italic">
                        <strong className="text-green-600">MedExtract {appConfig.version}</strong> ensures efficient, accurate, and scalable patient order data processing from EMR to operational workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedExtractDocumentation;