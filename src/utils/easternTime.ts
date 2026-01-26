/**
 * 东方文化时间工具 - Eastern Cultural Time Utilities
 * 农历、十二时辰、二十四节气、天干地支
 */

// ==================== 十二时辰 ====================

export interface ShiChen {
  name: string;      // 时辰名
  alias: string;     // 别称
  hours: string;     // 对应时间段
  earthlyBranch: string; // 地支
  description: string;   // 描述
  element: string;   // 五行
  organ: string;     // 对应经络/脏腑
}

const SHI_CHEN_DATA: ShiChen[] = [
  { name: '子时', alias: '夜半', hours: '23:00-01:00', earthlyBranch: '子', description: '阴气最盛，阳气初生', element: '水', organ: '胆经' },
  { name: '丑时', alias: '鸡鸣', hours: '01:00-03:00', earthlyBranch: '丑', description: '肝血归经，安养肝脏', element: '土', organ: '肝经' },
  { name: '寅时', alias: '平旦', hours: '03:00-05:00', earthlyBranch: '寅', description: '阳气渐生，肺气充盈', element: '木', organ: '肺经' },
  { name: '卯时', alias: '日出', hours: '05:00-07:00', earthlyBranch: '卯', description: '旭日东升，大肠活跃', element: '木', organ: '大肠经' },
  { name: '辰时', alias: '食时', hours: '07:00-09:00', earthlyBranch: '辰', description: '早餐之时，脾胃运化', element: '土', organ: '胃经' },
  { name: '巳时', alias: '隅中', hours: '09:00-11:00', earthlyBranch: '巳', description: '脾主运化，气血生发', element: '火', organ: '脾经' },
  { name: '午时', alias: '日中', hours: '11:00-13:00', earthlyBranch: '午', description: '阳气最盛，心火旺盛', element: '火', organ: '心经' },
  { name: '未时', alias: '日昳', hours: '13:00-15:00', earthlyBranch: '未', description: '小肠分清泌浊', element: '土', organ: '小肠经' },
  { name: '申时', alias: '哺时', hours: '15:00-17:00', earthlyBranch: '申', description: '膀胱排毒，适宜学习', element: '金', organ: '膀胱经' },
  { name: '酉时', alias: '日入', hours: '17:00-19:00', earthlyBranch: '酉', description: '肾脏储精，宜养肾', element: '金', organ: '肾经' },
  { name: '戌时', alias: '黄昏', hours: '19:00-21:00', earthlyBranch: '戌', description: '心包护心，宜放松', element: '土', organ: '心包经' },
  { name: '亥时', alias: '人定', hours: '21:00-23:00', earthlyBranch: '亥', description: '三焦通畅，宜入眠', element: '水', organ: '三焦经' },
];

/** 根据小时获取时辰 */
export function getShiChen(hour: number): ShiChen {
  // 处理23点属于子时的情况
  const index = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  return SHI_CHEN_DATA[index];
}

/** 获取时辰的详细描述 */
export function getShiChenDisplay(hour: number): string {
  const shichen = getShiChen(hour);
  return `${shichen.name}（${shichen.alias}）`;
}

// ==================== 二十四节气 ====================

export interface SolarTerm {
  name: string;       // 节气名
  pinyin: string;     // 拼音
  month: number;      // 大约月份
  day: number;        // 大约日期
  description: string;// 描述
  advice: string;     // 养生建议
}

const SOLAR_TERMS: SolarTerm[] = [
  { name: '立春', pinyin: 'lìchūn', month: 2, day: 4, description: '春季开始，万物复苏', advice: '宜养肝护阳' },
  { name: '雨水', pinyin: 'yǔshuǐ', month: 2, day: 19, description: '降雨开始，雨量渐增', advice: '宜健脾祛湿' },
  { name: '惊蛰', pinyin: 'jīngzhé', month: 3, day: 6, description: '春雷始鸣，蛰虫惊醒', advice: '宜清肝泄火' },
  { name: '春分', pinyin: 'chūnfēn', month: 3, day: 21, description: '昼夜平分，阴阳平衡', advice: '宜调和阴阳' },
  { name: '清明', pinyin: 'qīngmíng', month: 4, day: 5, description: '天清地明，草木繁茂', advice: '宜踏青养神' },
  { name: '谷雨', pinyin: 'gǔyǔ', month: 4, day: 20, description: '雨生百谷，播种时节', advice: '宜祛湿养脾' },
  { name: '立夏', pinyin: 'lìxià', month: 5, day: 6, description: '夏季开始，万物生长', advice: '宜养心安神' },
  { name: '小满', pinyin: 'xiǎomǎn', month: 5, day: 21, description: '麦类渐满，尚未成熟', advice: '宜清热利湿' },
  { name: '芒种', pinyin: 'mángzhòng', month: 6, day: 6, description: '麦类成熟，可以收割', advice: '宜清暑益气' },
  { name: '夏至', pinyin: 'xiàzhì', month: 6, day: 21, description: '阳气最盛，昼最长', advice: '宜养阴清热' },
  { name: '小暑', pinyin: 'xiǎoshǔ', month: 7, day: 7, description: '暑气渐盛，尚不极热', advice: '宜清热消暑' },
  { name: '大暑', pinyin: 'dàshǔ', month: 7, day: 23, description: '一年最热，万物蒸腾', advice: '宜清热解暑' },
  { name: '立秋', pinyin: 'lìqiū', month: 8, day: 8, description: '秋季开始，暑去凉来', advice: '宜润肺养阴' },
  { name: '处暑', pinyin: 'chùshǔ', month: 8, day: 23, description: '暑气渐消，秋意渐浓', advice: '宜滋阴润燥' },
  { name: '白露', pinyin: 'báilù', month: 9, day: 8, description: '露凝而白，天气转凉', advice: '宜养肺防燥' },
  { name: '秋分', pinyin: 'qiūfēn', month: 9, day: 23, description: '昼夜平分，秋季过半', advice: '宜平补阴阳' },
  { name: '寒露', pinyin: 'hánlù', month: 10, day: 8, description: '露气寒冷，将凝结霜', advice: '宜养阴防寒' },
  { name: '霜降', pinyin: 'shuāngjiàng', month: 10, day: 23, description: '天气渐冷，初霜出现', advice: '宜补肺润燥' },
  { name: '立冬', pinyin: 'lìdōng', month: 11, day: 8, description: '冬季开始，万物收藏', advice: '宜养肾藏精' },
  { name: '小雪', pinyin: 'xiǎoxuě', month: 11, day: 22, description: '初雪将至，气温骤降', advice: '宜温补肾阳' },
  { name: '大雪', pinyin: 'dàxuě', month: 12, day: 7, description: '大雪纷飞，天寒地冻', advice: '宜温肾助阳' },
  { name: '冬至', pinyin: 'dōngzhì', month: 12, day: 22, description: '阴极阳生，昼最短', advice: '宜进补养藏' },
  { name: '小寒', pinyin: 'xiǎohán', month: 1, day: 6, description: '寒气渐重，尚未极寒', advice: '宜补肾温阳' },
  { name: '大寒', pinyin: 'dàhán', month: 1, day: 20, description: '一年最冷，万物闭藏', advice: '宜温补脾肾' },
];

/** 根据日期获取当前节气 */
export function getSolarTerm(date: Date): SolarTerm {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 找到最近的节气
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const term = SOLAR_TERMS[i];
    const nextTerm = SOLAR_TERMS[(i + 1) % 24];

    if (term.month === month) {
      if (day >= term.day) {
        // 检查是否已经到下一个节气
        if (nextTerm.month === month && day >= nextTerm.day) {
          return nextTerm;
        }
        return term;
      }
    }
  }

  // 默认返回基于月份的节气
  const termIndex = ((month - 1) * 2) % 24;
  return SOLAR_TERMS[termIndex];
}

// ==================== 天干地支 ====================

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/** 计算年的天干地支 */
export function getYearGanZhi(year: number): { gan: string; zhi: string; shengxiao: string } {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex],
    shengxiao: SHENG_XIAO[zhiIndex],
  };
}

/** 计算日的天干地支（简化算法） */
export function getDayGanZhi(date: Date): { gan: string; zhi: string } {
  // 以1900年1月1日（甲戌日）为基准
  const baseDate = new Date(1900, 0, 1);
  const days = Math.floor((date.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
  const ganIndex = (days + 10) % 10; // 1900年1月1日是甲日
  const zhiIndex = (days + 10) % 12; // 1900年1月1日是戌日
  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[(zhiIndex + 2) % 12], // 调整偏移
  };
}

// ==================== 农历（简化版） ====================

// 农历数据 (2020-2030) - 保留供未来精确农历计算使用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LUNAR_INFO_DATA = [
  0x0ba4a, // 2020
  0x0ab50, // 2021
  0x04bd8, // 2022
  0x0a9b0, // 2023
  0x15a90, // 2024
  0x0d2a0, // 2025
  0x0d950, // 2026
  0x05ad0, // 2027
  0x02b60, // 2028
  0x09570, // 2029
  0x04ae0, // 2030
];
void LUNAR_INFO_DATA; // 防止未使用警告

const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
  isLeapMonth: boolean;
  ganZhi: { gan: string; zhi: string; shengxiao: string };
}

/** 简化的农历计算（近似值） */
export function getLunarDate(date: Date): LunarDate {
  // 这是一个简化的农历计算
  // 实际应用中应使用完整的农历库
  const year = date.getFullYear();
  const ganZhi = getYearGanZhi(year);

  // 简化计算：基于公历日期估算农历
  // 农历通常比公历晚约1个月
  let lunarMonth = date.getMonth(); // 0-11
  let lunarDay = date.getDate();

  // 简单调整（非精确）
  if (lunarDay > 29) lunarDay = 29;

  return {
    year,
    month: lunarMonth + 1,
    day: lunarDay,
    monthName: LUNAR_MONTHS[lunarMonth],
    dayName: LUNAR_DAYS[lunarDay - 1] || '初一',
    isLeapMonth: false,
    ganZhi,
  };
}

/** 获取农历日期显示文本 */
export function getLunarDateDisplay(date: Date): string {
  const lunar = getLunarDate(date);
  return `${lunar.ganZhi.gan}${lunar.ganZhi.zhi}年 ${lunar.monthName}月${lunar.dayName}`;
}

// ==================== 经纬度格式化 ====================

/** 将经纬度转换为度分秒格式 */
export function formatCoordinateDMS(value: number, isLatitude: boolean): string {
  const direction = isLatitude
    ? (value >= 0 ? '北纬' : '南纬')
    : (value >= 0 ? '东经' : '西经');

  const absValue = Math.abs(value);
  const degrees = Math.floor(absValue);
  const minutes = Math.floor((absValue - degrees) * 60);
  const seconds = Math.round(((absValue - degrees) * 60 - minutes) * 60);

  return `${direction} ${degrees}°${minutes}′${seconds}″`;
}

/** 格式化坐标为简短形式 */
export function formatCoordinateShort(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir} ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

// ==================== 综合时空信息 ====================

export interface EasternSpaceTime {
  // 时间
  shichen: ShiChen;
  solarTerm: SolarTerm;
  lunarDate: LunarDate;
  dayGanZhi: { gan: string; zhi: string };

  // 位置
  coordinates?: {
    lat: number;
    lng: number;
    latDisplay: string;
    lngDisplay: string;
  };
}

/** 获取完整的东方时空信息 */
export function getEasternSpaceTime(date: Date, lat?: number, lng?: number): EasternSpaceTime {
  const result: EasternSpaceTime = {
    shichen: getShiChen(date.getHours()),
    solarTerm: getSolarTerm(date),
    lunarDate: getLunarDate(date),
    dayGanZhi: getDayGanZhi(date),
  };

  if (lat !== undefined && lng !== undefined) {
    result.coordinates = {
      lat,
      lng,
      latDisplay: formatCoordinateDMS(lat, true),
      lngDisplay: formatCoordinateDMS(lng, false),
    };
  }

  return result;
}
