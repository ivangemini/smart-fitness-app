import { Colors } from '@/constants/theme';
import { resolveLiquidGlassPalette } from '@/theme/liquidGlass';

import { createAddFoodBaseStyles } from './addFoodBaseStyles';
import { createAddFoodScannerStyles } from './addFoodScannerStyles';
import { createAddFoodSheetStyles } from './addFoodSheetStyles';

export const createAddFoodStyles = (colors: typeof Colors.light) => {
  const glass = resolveLiquidGlassPalette(colors === Colors.light ? 'light' : 'dark');

  return {
    ...createAddFoodBaseStyles(colors, glass),
    ...createAddFoodScannerStyles(colors, glass),
    ...createAddFoodSheetStyles(colors, glass),
  };
};
