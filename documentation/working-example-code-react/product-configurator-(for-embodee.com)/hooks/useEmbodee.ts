
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Selections, UiNode, LibraryItem, ViewerConfig, Option, ConfiguratorDisplayOption, TextOption } from '../types';

// Helper to parse the UI structure from the Embodee API into a format the UI components can use
const parseUiStructure = (nodes: UiNode[]): { options: ConfiguratorDisplayOption[], selections: Selections } => {
    const options: ConfiguratorDisplayOption[] = [];
    const selections: Selections = {};

    const traverse = (node: UiNode) => {
        // Case 1: Handle Text Decals based on documentation (type/subtype)
        if (node.type === 'decal' && node.subtype === 'text' && node.props?.text) {
            const textProps = node.props.text;

            const textOption: TextOption = {
                type: 'text',
                id: node.code,
                name: node.name,
                // Initialize with a placeholder, will be overwritten if a dynamic text prop is found
                text: { propName: '', label: '', value: '' },
            };

            // Iterate over the properties within the 'text' object (e.g., text, font, fillcolor)
            for (const propName in textProps) {
                const prop = textProps[propName];

                // Skip properties that are not meant to be changed by the user
                if (!prop || prop.dynamic === false) continue;

                const optionId = `${node.code}:${propName}`;

                if (prop.type === 'text') {
                    textOption.text = {
                        propName: propName,
                        label: prop.label,
                        value: prop.value
                    };
                    selections[optionId] = prop.value;
                } else if (prop.type === 'list' && prop.items) {
                    const itemValues: LibraryItem[] = Object.values(prop.items);

                    if (itemValues.length > 0) {
                        const isColor = propName.toLowerCase().includes('color');
                        
                        const subOption: Option = {
                            id: optionId,
                            name: prop.label,
                            values: itemValues.map(item => ({
                                id: item.id,
                                name: item.name,
                                color: isColor ? `#${item.value}` : null,
                                thumbnailUrl: null,
                            })),
                        };
                        
                        // Assign to font or color based on property name
                        if (propName.toLowerCase().includes('font')) {
                            textOption.font = subOption;
                        } else if (isColor) {
                            textOption.color = subOption;
                        }
                        
                        if (prop.value) {
                            selections[optionId] = prop.value;
                        }
                    }
                }
            }
             // Only add the component if it has a customizable text field
            if (textOption.text.propName) {
                options.push(textOption);
            }
        
        // Case 2: Handle all other standard components
        } else if (node.props) {
            for (const propName in node.props) {
                const prop = node.props[propName];
                // Standard components have an `items` function
                if (prop && typeof prop.items === 'function') {
                    const items = prop.items();
                    const itemValues: LibraryItem[] = Object.values(items);

                    if (itemValues.length > 0) {
                        const optionId = `${node.code}:${propName}`;
                        options.push({
                            id: optionId,
                            name: `${node.name} ${propName.charAt(0).toUpperCase() + propName.slice(1)}`,
                            values: itemValues.map(item => ({
                                id: item.id,
                                name: item.name,
                                color: propName === 'color' ? `#${item.value}` : null,
                                thumbnailUrl: propName === 'material' ? item.value : null,
                            })),
                        });
                        if (prop.value) {
                            selections[optionId] = prop.value;
                        }
                    }
                }
            }
        }

        if (node.children) {
            node.children.forEach(traverse);
        }
    };

    nodes.forEach(traverse);
    return { options, selections };
};


export const useEmbodee = () => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [options, setOptions] = useState<ConfiguratorDisplayOption[]>([]);
    const [selections, setSelections] = useState<Selections>({});
    const [config, setConfig] = useState<ViewerConfig | null>(null);
    const [library, setLibrary] = useState<any>(null);
    const [productData, setProductData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const configuratorRef = useRef<any>(null); // Using `any` for the Configurator instance type

    useEffect(() => {
        const initializeConfigurator = async () => {
            const waitForEmbodeeLoader = (): Promise<void> => {
                return new Promise((resolve, reject) => {
                    const maxRetries = 150; // 150 * 200ms = 30 seconds timeout
                    let attempt = 0;
                    const interval = setInterval(() => {
                        if (typeof window.EmbodeeLoader?.init === 'function') {
                            clearInterval(interval);
                            resolve();
                        } else if (++attempt > maxRetries) {
                            clearInterval(interval);
                            reject(new Error("The 3D viewer script failed to load in time."));
                        }
                    }, 200);
                });
            };

            try {
                await waitForEmbodeeLoader();
            } catch (err) {
                const message = err instanceof Error ? err.message : "An unknown error occurred.";
                console.error(message, err);
                setError(message);
                return;
            }

            try {
                const WORKSPACE_ID = "qcxwobokwv";
                const PRODUCT_CODE = "Tee00198468";

                const productDataResponse = await fetch(`https://embodee.app/configurator/get-data/${WORKSPACE_ID}/${PRODUCT_CODE}/Master/false`);
                if (!productDataResponse.ok) {
                    throw new Error(`HTTP error fetching product data! status: ${productDataResponse.status}`);
                }
                const pData = await productDataResponse.json();
                setProductData(pData);
                console.log("Full Product Data loaded:", pData);

                const configurator = await window.EmbodeeLoader.init({
                    containerID: 'embodee-configurator',
                    workspaceID: WORKSPACE_ID,
                    productCode: PRODUCT_CODE,
                    width: "100%",
                    height: "100%",
                    host: 'https://embodee.app',
                });
                configuratorRef.current = configurator;

                const handleProductReady = () => {
                    const { options, selections } = parseUiStructure(configurator.uiStructure);
                    setOptions(options);
                    setSelections(selections);
                    
                    const viewerConfig = configurator.config;
                    const lib = configurator.library;
                    setConfig(viewerConfig);
                    setLibrary(lib);

                    console.log("Embodee Library loaded:", lib);
                    console.log("Embodee Viewer Config loaded:", viewerConfig);
                    console.log("Parsed UI Options:", options);
                    console.log("Initial Selections:", selections);

                    setIsReady(true);
                };

                configurator.subscribe(configurator.eventIDs.productReady, handleProductReady);

            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to initialize the 3D viewer.";
                console.error(message, err);
                setError(message);
            }
        };

        initializeConfigurator();
    }, []);

    const updateSelection = useCallback(async (optionId: string, value: string, isCustom: boolean = false) => {
        const configurator = configuratorRef.current;
        if (!isReady || !configurator) return;

        const [componentCode, property] = optionId.split(':');
        if (!componentCode || !property) {
            console.error("Invalid optionId format:", optionId);
            return;
        }

        const originalSelections = selections;
        setSelections(prev => ({ ...prev, [optionId]: value }));

        try {
            await configurator.setComponentValue(componentCode, property, value, isCustom);
        } catch (err) {
            console.error("Failed to update selection:", err);
            setError("Failed to apply selection. Please try again.");
            setSelections(originalSelections);
        }
    }, [isReady, selections]);

    return { isReady, options, selections, updateSelection, error, config, library, productData };
};
