
export interface ExamPreset {
  id: string;
  enTitle: string;
  zhTitle: string;
  durationMinutes: number;
}

export const examPresets: ExamPreset[] = [
  { id: 'va_1_2', enTitle: 'Visual Arts (I), (II)', zhTitle: '視覺藝術（一）、（二）', durationMinutes: 240 },
  { id: 'cl_1', enTitle: 'Chinese Language (I)', zhTitle: '中國語文（一）', durationMinutes: 90 },
  { id: 'cl_2', enTitle: 'Chinese Language (II)', zhTitle: '中國語文（二）', durationMinutes: 135 },
  { id: 'el_1', enTitle: 'English Language (I)', zhTitle: '英國語文（一）', durationMinutes: 90 },
  { id: 'el_2', enTitle: 'English Language (II)', zhTitle: '英國語文（二）', durationMinutes: 120 },
  { id: 'el_3', enTitle: 'English Language (III) (Listening and Integrated Skills)', zhTitle: '英國語文（三）（聆聽及綜合能力考核）', durationMinutes: 175 },
  { id: 'math_cp_1', enTitle: 'Mathematics Compulsory Part (I)', zhTitle: '數學 必修部分（一）', durationMinutes: 135 },
  { id: 'math_cp_2', enTitle: 'Mathematics Compulsory Part (II)', zhTitle: '數學 必修部分（二）', durationMinutes: 75 },
  { id: 'csd', enTitle: 'Citizenship and Social Development', zhTitle: '公民與社會發展', durationMinutes: 120 },
  { id: 'ers_1', enTitle: 'Ethics & Religious Studies (I)', zhTitle: '倫理與宗教（一）', durationMinutes: 105 },
  { id: 'ers_2', enTitle: 'Ethics & Religious Studies (II)', zhTitle: '倫理與宗教（二）', durationMinutes: 105 },
  { id: 'chem_1', enTitle: 'Chemistry (I)', zhTitle: '化學（一）', durationMinutes: 150 },
  { id: 'chem_2', enTitle: 'Chemistry (II)', zhTitle: '化學（二）', durationMinutes: 60 },
  { id: 'hmsc_1', enTitle: 'Health Management & Social Care (I)', zhTitle: '健康管理與社會關懷（一）', durationMinutes: 120 },
  { id: 'hmsc_2', enTitle: 'Health Management & Social Care (II)', zhTitle: '健康管理與社會關懷（二）', durationMinutes: 105 },
  { id: 'ict_1', enTitle: 'Information & Communication Technology (I)', zhTitle: '資訊及通訊科技（一）', durationMinutes: 120 },
  { id: 'ict_2', enTitle: 'Information & Communication Technology (II)', zhTitle: '資訊及通訊科技（二）', durationMinutes: 90 },
  { id: 'bio_1', enTitle: 'Biology (I)', zhTitle: '生物（一）', durationMinutes: 150 },
  { id: 'bio_2', enTitle: 'Biology (II)', zhTitle: '生物（二）', durationMinutes: 60 },
  { id: 'bafs_1', enTitle: 'Business, Accounting & Financial Studies (I)', zhTitle: '企業、會計與財務概論（一）', durationMinutes: 60 },
  { id: 'bafs_2', enTitle: 'Business, Accounting & Financial Studies (II)', zhTitle: '企業、會計與財務概論（二）', durationMinutes: 150 },
  { id: 'phy_1', enTitle: 'Physics (I)', zhTitle: '物理（一）', durationMinutes: 150 },
  { id: 'phy_2', enTitle: 'Physics (II)', zhTitle: '物理（二）', durationMinutes: 60 },
  { id: 'dat_1', enTitle: 'Design & Applied Technology (I)', zhTitle: '設計與應用科技（一）', durationMinutes: 120 },
  { id: 'dat_2', enTitle: 'Design & Applied Technology (II)', zhTitle: '設計與應用科技（二）', durationMinutes: 120 },
  { id: 'lit_eng_1', enTitle: 'Literature in English (I)', zhTitle: '英語文學（一）', durationMinutes: 180 },
  { id: 'lit_eng_2', enTitle: 'Literature in English (II)', zhTitle: '英語文學（二）', durationMinutes: 120 },
  { id: 'lit_chin_1', enTitle: 'Chinese Literature (I)', zhTitle: '中國文學（一）', durationMinutes: 120 },
  { id: 'lit_chin_2', enTitle: 'Chinese Literature (II)', zhTitle: '中國文學（二）', durationMinutes: 120 },
  { id: 'tl_1', enTitle: 'Technology & Living (I)', zhTitle: '科技與生活（一）', durationMinutes: 90 },
  { id: 'tl_2', enTitle: 'Technology & Living (II)', zhTitle: '科技與生活（二）', durationMinutes: 120 },
  { id: 'pe_1', enTitle: 'Physical Education (I)', zhTitle: '體育（一）', durationMinutes: 135 },
  { id: 'pe_2', enTitle: 'Physical Education (II)', zhTitle: '體育（二）', durationMinutes: 75 },
  { id: 'music_1a', enTitle: 'Music 1A', zhTitle: '音樂 1A', durationMinutes: 90 },
  { id: 'music_1b', enTitle: 'Music 1B', zhTitle: '音樂 1B', durationMinutes: 90 },
  { id: 'geo_1', enTitle: 'Geography (I)', zhTitle: '地理（一）', durationMinutes: 165 },
  { id: 'geo_2', enTitle: 'Geography (II)', zhTitle: '地理（二）', durationMinutes: 75 },
  { id: 'ths_1', enTitle: 'Tourism & Hospitality Studies (I)', zhTitle: '旅遊與款待（一）', durationMinutes: 90 },
  { id: 'ths_2', enTitle: 'Tourism & Hospitality Studies (II)', zhTitle: '旅遊與款待（二）', durationMinutes: 105 },
  { id: 'hist_1', enTitle: 'History (I)', zhTitle: '歷史（一）', durationMinutes: 120 },
  { id: 'hist_2', enTitle: 'History (II)', zhTitle: '歷史（二）', durationMinutes: 90 },
  { id: 'math_m1', enTitle: 'Mathematics Extended Part Module (I)', zhTitle: '數學 延伸部分 單元（一）', durationMinutes: 150 },
  { id: 'math_m2', enTitle: 'Mathematics Extended Part Module (II)', zhTitle: '數學 延伸部分 單元（二）', durationMinutes: 150 },
  { id: 'chist_1', enTitle: 'Chinese History (I)', zhTitle: '中國歷史（一）', durationMinutes: 135 },
  { id: 'chist_2', enTitle: 'Chinese History (II)', zhTitle: '中國歷史（二）', durationMinutes: 80 },
  { id: 'econ_1', enTitle: 'Economics (I)', zhTitle: '經濟（一）', durationMinutes: 60 },
  { id: 'econ_2', enTitle: 'Economics (II)', zhTitle: '經濟（二）', durationMinutes: 150 },
];

export function formatDurationFromMinutes(totalMinutes: number, language: string): string {
  if (totalMinutes <= 0) return language === 'zh-hk' ? "0 分鐘" : "0 minutes";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = "";

  if (language === 'zh-hk') {
    if (hours > 0) {
      result += `${hours} 小時`;
    }
    if (minutes > 0) {
      if (result.length > 0) result += " ";
      result += `${minutes} 分鐘`;
    }
    return result || "0 分鐘";
  } else { // Default to English
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result.length > 0) result += " ";
      result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return result || "0 minutes";
  }
}
