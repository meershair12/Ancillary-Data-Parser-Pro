import React, { useState, useEffect } from 'react';

const LoadingModal = ({ progress }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [_progress, setProgress] = useState(0);
    const [generalTests, setGeneralTests] = useState(0);
    const [therapies, setTherapies] = useState(0);
    const [currentStep, setCurrentStep] = useState('');

    const steps = [
        'Initializing process...',
        'Loading general tests...',
        'Processing therapies...',
        'Analyzing data...',
        'Finalizing results...',
        'Complete!'
    ];
   
    useEffect(() => {

        setIsLoading(true);
       
        setCurrentStep(steps[0]);

    }, [])
    useEffect(() => {
        if (Number(progress.percentage) < 20) {
            setCurrentStep(steps[0]);
        } else if (Number(progress.percentage) < 40) {
            setCurrentStep(steps[1]);
        } else if (Number(progress.percentage) < 60) {
            setCurrentStep(steps[2]);
        } else if (Number(progress.percentage) < 80) {
            setCurrentStep(steps[3]);
        } else if (Number(progress.percentage) < 95) {
            setCurrentStep(steps[4]);
        } else {
            setCurrentStep(steps[5]);
            setIsLoading(false);
            
            
        }
        // setProgress(Number(progress.percentage))
    }, [progress])


    
   


    return (isLoading && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-[4px]">
            <div className="bg-[#0A0A0A] border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900 bg-opacity-50 rounded-full mb-4 border border-green-800">
                        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2">Processing...</h2>
                    <p className="text-gray-300">{currentStep}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
                        <div
                            className="bg-gradient-to-r from-green-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
                            style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-900 bg-opacity-50 border border-green-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">{progress.processedGeneral}</div>
                        <div className="text-sm text-green-300">General Tests</div>
                        <div className="text-xs text-green-500 mt-1">Processed</div>
                    </div>
                    <div className="bg-purple-900 bg-opacity-50 border border-purple-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">{progress.processedTherapies}</div>
                        <div className="text-sm text-purple-300">Therapies</div>
                        <div className="text-xs text-purple-500 mt-1">Analyzed</div>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 ${progress > 20 ? 'bg-green-400 shadow-green-400 shadow-sm' : 'bg-gray-600'}`}></div>
                        <span className={progress > 20 ? 'text-green-400' : 'text-gray-500'}>Tests Loading</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 ${progress > 40 ? 'bg-green-400 shadow-green-400 shadow-sm' : 'bg-gray-600'}`}></div>
                        <span className={progress > 40 ? 'text-green-400' : 'text-gray-500'}>Therapy Processing</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 ${progress > 80 ? 'bg-green-400 shadow-green-400 shadow-sm' : 'bg-gray-600'}`}></div>
                        <span className={progress > 80 ? 'text-green-400' : 'text-gray-500'}>Data Analysis</span>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-3 bg-green-900 bg-opacity-30 border border-green-800 rounded-lg">
                    <p className="text-xs text-blue-300 text-center">
                        Please wait while we process your data. This may take a few moments.
                    </p>
                </div>
            </div>
        </div>
    )




    );
};

export default LoadingModal;