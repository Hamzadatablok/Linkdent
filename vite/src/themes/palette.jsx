import { extendPaletteWithChannels } from 'utils/colorUtils';
import defaultColor from './theme/default';

export function buildPalette(presetColor) {
  let colors = defaultColor;

  const lightColors = {
    primary: { light: colors.primaryLight, main: colors.primaryMain, dark: colors.primaryDark, 200: colors.primary200, 800: colors.primary800 },
    secondary: { light: colors.secondaryLight, main: colors.secondaryMain, dark: colors.secondaryDark, 200: colors.secondary200, 800: colors.secondary800 },
    error: { light: colors.errorLight, main: colors.errorMain, dark: colors.errorDark },
    orange: { light: colors.orangeLight, main: colors.orangeMain, dark: colors.orangeDark },
    warning: { light: colors.warningLight, main: colors.warningMain, dark: colors.warningDark, contrastText: colors.grey700 },
    success: { light: colors.successLight, 200: colors.success200, main: colors.successMain, dark: colors.successDark },
    
    // الألوان الداكنة الجديدة
    grey: { 50: '#f8fafc', 100: '#f1f5f9', 500: '#64748b', 600: '#475569', 700: '#334155', 900: '#0f172a' },
    dark: { light: colors.darkTextPrimary, main: colors.darkLevel1, dark: colors.darkLevel2, 800: colors.darkBackground, 900: colors.darkPaper },
    
    // نصوص بيضاء ناصعة
    text: { primary: '#f8fafc', secondary: '#94a3b8', dark: '#ffffff', hint: '#cbd5e1', heading: '#ffffff' },
    divider: 'rgba(255, 255, 255, 0.08)',
    
    // خلفية زرقاء ليلية تبرز الزجاج
    background: { paper: 'rgba(15, 23, 42, 0.4)', default: '#02040a' } 
  };

  const commonColor = { common: { black: '#02040a', white: '#ffffff' } };
  const extendedLight = extendPaletteWithChannels(lightColors);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'dark',
      ...extendedCommon,
      ...extendedLight
    }
  };
}