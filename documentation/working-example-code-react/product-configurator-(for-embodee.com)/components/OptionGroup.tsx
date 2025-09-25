import React from 'react';
import type { Option } from '../types';
import OptionValue from './OptionValue';

interface OptionGroupProps {
    option: Option;
    currentSelectionId: string;
    onSelectionChange: (optionId: string, valueId:string) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({ option, currentSelectionId, onSelectionChange }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">{option.name}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {option.values.map((value) => (
                    <OptionValue
                        key={value.id}
                        optionValue={value}
                        isSelected={currentSelectionId === value.id}
                        onClick={() => onSelectionChange(option.id, value.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default OptionGroup;