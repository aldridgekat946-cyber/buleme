
export const TRIGRAMS: Record<string, { name: string, element: string, binary: string, inner: string[], outer: string[] }> = {
  '111': { name: '乾', element: '金', binary: '111', inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
  '011': { name: '兑', element: '金', binary: '011', inner: ['巳', '卯', '丑'], outer: ['亥', '酉', '未'] },
  '101': { name: '离', element: '火', binary: '101', inner: ['卯', '丑', '亥'], outer: ['酉', '未', '巳'] },
  '001': { name: '震', element: '木', binary: '001', inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
  '110': { name: '巽', element: '木', binary: '110', inner: ['丑', '亥', '酉'], outer: ['未', '巳', '卯'] },
  '010': { name: '坎', element: '水', binary: '010', inner: ['寅', '辰', '午'], outer: ['申', '戌', '子'] },
  '100': { name: '艮', element: '土', binary: '100', inner: ['辰', '午', '申'], outer: ['戌', '子', '寅'] },
  '000': { name: '坤', element: '土', binary: '000', inner: ['未', '巳', '卯'], outer: ['丑', '亥', '酉'] }
};

export const SIX_RELATIONS_ORDER = ['兄弟', '子孙', '妻财', '官鬼', '父母'];
export const SIX_GODS_LIST = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'];

export const DAY_STEM_SIX_GOD_MAP: Record<string, number> = {
  '甲': 0, '乙': 0, '丙': 1, '丁': 1, '戊': 2, '己': 3, '庚': 4, '辛': 4, '壬': 5, '癸': 5
};

/**
 * HEX_DATABASE - Strict 8-Palace System
 * Corrected Binary format: b1b2b3 (Inner) + b4b5b6 (Outer)
 * Fixes duplicate key errors by mapping hexagrams to unique binary signatures.
 */
export const HEX_DATABASE: Record<string, { name: string, palace: string, shi: number, ying: number }> = {
  // 乾宫 (金)
  "111111": { name: "乾为天", palace: "乾", shi: 6, ying: 3 },
  "110111": { name: "天风姤", palace: "乾", shi: 1, ying: 4 },
  "100111": { name: "天山遁", palace: "乾", shi: 2, ying: 5 },
  "000111": { name: "天地否", palace: "乾", shi: 3, ying: 6 },
  "000110": { name: "风地观", palace: "乾", shi: 4, ying: 1 },
  "000100": { name: "山地剥", palace: "乾", shi: 5, ying: 2 },
  "000101": { name: "火地晋", palace: "乾", shi: 4, ying: 1 },
  "111101": { name: "火天大有", palace: "乾", shi: 3, ying: 6 },

  // 兑宫 (金)
  "011011": { name: "兑为泽", palace: "兑", shi: 6, ying: 3 },
  "010011": { name: "泽水困", palace: "兑", shi: 1, ying: 4 },
  "000011": { name: "泽地萃", palace: "兑", shi: 2, ying: 5 },
  "100011": { name: "泽山咸", palace: "兑", shi: 3, ying: 6 },
  "100010": { name: "水山蹇", palace: "兑", shi: 4, ying: 1 },
  "100000": { name: "地山谦", palace: "兑", shi: 5, ying: 2 },
  "100001": { name: "雷山小过", palace: "兑", shi: 4, ying: 1 },
  "011001": { name: "雷泽归妹", palace: "兑", shi: 3, ying: 6 },

  // 离宫 (火)
  "101101": { name: "离为火", palace: "离", shi: 6, ying: 3 },
  "100101": { name: "火山旅", palace: "离", shi: 1, ying: 4 },
  "110101": { name: "火风鼎", palace: "离", shi: 2, ying: 5 },
  "010101": { name: "火水未济", palace: "离", shi: 3, ying: 6 },
  "010100": { name: "山水蒙", palace: "离", shi: 4, ying: 1 },
  "010110": { name: "风水涣", palace: "离", shi: 5, ying: 2 },
  "010111": { name: "天水讼", palace: "离", shi: 4, ying: 1 },
  "101111": { name: "天火同人", palace: "离", shi: 3, ying: 6 },

  // 震宫 (木)
  "001001": { name: "震为雷", palace: "震", shi: 6, ying: 3 },
  "000001": { name: "雷地豫", palace: "震", shi: 1, ying: 4 },
  "010001": { name: "雷水解", palace: "震", shi: 2, ying: 5 },
  "110001": { name: "雷风恒", palace: "震", shi: 3, ying: 6 },
  "110000": { name: "地风升", palace: "震", shi: 4, ying: 1 },
  "110010": { name: "水风井", palace: "震", shi: 5, ying: 2 },
  "110011": { name: "泽风大过", palace: "震", shi: 4, ying: 1 },
  "001011": { name: "泽雷随", palace: "震", shi: 3, ying: 6 },

  // 巽宫 (木)
  "110110": { name: "巽为风", palace: "巽", shi: 6, ying: 3 },
  "111110": { name: "风天小畜", palace: "巽", shi: 1, ying: 4 },
  "101110": { name: "风火家人", palace: "巽", shi: 2, ying: 5 },
  "001110": { name: "风雷益", palace: "巽", shi: 3, ying: 6 },
  "001111": { name: "天雷无妄", palace: "巽", shi: 4, ying: 1 },
  "001101": { name: "火雷噬嗑", palace: "巽", shi: 5, ying: 2 },
  "001100": { name: "山雷颐", palace: "巽", shi: 4, ying: 1 },
  "110100": { name: "山风蛊", palace: "巽", shi: 3, ying: 6 },

  // 坎宫 (水)
  "010010": { name: "坎为水", palace: "坎", shi: 6, ying: 3 },
  "011010": { name: "水泽节", palace: "坎", shi: 1, ying: 4 },
  "001010": { name: "水雷屯", palace: "坎", shi: 2, ying: 5 },
  "101010": { name: "水火既济", palace: "坎", shi: 3, ying: 6 },
  "101011": { name: "泽火革", palace: "坎", shi: 4, ying: 1 },
  "101001": { name: "雷火丰", palace: "坎", shi: 5, ying: 2 },
  "101000": { name: "地火明夷", palace: "坎", shi: 4, ying: 1 },
  "010000": { name: "地水师", palace: "坎", shi: 3, ying: 6 },

  // 艮宫 (土)
  "100100": { name: "艮为山", palace: "艮", shi: 6, ying: 3 },
  "101100": { name: "山火贲", palace: "艮", shi: 1, ying: 4 },
  "111100": { name: "山天大畜", palace: "艮", shi: 2, ying: 5 },
  "011100": { name: "山泽损", palace: "艮", shi: 3, ying: 6 },
  "011101": { name: "火泽睽", palace: "艮", shi: 4, ying: 1 },
  "011111": { name: "天泽履", palace: "艮", shi: 5, ying: 2 },
  "011110": { name: "风泽中孚", palace: "艮", shi: 4, ying: 1 },
  "100110": { name: "风山渐", palace: "艮", shi: 3, ying: 6 },

  // 坤宫 (土)
  "000000": { name: "坤为地", palace: "坤", shi: 6, ying: 3 },
  "001000": { name: "地雷复", palace: "坤", shi: 1, ying: 4 },
  "011000": { name: "地泽临", palace: "坤", shi: 2, ying: 5 },
  "111000": { name: "地天泰", palace: "坤", shi: 3, ying: 6 },
  "111001": { name: "雷天大壮", palace: "坤", shi: 4, ying: 1 },
  "111011": { name: "泽天夬", palace: "坤", shi: 5, ying: 2 },
  "111010": { name: "水天需", palace: "坤", shi: 4, ying: 1 },
  "000010": { name: "水地比", palace: "坤", shi: 3, ying: 6 }
};
