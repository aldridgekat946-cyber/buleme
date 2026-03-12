
export type LineType = '老阴' | '老阳' | '少阴' | '少阳';

export interface LineData {
  pos: number;
  type: LineType;
  symbol: string;
  stem_branch: string;
  element: string;
  relation: string;
  beast: string;
  is_shi: boolean;
  is_ying: boolean;
  changing_to?: {
    symbol: string;
    stem_branch: string;
    element: string;
    relation: string;
  };
}

export interface HexagramData {
  name: string;
  palace: string;
  palace_element: string;
  lines: LineData[];
}

export interface DivinationResult {
  meta: {
    question: string;
    divination_date: string;
    lunar_date: string;
    method: string;
    day_stem: string;
    day_branch: string;
    month_branch: string;
  };
  rolls_raw: number[];
  hexagram: {
    primary: HexagramData;
    transformed: HexagramData | null;
  };
  analysis_summary: string;
}

export enum FiveElements {
  METAL = '金',
  WOOD = '木',
  WATER = '水',
  FIRE = '火',
  EARTH = '土'
}

export const BRANCH_ELEMENTS: Record<string, string> = {
  '子': '水', '亥': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '申': '金', '酉': '金',
  '辰': '土', '戌': '土', '丑': '土', '未': '土'
};
