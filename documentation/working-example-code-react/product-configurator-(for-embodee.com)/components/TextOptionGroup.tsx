
import React, { useState, useEffect } from 'react';
import type { TextOption, Selections } from '../types';
import OptionValue from './OptionValue';

interface TextOptionGroupProps {
    option: TextOption;
    selections: Selections;
    onSelectionChange: (optionId: string, value: string, isCustom?: boolean) => void;
}

const TextOptionGroup: React.FC<TextOptionGroupProps> = ({ option, selections, onSelectionChange }) => {
    const textPropId = `${option.id}:${option.text.propName}`;
    const [textValue, setTextValue] = useState(selections[textPropId] || '');

    // Sync local text state if the canonical state changes
    useEffect(() => {
        setTextValue(selections[textPropId] || '');
    }, [selections[textPropId]]);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextValue(event.target.value);
    };

    const handleTextBlur = () => {
        // Only call API if value has changed
        if (textValue !== selections[textPropId]) {
            onSelectionChange(textPropId, textValue, true);
        }
    };
    
    const fontOption = option.font;
    const colorOption = option.color;
    
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">{option.name}</h2>
            
            {/* Text Input */}
            <div>
                <label htmlFor={`${option.id}-${option.text.propName}-input`} className="block text-sm font-medium text-gray-700 mb-1">
                    {option.text.label}
                </label>
                <input
                    type="text"
                    id={`${option.id}-${option.text.propName}-input`}
                    value={textValue}
                    onChange={handleTextChange}
                    onBlur={handleTextBlur}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            {/* Font Select */}
            {fontOption && (
                <div>
                    <label htmlFor={`${fontOption.id}-select`} className="block text-sm font-medium text-gray-700 mb-1">
                        {fontOption.name}
                    </label>
                    <select
                        id={`${fontOption.id}-select`}
                        value={selections[fontOption.id] || ''}
                        onChange={(e) => onSelectionChange(fontOption.id, e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {fontOption.values.map(value => (
                            <option key={value.id} value={value.id}>
                                {value.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Color Swatches */}
            {colorOption && (
                 <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{colorOption.name}</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                         {colorOption.values.map((value) => (
                            <OptionValue
                                key={value.id}
                                optionValue={value}
                                isSelected={selections[colorOption.id] === value.id}
                                onClick={() => onSelectionChange(colorOption.id, value.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextOptionGroup;
