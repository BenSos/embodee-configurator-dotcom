// TypeScript type definitions for Embodee Product Configurator
// Based on actual API response structure from Embodee endpoints

// ============================================================================
// MAIN API RESPONSE TYPES
// ============================================================================

export interface EmbodeeApiResponse<T = any> {
  status: 'ok' | 'error';
  errorcode: number;
  message: string;
  result: T;
}

export interface EmbodeeProductData {
  config: ProductConfig;
  ui: UIStructure[];
  library: ProductLibrary;
  globalLibrary: GlobalLibrary;
}

// ============================================================================
// PRODUCT CONFIGURATION TYPES
// ============================================================================

export interface ProductConfig {
  meta: ProductMeta;
  components: { [componentCode: string]: ComponentConfig };
  ui: UIStructure[];
  layouts: any; // Can be null or contain layout data
}

export interface ProductMeta {
  frames: number;
  special: number;
  revision: string;
  public: boolean;
  colorSpace: number;
  colorApplied: boolean;
  source: string;
  empty: boolean;
  modelrevision: number;
  useTextureLayers: boolean;
  diffuseLayerCount: number;
  encrypted: boolean;
  name: string;
  code: string;
  description: string;
  mtlType: string;
  referenceCode: string;
  inputColorSpace: number;
  sourceFileFormat: string;
  applyAutomaticCategorization: string;
  variants: string[];
  calibration: CalibrationSettings;
  dimensions: Dimensions;
  modelScale: number;
  publish: PublishInfo;
  lighting: string;
  lastSaved: number;
  ibl: IBLSettings;
  tags: string[];
  pro: boolean;
  permissions: Permissions;
  watermark: boolean;
}

export interface CalibrationSettings {
  colorspaceLightness: number;
  colorspaceShadowiness: number;
  colorspaceGammaFineTuner: number;
}

export interface Dimensions {
  x: number;
  y: number;
  z: number;
}

export interface PublishInfo {
  publisher: {
    author: string;
    time: number;
  };
  variants: string[];
}

export interface IBLSettings {
  lights_Brightness: string;
  ibl_Brightness: string;
  ibl_BackgroundBrightness: string;
  ibl_Background_Blurriness: string;
  ibl_Desaturation: string;
  ibl_Color: string;
  iblRotateUV: string;
  iblTexture: string;
  iblTexture2: string;
  iblTexture3: string;
  iblTexture4: string;
  iblTexture5: string;
  iblTexture6: string;
  iblTexture7: string;
  __showEnv: string;
  __preset: string;
}

export interface Permissions {
  limitStorage: number;
  limitProAccounts: number;
  limitSharedLinks: number;
  limitProductLines: number;
  '2Dto3DConversion': number;
  limitProducts: number;
  limitSpaces: number;
  limitSnapshotResolution: number;
  limitTextureDownloadMaxRes: string;
  allowTurntableSnapshots: boolean;
  allowMultipleProductUpload: boolean;
  allowCreateUiTab: boolean;
  allowRulesTab: boolean;
  allow2DEditor: boolean;
  allowUploadableGraphics: boolean;
  allowManageColors: boolean;
  allowProductTags: boolean;
  allowDetailedViews: boolean;
  allowColorizableSvg: boolean;
  allowDynamicText: boolean;
  allowEffects: boolean;
  allowProductFiles: boolean;
  allowCreateOptions: boolean;
  allowProductSetup: boolean;
  hideProductFilesTab: boolean;
  allowBulkDownloads: boolean;
  allowVariantsDownload: boolean;
  allowLinkExpirationEdit: boolean;
  allowEmbeddedVariants: boolean;
  allowVariantDownload: boolean;
  isFolio3DAccount: boolean;
  allowOnlineUsersCheck: boolean;
  allowLocalization: boolean;
  allowSpaceSnapshot: boolean;
  allowBulkGridActions: boolean;
  allowRecipeFiles: boolean;
  allowAseImport: boolean;
  allowOrchidsTrimLibrary: boolean;
  allowSwatchBook: boolean;
  allowXtexU3m: boolean;
  showSampleProducts: boolean;
  allowAnnotations: boolean;
  allowKioskMode: boolean;
  allowAI: string;
  allowPasskeys: boolean;
  showApiKey: boolean;
  allowSharedSpaceTemplates: boolean;
  allowOwnSpaceTemplates: boolean;
  allowedSharedSpaceTemplateByTag: string;
  allowStatusFilter: boolean;
  allowPrintReadyFiles: boolean;
  allowVectorPrintReadyFiles: boolean;
  allowUseZones: boolean;
  allowDesignIds: boolean;
  showText: string;
}

// ============================================================================
// COMPONENT CONFIGURATION TYPES
// ============================================================================

export interface ComponentConfig {
  __code: string;
  __type: 'component' | 'folder' | 'print' | 'decal' | 'group';
  __help?: string;
  __toggle?: boolean;
  __disabled?: boolean;
  __side?: boolean;
  hide?: { default: number };
  material?: MaterialConfig;
  color?: ColorConfig;
  print?: PrintConfig;
  decal?: DecalConfig;
  text?: TextConfig;
  [key: string]: any; // For additional component properties
}

export interface MaterialConfig {
  default: string;
  available: { [materialId: string]: string };
  shader?: { [materialId: string]: ShaderConfig };
}

export interface ShaderConfig {
  __scale?: string;
  __offset?: string;
  __rotate?: string;
  [key: string]: any; // Shader properties are dynamic
}

export interface ColorConfig {
  default?: string;
  available?: string[];
  selected?: string;
}

export interface PrintConfig {
  default?: string;
  available?: { [printId: string]: string };
  selected?: string;
}

export interface DecalConfig {
  default?: string;
  available?: { [decalId: string]: string };
  selected?: string;
}

export interface TextConfig {
  default?: string;
  available?: { [textId: string]: string };
  selected?: string;
  font?: FontConfig;
  color?: ColorConfig;
}

export interface FontConfig {
  default?: string;
  available?: { [fontId: string]: string };
  selected?: string;
}

// ============================================================================
// UI STRUCTURE TYPES
// ============================================================================

export interface UIStructure {
  name: string;
  view: number;
  type: 'step' | 'group' | 'component';
  visible: number;
  desc: string;
  available?: UIItem[];
  optional?: number;
  on?: number;
  code: string;
  order: number;
  color?: ColorConfig;
  parent?: string | null;
}

export interface UIItem {
  code: string;
  type: 'component' | 'mesh' | 'group';
  visible: boolean | number;
  name: string;
  optional?: boolean;
  available?: UIMeshItem[];
  parent?: string | null;
  view?: number;
  id?: string;
}

export interface UIMeshItem {
  code: string;
  name: string;
  type: 'mesh';
  visible: number;
  id: string;
}

// ============================================================================
// LIBRARY TYPES
// ============================================================================

export interface ProductLibrary {
  colors: { [colorId: string]: LibraryColor };
  materials?: { [materialId: string]: LibraryMaterial };
  prints?: { [printId: string]: LibraryPrint };
  decals?: { [decalId: string]: LibraryDecal };
  fonts?: { [fontId: string]: LibraryFont };
}

export interface GlobalLibrary {
  colors: LibraryCategory<LibraryColor>;
  materials?: LibraryCategory<LibraryMaterial>;
  prints?: LibraryCategory<LibraryPrint>;
  decals?: LibraryCategory<LibraryDecal>;
  fonts?: LibraryCategory<LibraryFont>;
}

export interface LibraryCategory<T> {
  _id: string;
  _rev: string;
  prefix: string;
  last_id: number;
  name: string;
  actions: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  available: { [id: string]: T };
}

export interface LibraryColor {
  id: string;
  name: string;
  value: string; // Hex color without #
  code?: string;
  selected?: boolean;
}

export interface LibraryMaterial {
  id: string;
  name: string;
  value: string;
  code?: string;
  selected?: boolean;
}

export interface LibraryPrint {
  id: string;
  name: string;
  value: string;
  code?: string;
  selected?: boolean;
}

export interface LibraryDecal {
  id: string;
  name: string;
  value: string;
  code?: string;
  selected?: boolean;
}

export interface LibraryFont {
  id: string;
  name: string;
  value: string;
  code?: string;
  selected?: boolean;
}

// ============================================================================
// CONFIGURATOR STATE TYPES
// ============================================================================

export interface ConfiguratorState {
  isLoading: boolean;
  error: string | null;
  productData: EmbodeeProductData | null;
  selections: Selections;
  currentView: number;
  isInitialized: boolean;
}

export interface Selections {
  [optionId: string]: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface OptionValue {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  color: string | null;
}

export interface Option {
  id: string; // Composite key, e.g., "componentCode:property"
  name: string;
  values: OptionValue[];
}

export interface TextProperty {
  propName: string;
  label: string;
  value: string;
}

export interface TextOption {
  type: 'text';
  id: string; // component code
  name: string;
  text: TextProperty;
  font?: Option;
  color?: Option;
}

export type ConfiguratorDisplayOption = Option | TextOption;

// ============================================================================
// EMBODEE 3D VIEWER TYPES
// ============================================================================

export interface EmbodeeViewerConfig {
  product: {
    name: string;
    code: string;
  };
  workspaceID: string;
  productCode: string;
  variant?: string;
  designID?: string;
}

export interface EmbodeeConfigurator {
  uiStructure: UIStructure[];
  library: ProductLibrary;
  config: EmbodeeViewerConfig;
  eventIDs: {
    productReady: string;
    [eventName: string]: string;
  };
  subscribe: (event: string, callback: () => void) => void;
  setComponentValue: (componentCode: string, property: string, value: string, isCustom: boolean) => Promise<void>;
  getComponentValue: (componentCode: string, property: string) => string;
  getCurrentSelections: () => Selections;
}

// ============================================================================
// URL PARAMETER TYPES
// ============================================================================

export interface URLParams {
  workspaceID: string;
  productID: string;
  variant?: string;
  designID?: string;
  host?: string;
  width?: string;
  height?: string;
}

// ============================================================================
// GLOBAL WINDOW INTERFACE
// ============================================================================
// Note: Global Window interface is declared in global.d.ts

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseEmbodeeReturn {
  configurator: EmbodeeConfigurator | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  setValue: (componentCode: string, property: string, value: string, isCustom?: boolean) => Promise<void>;
  getValue: (componentCode: string, property: string) => string;
  getSelections: () => Selections;
  // Additional state for components
  productData: EmbodeeProductData | null;
  options: ConfiguratorDisplayOption[];
  selections: Selections;
  isInitialized: boolean;
  // Enhanced error handling and retry
  retry: () => void;
  retryCount: number;
  isRetrying: boolean;
}

export interface UseProductDataReturn {
  productData: EmbodeeProductData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// API SERVICE TYPES
// ============================================================================

export interface EmbodeeApiService {
  getProductData: (workspaceID: string, productID: string, variant?: string, designID?: string) => Promise<EmbodeeProductData>;
  getLibraryData: (workspaceID: string, productID: string) => Promise<GlobalLibrary>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface EmbodeeError {
  code: number;
  message: string;
  details?: any;
}

export interface ApiError extends Error {
  code: number;
  status: number;
  response?: any;
}
