
import React, { useState } from 'react';
import { getGanZhiDate } from './utils';
import { assembleHexagram } from './engine';
import { DivinationResult } from './types';
import { getAIInterpretationStream } from './geminiService';
import { HexagramDisplay } from './components/HexagramDisplay';
import { DiceRollingEffect } from './components/DiceRollingEffect';

const App: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [tempRolls, setTempRolls] = useState<number[]>([]);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);

  const initiateDivination = () => {
    if (!question.trim()) {
      alert('请先写下你内心真正的疑惑。');
      return;
    }
    const newRolls = Array.from({ length: 6 }, () => Math.floor(Math.random() * 8) + 1);
    setTempRolls(newRolls);
    setIsRolling(true);
    setResult(null);
    setAiInterpretation('');
    setAnalysisError(false);
  };

  const fetchInterpretation = async (divinationResult: DivinationResult) => {
    setIsAnalyzing(true);
    setAiInterpretation('');
    setAnalysisError(false);
    
    try {
      const stream = getAIInterpretationStream(divinationResult);
      for await (const chunk of stream) {
        setAiInterpretation(prev => prev + chunk);
        setIsAnalyzing(false); // Turn off analyzing state once we get the first chunk
      }
    } catch (error) {
      console.error("Stream error:", error);
      setAiInterpretation(prev => prev + "\n\n[系统提示：解析时网络波动，请检查您的网络并稍后再试。]");
      setAnalysisError(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finalizeDivination = async () => {
    const dateInfo = getGanZhiDate();
    const { primary, transformed } = assembleHexagram(tempRolls, dateInfo.dayStem);

    const divinationResult: DivinationResult = {
      meta: {
        question,
        divination_date: new Date().toLocaleDateString(),
        lunar_date: dateInfo.full,
        method: "D8 Dice x 6",
        day_stem: dateInfo.dayStem,
        day_branch: dateInfo.dayBranch,
        month_branch: dateInfo.monthBranch
      },
      rolls_raw: tempRolls,
      hexagram: { primary, transformed },
      analysis_summary: transformed ? "多变之局" : "静态之象"
    };

    setResult(divinationResult);
    setIsRolling(false);
    
    await fetchInterpretation(divinationResult);
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Visual background layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-100/30 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-100/30 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-5xl z-10">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
              <span className="text-white text-3xl font-black">卜</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">卜了么</h1>
          </div>
          <p className="text-slate-400 text-lg font-medium tracking-wide">你的现代生活推演引擎</p>
          <div className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{getGanZhiDate().full}</span>
          </div>
        </header>

        <main className="modern-card rounded-[3rem] p-8 md:p-16 transition-all duration-700 min-h-[600px] border border-white/50 bg-white/70 backdrop-blur-xl">
          {!result && !isRolling && (
            <div className="max-w-xl mx-auto flex flex-col items-center space-y-12 animate-in fade-in duration-1000">
              <div className="w-full space-y-4">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">写下此刻的疑虑</label>
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：这次跳槽的决定是否正确？"
                    className="w-full h-44 bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-8 text-2xl text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:ring-8 focus:ring-blue-50 transition-all resize-none shadow-inner font-medium"
                  />
                  <div className="absolute bottom-6 right-8 text-blue-600/5 text-8xl font-black select-none pointer-events-none">
                    ?
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-4">
                <button
                  onClick={initiateDivination}
                  className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl shadow-2xl shadow-blue-200 hover:shadow-blue-300 transform transition-all active:scale-95 text-2xl tracking-tighter"
                >
                  即刻推演局势
                </button>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                  Data-driven tradition • Objective results
                </p>
              </div>
            </div>
          )}

          {isRolling && (
            <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
              <DiceRollingEffect rolls={tempRolls} onComplete={finalizeDivination} />
            </div>
          )}

          {result && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                  Current Session
                </span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">“{result.meta.question}”</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <HexagramDisplay data={result.hexagram.primary} title={result.hexagram.primary.name} />
                {result.hexagram.transformed ? (
                  <HexagramDisplay data={result.hexagram.transformed} title={result.hexagram.transformed.name} />
                ) : (
                  <div className="bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-slate-300 shadow-inner">
                    <span className="text-4xl mb-4 opacity-10">✦</span>
                    <p className="font-bold tracking-tight">静卦：当前局势尚未引发连锁变动</p>
                  </div>
                )}
              </div>

              <div className="relative pt-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1.5 h-10 bg-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">深度解读报告</h3>
                </div>

                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 md:p-14 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <span className="text-9xl font-black">AI</span>
                   </div>
                  {isAnalyzing ? (
                    <div className="py-20 flex flex-col items-center gap-6">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <p className="text-slate-400 font-bold tracking-widest animate-pulse">正在穿透表象，解析五行干支生克...</p>
                    </div>
                  ) : (
                    <div className="text-slate-700 leading-relaxed text-xl whitespace-pre-wrap font-medium">
                      {aiInterpretation}
                    </div>
                  )}
                  
                  {analysisError && !isAnalyzing && (
                    <div className="mt-8 flex justify-center animate-in fade-in">
                      <button
                        onClick={() => result && fetchInterpretation(result)}
                        className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-2xl transition-all flex items-center gap-2 border border-blue-200 shadow-sm active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        网络不佳，点击重新获取解读
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-10 pt-10">
                <button 
                  onClick={() => {
                    setResult(null);
                    setQuestion('');
                    setAiInterpretation('');
                    setAnalysisError(false);
                  }}
                  className="px-14 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all rounded-[1.5rem] font-black text-lg shadow-sm"
                >
                  重置，起新卦
                </button>
                
                <details className="w-full text-center group">
                  <summary className="text-slate-300 text-[10px] font-bold cursor-pointer list-none hover:text-slate-400 tracking-widest uppercase">
                    Developer & Master Data View
                  </summary>
                  <div className="mt-8 text-left bg-slate-900 rounded-[2rem] p-10 overflow-auto max-h-96 border border-slate-800 shadow-2xl">
                    <pre className="text-[11px] text-blue-400 font-mono leading-relaxed">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="mt-20 mb-10 text-slate-300 text-[10px] font-black tracking-[0.4em] uppercase">
        © BU-LE-ME · AI POWERED DIVINATION ENGINE V3.0
      </footer>
    </div>
  );
};

export default App;
