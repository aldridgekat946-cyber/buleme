
import { 
  TRIGRAMS, 
  HEX_DATABASE, 
  SIX_GODS_LIST, 
  DAY_STEM_SIX_GOD_MAP 
} from './constants';
import { 
  LineType, 
  LineData, 
  HexagramData, 
  BRANCH_ELEMENTS 
} from './types';
import { getFiveElementRelation } from './utils';

export const rollToLineType = (roll: number): LineType => {
  if (roll === 1) return '老阴';
  if (roll === 8) return '老阳';
  if (roll >= 2 && roll <= 4) return '少阴';
  return '少阳';
};

export const assembleHexagram = (rolls: number[], dayStem: string): { primary: HexagramData, transformed: HexagramData | null } => {
  const primaryBinary = rolls.map(r => (rollToLineType(r).includes('阴') ? '0' : '1')).join('');
  const primaryInfo = HEX_DATABASE[primaryBinary] || { name: '未知', palace: '未知', shi: 0, ying: 0 };
  const palaceElement = TRIGRAMS[Object.values(TRIGRAMS).find(t => t.name === primaryInfo.palace)?.binary || '111'].element;

  const getNajia = (binary: string): LineData[] => {
    const info = HEX_DATABASE[binary];
    const innerTrigram = TRIGRAMS[binary.substring(0, 3)];
    const outerTrigram = TRIGRAMS[binary.substring(3, 6)];
    const startGodIndex = DAY_STEM_SIX_GOD_MAP[dayStem] || 0;

    return rolls.map((roll, i) => {
      const pos = i + 1;
      const trigram = pos <= 3 ? innerTrigram : outerTrigram;
      const branches = pos <= 3 ? trigram.inner : trigram.outer;
      const branch = branches[i % 3];
      const element = BRANCH_ELEMENTS[branch];
      const type = rollToLineType(roll);
      
      return {
        pos,
        type,
        symbol: type === '老阳' ? 'O' : type === '老阴' ? 'X' : type === '少阳' ? '——' : '— —',
        stem_branch: branch, // Simplified: just branch for common Najia usage
        element,
        relation: getFiveElementRelation(palaceElement, element),
        beast: SIX_GODS_LIST[(startGodIndex + i) % 6],
        is_shi: info?.shi === pos,
        is_ying: info?.ying === pos
      };
    });
  };

  const primary: HexagramData = {
    name: primaryInfo.name,
    palace: primaryInfo.palace,
    palace_element: palaceElement,
    lines: getNajia(primaryBinary)
  };

  // Transformed
  const hasChange = rolls.some(r => r === 1 || r === 8);
  let transformed: HexagramData | null = null;

  if (hasChange) {
    const transBinary = rolls.map(r => {
      const type = rollToLineType(r);
      if (type === '老阴') return '1';
      if (type === '老阳') return '0';
      return type.includes('阴') ? '0' : '1';
    }).join('');

    const transInfo = HEX_DATABASE[transBinary];
    if (transInfo) {
      // For transformed hexagrams, we often just need the branches of the changing lines
      const transNajia = getNajia(transBinary);
      transformed = {
        name: transInfo.name,
        palace: transInfo.palace,
        palace_element: TRIGRAMS[Object.values(TRIGRAMS).find(t => t.name === transInfo.palace)?.binary || '111'].element,
        lines: transNajia
      };

      // Map transformed branches back to primary lines
      primary.lines.forEach((line, idx) => {
        if (line.type === '老阳' || line.type === '老阴') {
          line.changing_to = {
            symbol: transformed!.lines[idx].symbol,
            stem_branch: transformed!.lines[idx].stem_branch,
            element: transformed!.lines[idx].element,
            relation: getFiveElementRelation(primary.palace_element, transformed!.lines[idx].element)
          };
        }
      });
    }
  }

  return { primary, transformed };
};
