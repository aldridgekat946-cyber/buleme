
/**
 * Simplified GanZhi calculation for demonstration.
 * In a real app, use a robust lunar calendar library.
 */
export const getGanZhiDate = () => {
  const now = new Date();
  
  // Stems and Branches
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // This is a very rough estimation for UI purposes. 
  // For precise divination, a real Solar-to-Lunar conversion is required.
  const yearIndex = (now.getFullYear() - 4) % 60;
  const yearStem = stems[yearIndex % 10];
  const yearBranch = branches[yearIndex % 12];

  // Rough Month Branch (Approx based on solar terms)
  const month = now.getMonth(); // 0-indexed
  const monthBranch = branches[(month + 2) % 12];
  
  // Rough Day Stem/Branch (using 2024-01-01 as base: 甲子)
  const baseDate = new Date(2024, 0, 1);
  const diffDays = Math.floor((now.getTime() - baseDate.getTime()) / (1000 * 3600 * 24));
  const dayStem = stems[diffDays % 10];
  const dayBranch = branches[diffDays % 12];

  return {
    full: `${yearStem}${yearBranch}年 ${monthBranch}月 ${dayStem}${dayBranch}日`,
    yearStem, yearBranch,
    monthBranch,
    dayStem, dayBranch
  };
};

export const getFiveElementRelation = (me: string, other: string) => {
  const relationships: Record<string, Record<string, string>> = {
    '金': { '金': '兄弟', '木': '妻财', '水': '子孙', '火': '官鬼', '土': '父母' },
    '木': { '木': '兄弟', '火': '子孙', '土': '妻财', '金': '官鬼', '水': '父母' },
    '水': { '水': '兄弟', '木': '子孙', '火': '妻财', '土': '官鬼', '金': '父母' },
    '火': { '火': '兄弟', '土': '子孙', '金': '妻财', '水': '官鬼', '木': '父母' },
    '土': { '土': '兄弟', '金': '子孙', '水': '妻财', '木': '官鬼', '火': '父母' }
  };
  return relationships[me][other];
};
