// Global type declarations for the Embodee Configurator
import { EmbodeeConfigurator } from './index';

// Embodee API global types
declare global {
  interface Window {
    EmbodeeLoader?: {
      init: (options: {
        workspaceID: string;
        productCode: string;
        containerID: string;
        host: string;
        width: string;
        height: string;
        variant?: string;
        designID?: string;
        [key: string]: any;
      }) => Promise<EmbodeeConfigurator>;
    };
    __DEV__?: boolean;
    __VERSION__?: string;
  }
}

// Embodee configuration interface
export interface EmbodeeConfig {
  workspaceID: string;
  productID: string;
  variant?: string;
  designID?: string;
  container: string | HTMLElement;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onUpdate?: (data: any) => void;
}

// Product data structure
export interface ProductData {
  id: string;
  name: string;
  description?: string;
  variants: ProductVariant[];
  options: ProductOption[];
  materials: ProductMaterial[];
  graphics: ProductGraphic[];
}

export interface ProductVariant {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'color' | 'text' | 'graphic' | 'material';
  values: OptionValue[];
  isRequired?: boolean;
}

export interface OptionValue {
  id: string;
  name: string;
  value: string;
  preview?: string;
  isDefault?: boolean;
}

export interface ProductMaterial {
  id: string;
  name: string;
  type: string;
  color: string;
  preview: string;
}

export interface ProductGraphic {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail?: string;
}

// Configuration state
export interface ConfiguratorState {
  productData: ProductData | null;
  selectedVariant: string | null;
  selectedOptions: Record<string, string>;
  customText: Record<string, string>;
  uploadedGraphics: Record<string, File>;
  isLoading: boolean;
  error: string | null;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  error: string;
  onRetry?: () => void;
}

// Hook return types
export interface UseEmbodeeReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  init: (config: EmbodeeConfig) => Promise<void>;
  destroy: () => void;
  updateConfiguration: (options: Record<string, any>) => void;
}

export interface UseProductDataReturn {
  productData: ProductData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export {};
