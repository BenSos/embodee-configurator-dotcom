
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

export interface Selections {
    [optionId: string]: string;
}

// Embodee API Types based on documentation

export interface LibraryItem {
    id:string;
    name: string;
    value: string; // Hex color (without #), image URL, etc.
}

// A generic property on a non-text component
export interface UiProperty {
    value: string; // The ID of the currently selected LibraryItem
    items: () => { [id: string]: LibraryItem };
}

// A specific property within a text component's 'text' object
export interface UiTextProperty {
    label: string;
    type: 'bool' | 'int' | 'list' | 'color' | 'text';
    value: any;
    items?: { [id: string]: LibraryItem };
    dynamic?: boolean;
}

export interface UiNode {
    code: string;
    name: string;
    type: 'folder' | 'component' | 'print' | 'decal' | 'group';
    subtype?: 'text' | 'graphic' | 'group-merge' | 'group-select';
    props: {
        // For standard components
        [name: string]: UiProperty;
    } & {
        // For text decals
        text?: {
            [propName: string]: UiTextProperty;
        }
    };
    children: UiNode[];
}

// A reasonable assumption for the structure of the config object
export interface ViewerConfig {
    product: {
        name:string;
        code: string;
    };
    // other potential config properties
}

interface Configurator {
    uiStructure: UiNode[];
    library: { [id: string]: LibraryItem };
    config: ViewerConfig;
    eventIDs: {
        productReady: string;
    };
    subscribe: (event: string, callback: () => void) => void;
    setComponentValue: (componentCode: string, property: string, value: string, isCustom: boolean) => Promise<void>;
}

// Extend the global Window interface to include the Embodee API
declare global {
    interface Window {
        EmbodeeLoader: {
            init: (options: {
                workspaceID: string;
                productCode: string;
                containerID: string;
                host: string;
                width: string;
                height: string;
                [key: string]: any;
            }) => Promise<Configurator>;
        };
    }
}
