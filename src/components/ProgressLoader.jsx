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
    }, [progress])

    return (isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }
                .gradient-border {
                    position: relative;
                    background: linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%);
                }
                .gradient-border::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 1.5rem;
                    padding: 2px;
                    background: linear-gradient(135deg, #10b981 0%, #8b5cf6 50%, #10b981 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    animation: shimmer 3s infinite;
                    background-size: 200% 100%;
                }
            `}</style>

            <div 
                className="gradient-border rounded-3xl p-10 max-w-xl w-full mx-4 shadow-2xl relative overflow-hidden"
                style={{
                    animation: 'slideUp 0.4s ease-out',
                    boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.4), 0 0 100px rgba(139, 92, 246, 0.2)'
                }}
            >
                {/* Animated Background Gradients */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                    animation: 'pulse 4s ease-in-out infinite',
                    pointerEvents: 'none'
                }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header with Premium Spinner */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex items-center justify-center mb-6">
                            {/* Outer Ring */}
                            <div style={{
                                position: 'absolute',
                                width: '96px',
                                height: '96px',
                                borderRadius: '50%',
                                border: '3px solid rgba(16, 185, 129, 0.2)',
                            }} />
                            
                            {/* Spinning Gradient Ring */}
                            <div style={{
                                position: 'absolute',
                                width: '96px',
                                height: '96px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
                                padding: '3px',
                                animation: 'spin 2s linear infinite'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 100%)',
                                }} />
                            </div>

                            {/* Inner Glow */}
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'pulse 2s ease-in-out infinite',
                                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3)'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                        </div>

                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.75rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Processing Data
                        </h2>
                        
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '1.125rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#10b981',
                                boxShadow: '0 0 10px #10b981',
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                            {currentStep}
                        </p>
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="mb-8">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ 
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Progress
                            </span>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {Math.round(progress.percentage)}%
                            </span>
                        </div>
                        
                        <div style={{
                            width: '100%',
                            height: '16px',
                            background: 'rgba(17, 17, 17, 0.8)',
                            borderRadius: '12px',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
                        }}>
                            {/* Shimmer Background */}
                            <div className="shimmer" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }} />
                            
                            {/* Actual Progress */}
                            <div style={{
                                height: '100%',
                                width: `${progress.percentage}%`,
                                background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #8b5cf6 100%)',
                                borderRadius: '12px',
                                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Inner Shine Effect */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
                                    borderRadius: '12px 12px 0 0'
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Premium Counters */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        {/* General Tests Counter */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                        }}>
                            {/* Glow Effect */}
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                                animation: 'pulse 3s ease-in-out infinite'
                            }} />
                            
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    color: '#10b981',
                                    marginBottom: '0.5rem',
                                    textShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                                }}>
                                    {progress.processedGeneral}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#34d399',
                                    fontWeight: 600,
                                    marginBottom: '0.25rem'
                                }}>
                                    General Tests
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    borderRadius: '1rem',
                                    fontSize: '0.75rem',
                                    color: '#6ee7b7',
                                    fontWeight: 600,
                                    border: '1px solid rgba(16, 185, 129, 0.3)'
                                }}>
                                    Processed
                                </div>
                            </div>
                        </div>

                        {/* Therapies Counter */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                        }}>
                            {/* Glow Effect */}
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                                animation: 'pulse 3s ease-in-out infinite 0.5s'
                            }} />
                            
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    color: '#8b5cf6',
                                    marginBottom: '0.5rem',
                                    textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                                }}>
                                    {progress.processedTherapies}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#a78bfa',
                                    fontWeight: 600,
                                    marginBottom: '0.25rem'
                                }}>
                                    Therapies
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    borderRadius: '1rem',
                                    fontSize: '0.75rem',
                                    color: '#c4b5fd',
                                    fontWeight: 600,
                                    border: '1px solid rgba(139, 92, 246, 0.3)'
                                }}>
                                    Analyzed
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div style={{
                        background: 'rgba(17, 17, 17, 0.6)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280' }}>
                            Processing Steps
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Tests Loading', threshold: 20 },
                                { label: 'Therapy Processing', threshold: 40 },
                                { label: 'Data Analysis', threshold: 80 }
                            ].map((step, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: progress.percentage > step.threshold 
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : 'rgba(75, 85, 99, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: progress.percentage > step.threshold
                                            ? '2px solid #10b981'
                                            : '2px solid rgba(75, 85, 99, 0.5)',
                                        transition: 'all 0.3s ease',
                                        boxShadow: progress.percentage > step.threshold
                                            ? '0 0 15px rgba(16, 185, 129, 0.6)'
                                            : 'none'
                                    }}>
                                        {progress.percentage > step.threshold && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        height: '2px',
                                        background: progress.percentage > step.threshold
                                            ? 'linear-gradient(90deg, #10b981 0%, rgba(16, 185, 129, 0.2) 100%)'
                                            : 'rgba(75, 85, 99, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }} />
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: progress.percentage > step.threshold ? '#10b981' : '#6b7280',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '1rem',
                        padding: '1rem',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#9ca3af',
                            margin: 0,
                            lineHeight: 1.6
                        }}>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>⚡</span> Please wait while we process your data. This may take a few moments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ));
};

export default LoadingModal;