import React from 'react';
import { X } from 'lucide-react'; // For a close button
import { ConsensusItem } from './TumorBoardView'; // Import the type

interface ConsensusReportViewProps {
    consensusData: ConsensusItem[] | null; // Accept dynamic data
    onClose: () => void; // Function to close this view
}

// Removed static placeholder data

const getStatusClass = (status: ConsensusItem['status']): string => { // Use the specific type
    switch (status.toLowerCase()) {
        case 'confirmed': return 'bg-green-100 text-green-700'; // Adjusted Tailwind classes
        case 'agreed': return 'bg-blue-100 text-blue-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'discussing': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const ConsensusReportView: React.FC<ConsensusReportViewProps> = ({ consensusData, onClose }) => {
    const progress = 65; // Example progress - could be dynamic later

    // Handle case where data might be null or empty
    if (!consensusData || consensusData.length === 0) {
        return (
            <div className="max-w-4xl mx-auto my-5 p-6 bg-white shadow-lg rounded-lg text-center">
                <p className="text-gray-600">No consensus data available to display.</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-5 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close report"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Consensus & Recommendations
                </h2>

                <div className="grid gap-4">
                    {/* Map over the passed consensusData prop */}
                    {consensusData.map((item, index) => (
                        <div
                            key={item.topic} // Assuming topic is unique for key
                            className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 animate-fadeInUp overflow-hidden"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background pattern with opacity */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="h-full w-full bg-pattern-dots"></div>
                            </div>
                            {/* Content with improved visual hierarchy */}
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-base text-gray-900">{item.topic}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{item.details}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {item.agents.map(agent => (
                                        <div
                                            key={agent.id}
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all hover:scale-110"
                                            style={{ 
                                                backgroundColor: agent.color,
                                                boxShadow: `0 0 0 2px white, 0 0 0 4px ${agent.color}15`
                                            }}
                                            title={agent.id.charAt(0).toUpperCase() + agent.id.slice(1)} // Simple title from ID
                                        >
                                            {agent.initial}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Section */}
                <div className="mt-8 pt-5 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">
                        Progress to Final Recommendation
                    </h3>
                    <div className="bg-gray-200 rounded-full h-2 w-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-width duration-500 ease-in-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5 px-1">
                        <span>Initial</span>
                        <span>Consensus</span>
                        <span>Final</span>
                    </div>
                </div>
            </div>
            {/* Add styles for fadeInUp animation in global CSS or here if needed */}
            <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
            `}</style>
        </div>
    );
};

export default ConsensusReportView;
