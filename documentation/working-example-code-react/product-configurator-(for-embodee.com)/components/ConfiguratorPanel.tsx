
import React from 'react';
import type { ConfiguratorDisplayOption, Selections } from '../types';
import OptionGroup from './OptionGroup';
import TextOptionGroup from './TextOptionGroup';

interface ConfiguratorPanelProps {
    options: ConfiguratorDisplayOption[];
    selections: Selections;
    onSelectionChange: (optionId: string, value: string, isCustom?: boolean) => void;
    productName?: string;
}

const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({ options, selections, onSelectionChange, productName }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Customize</h1>
                {productName && <p className="mt-1 text-lg text-gray-600">{productName}</p>}
            </div>
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                {options.map((option) => {
                    if ('type' in option && option.type === 'text') {
                       return (
                            <TextOptionGroup
                                key={option.id}
                                option={option}
                                selections={selections}
                                onSelectionChange={onSelectionChange}
                            />
                       );
                    }
                    return (
                        <OptionGroup
                            key={option.id}
                            option={option}
                            currentSelectionId={selections[option.id]}
                            onSelectionChange={onSelectionChange}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ConfiguratorPanel;
