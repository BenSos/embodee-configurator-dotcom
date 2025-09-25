
import React from 'react';
import type { OptionValue as OptionValueType } from '../types';

interface OptionValueProps {
    optionValue: OptionValueType;
    isSelected: boolean;
    onClick: () => void;
}

const OptionValue: React.FC<OptionValueProps> = ({ optionValue, isSelected, onClick }) => {
    const baseClasses = "relative w-full aspect-square rounded-md cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const selectedClasses = isSelected ? "ring-2 ring-indigo-600 ring-offset-2 shadow-lg scale-105" : "ring-1 ring-gray-300 hover:ring-indigo-400 hover:scale-105";

    const style: React.CSSProperties = {};
    if (optionValue.color) {
        style.backgroundColor = optionValue.color;
    }
    if (optionValue.thumbnailUrl) {
        style.backgroundImage = `url(${optionValue.thumbnailUrl})`;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
    }

    return (
        <div className="flex flex-col items-center space-y-1.5">
            <button
                type="button"
                className={`${baseClasses} ${selectedClasses}`}
                style={style}
                onClick={onClick}
                aria-pressed={isSelected}
                title={optionValue.name}
            >
                {!optionValue.color && !optionValue.thumbnailUrl && (
                    <span className="text-xs text-gray-700">{optionValue.name}</span>
                )}
            </button>
            <span className={`text-xs text-center truncate w-full ${isSelected ? 'font-semibold text-indigo-700' : 'text-gray-600'}`}>{optionValue.name}</span>
        </div>
    );
};

export default OptionValue;
