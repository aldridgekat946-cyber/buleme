
import React, { useState, useEffect } from 'react';

interface Props {
  rolls: number[];
  onComplete: () => void;
}

const RollingDie = ({ value, isSettled }: { value: number; isSettled: boolean }) => {
  const [flickerValue, setFlickerValue] = useState(1);

  useEffect(() => {
    let interval: number;
    if (!isSettled) {
      interval = window.setInterval(() => {
        setFlickerValue(Math.floor(Math.random() * 8) + 1);
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isSettled]);

  return (
    <div className={`
      relative w-28 h-28 flex items-center justify-center rounded-[2rem] 
      transition-all duration-300 transform
      ${isSettled 
        ? 'bg-blue-600 scale-100 rotate-0 shadow-2xl shadow-blue-300' 
        : 'bg-white scale-110 rotate-12 shadow-xl animate-bounce'}
    `}>
      <span className={`text-4xl font-black ${isSettled ? 'text-white' : 'text-blue-600'}`}>
        {isSettled ? value : flickerValue}
      </span>
      {/* Decorative dots for a modern d8-ish feel */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current opacity-20"></div>
      <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-current opacity-20"></div>
    </div>
  );
};

export const DiceRollingEffect: React.FC<Props> = ({ rolls, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5
  const [isSettled, setIsSettled] = useState(false);
  const [settledResults, setSettledResults] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep < 6) {
      // Start rolling
      setIsSettled(false);
      
      // Settle after 1.2 seconds of "rolling"
      const settleTimer = setTimeout(() => {
        setIsSettled(true);
        setSettledResults(prev => [...prev, rolls[currentStep]]);
        
        // Move to next roll after 0.8 seconds of showing result
        const nextTimer = setTimeout(() => {
          if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
          } else {
            // All 6 rolls done
            const completeTimer = setTimeout(onComplete, 1000);
            return () => clearTimeout(completeTimer);
          }
        }, 800);
        
        return () => clearTimeout(nextTimer);
      }, 1200);

      return () => clearTimeout(settleTimer);
    }
  }, [currentStep, rolls, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-12 py-10">
      {/* Header / Progress */}
      <div className="text-center space-y-2">
        <h3 className="text-blue-600 font-black text-2xl tracking-tight">
          {currentStep < 6 ? `正在进行第 ${currentStep + 1} 次起卦...` : '六爻已成'}
        </h3>
        <div className="flex gap-2 justify-center">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < currentStep ? 'w-8 bg-blue-600' : 
                i === currentStep ? 'w-12 bg-blue-400 animate-pulse' : 
                'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Dice Arena */}
      <div className="relative py-12">
        <div className={`transition-all duration-500 ${isSettled ? 'scale-90 opacity-50 blur-[1px]' : 'scale-100 opacity-100'}`}>
           <RollingDie value={rolls[currentStep]} isSettled={isSettled} />
        </div>
        
        {/* Result Overlay that appears when settled */}
        {isSettled && (
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center">
              <span className="text-3xl font-black text-blue-600">{rolls[currentStep]}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {rolls[currentStep] === 1 ? '老阴' : rolls[currentStep] === 8 ? '老阳' : rolls[currentStep] < 5 ? '少阴' : '少阳'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Settled List (History) */}
      <div className="w-full flex justify-center gap-3 h-16">
        {settledResults.map((val, idx) => (
          <div 
            key={idx} 
            className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center animate-in slide-in-from-bottom-4"
          >
            <span className="text-sm font-bold text-slate-600">{val}</span>
          </div>
        ))}
        {Array.from({ length: 6 - settledResults.length }).map((_, i) => (
          <div key={i + settledResults.length} className="w-10 h-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl" />
        ))}
      </div>

      <p className="text-slate-400 text-sm font-medium animate-pulse">
        {isSettled ? '记录卦象中...' : '灵骰飞旋，感应天机'}
      </p>
    </div>
  );
};
