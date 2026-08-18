export type DesignStyle =
  | 'modern'
  | 'minimal'
  | 'scandinavian'
  | 'luxury'
  | 'industrial'
  | 'traditional'
  | 'japandi';

export interface ColorPalette {
  walls: string;      // HEX
  wallsName: string;
  accent: string;     // HEX
  accentName: string;
  furniture: string;  // HEX
  furnitureName: string;
  curtains: string;   // HEX
  curtainsName: string;
  flooring: string;   // HEX
  flooringName: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  subtitle: string;
  style: DesignStyle;
  palette: ColorPalette;
  floorMaterial: 'light_oak' | 'walnut' | 'marble_white' | 'concrete' | 'carpet_cream' | 'terrazzo';
  wallFinish: 'matte' | 'eggshell' | 'lime_wash' | 'venetian';
  aiRationale: string;
  recommendedLighting: 'Warm 2700K' | 'Soft Neutral 3000K' | 'Daylight 4000K';
  previewImage: string;
}
