
import React from 'react';
import { HexagramData, LineData } from '../types';

interface Props {
  data: HexagramData;
  title: string;
}

const HexLine: React.FC<{ line: LineData }> = ({ line }) => {
  const isYang = line.type === '少阳' || line.type === '老阳';
  const isChanging = line.type === '老阴' || line.type === '老阳';

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2">
      <div className="w-14 text-[10px] font-bold text-slate-400 flex flex-col">
        <span>{line.beast}</span>
        <span className="text-blue-600/60">{line.element}</span>
      </div>
      
      <div className="w-16 text-xs font-bold text-slate-600">
        {line.relation} {line.stem_branch}
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative w-full h-5 flex items-center justify-center">
          {isYang ? (
            <div className={`w-32 h-3 bg-slate-800 rounded-full ${isChanging ? 'opacity-40' : ''}`} />
          ) : (
            <div className="w-32 flex justify-between">
              <div className={`w-14 h-3 bg-slate-800 rounded-full ${isChanging ? 'opacity-40' : ''}`} />
              <div className={`w-14 h-3 bg-slate-800 rounded-full ${isChanging ? 'opacity-40' : ''}`} />
            </div>
          )}
          {isChanging && (
            <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-black text-xl drop-shadow-sm">
              {line.type === '老阳' ? '○' : '×'}
            </div>
          )}
        </div>
      </div>

      <div className="w-10 flex items-center gap-1">
        {line.is_shi && <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">世</span>}
        {line.is_ying && <span className="bg-slate-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">应</span>}
      </div>

      <div className="w-16 text-[10px] text-blue-500 font-bold">
        {line.changing_to && (
          <div className="flex flex-col items-start leading-tight">
            <span>→ {line.changing_to.stem_branch}</span>
            <span className="text-slate-400 font-normal">{line.changing_to.relation}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const HexagramDisplay: React.FC<Props> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
      <div className="flex justify-between items-end mb-6 border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data.palace}宫 · {data.palace_element}</p>
        </div>
        <div className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-500 font-bold">六爻盘</div>
      </div>
      <div className="flex flex-col-reverse gap-1">
        {data.lines.map((line) => (
          <HexLine key={line.pos} line={line} />
        ))}
      </div>
    </div>
  );
};
