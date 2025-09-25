
import React, { useState } from 'react';
import type { Option } from '../types';

interface ProductDataModalProps {
    options: Option[];
    config: any;
    library: any;
    productData: any;
    onClose: () => void;
}

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void;}> = ({ title, isActive, onClick }) => {
    const activeClasses = "border-indigo-500 text-indigo-600";
    const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${isActive ? activeClasses : inactiveClasses}`}
            role="tab"
            aria-selected={isActive}
        >
            {title}
        </button>
    );
};

// Helper to render JSON with search term highlighting
const HighlightedJson: React.FC<{ data: any, term: string }> = ({ data, term }) => {
    const jsonString = JSON.stringify(data, null, 2);
    
    if (!term.trim()) {
        return <code>{jsonString}</code>;
    }

    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    const parts = jsonString.split(regex);

    return (
        <code>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <mark key={i} className="bg-yellow-300 text-black px-0.5 rounded-sm">{part}</mark>
                ) : (
                    part
                )
            )}
        </code>
    );
};


const ProductDataModal: React.FC<ProductDataModalProps> = ({ options, config, library, productData, onClose }) => {
    const [activeTab, setActiveTab] = useState('options');
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);
    
    const renderContent = () => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        switch (activeTab) {
            case 'options':
                const filteredOptions = options
                    .map(option => ({
                        ...option,
                        values: option.values.filter(value => value.name.toLowerCase().includes(lowerCaseSearchTerm))
                    }))
                    .filter(option => 
                        option.name.toLowerCase().includes(lowerCaseSearchTerm) || option.values.length > 0
                    );

                return (
                    <div className="space-y-6">
                        <p className="text-gray-600">This is the structured data defining the customizable options and available values for the product, as parsed for the main UI panel.</p>
                        {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                            <div key={option.id}>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">{option.name}</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {option.values.map((value) => (
                                        <li key={value.id}>{value.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )) : <p className="text-gray-500">No options found matching your search.</p>}
                    </div>
                );
            case 'productData':
                return (
                     <div>
                        <p className="text-gray-600 mb-4">This is the raw product data JSON from the get-data endpoint, containing the complete product definition.</p>
                        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[55vh]">
                            <HighlightedJson data={productData} term={searchTerm} />
                        </pre>
                    </div>
                );
            case 'config':
                return (
                     <div>
                        <p className="text-gray-600 mb-4">This is the raw product configuration JSON, containing component definitions, layers, UI structure, and more.</p>
                        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[55vh]">
                            <HighlightedJson data={config} term={searchTerm} />
                        </pre>
                    </div>
                );
            case 'library':
                return (
                    <div>
                        <p className="text-gray-600 mb-4">This is the raw asset library JSON, containing colors, fonts, materials, and other assets available to the configurator.</p>
                        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[55vh]">
                             <HighlightedJson data={library} term={searchTerm} />
                        </pre>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-data-title"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 id="product-data-title" className="text-2xl font-bold text-gray-800">Product Data</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-2 px-5" role="tablist" aria-label="Product Data Tabs">
                        <TabButton title="UI Options" isActive={activeTab === 'options'} onClick={() => setActiveTab('options')} />
                        <TabButton title="Product Data" isActive={activeTab === 'productData'} onClick={() => setActiveTab('productData')} />
                        <TabButton title="Product Config" isActive={activeTab === 'config'} onClick={() => setActiveTab('config')} />
                        <TabButton title="Asset Libraries" isActive={activeTab === 'library'} onClick={() => setActiveTab('library')} />
                    </nav>
                </div>

                <div className="p-6 flex-1 flex flex-col overflow-y-hidden">
                    <div className="mb-4">
                        <input 
                            type="search"
                            placeholder="Search in this tab..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto" role="tabpanel">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDataModal;
