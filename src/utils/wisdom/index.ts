/**
 * 文化智慧模块索引
 * Cultural Wisdom Modules Index
 */

// 类型导出
export type {
  Trigram,
  Hexagram,
  IChingReading,
  YaoLine,
  SixLinesGua,
  SixLinesPrediction,
  FiveElement,
  ElementProperties,
  ElementRelation,
  HuangdiAnalysis,
  JungianArchetype,
  EmotionalDimension,
  PsychologyAnalysis,
  WisdomInput,
  WisdomAnalysis,
  PromptData,
} from './types';

// 易经模块
export {
  getIChingReading,
  getTrigramInfo,
  getHexagramElement,
  TRIGRAMS,
} from './iching';

// 六爻模块
export {
  getSixLinesPrediction,
  getYaoSymbol,
  getGuaSymbols,
} from './sixlines';

// 五行模块
export {
  getHuangdiAnalysis,
  getElementProperties,
  getElementRelation,
  getElementChineseName,
  FIVE_ELEMENTS,
  ELEMENT_RELATIONS,
} from './fiveelements';

// 心理学模块
export {
  getPsychologyAnalysis,
  getArchetypeInfo,
  explainPAD,
} from './psychology';

// 综合模块
export {
  getWisdomAnalysis,
  preparePromptData,
  generateStoryPrompt,
  generateImagePrompt,
} from './synthesis';
