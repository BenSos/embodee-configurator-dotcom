
import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useEmbodee } from './hooks/useEmbodee';
import ConfiguratorPanel from './components/ConfiguratorPanel';
import ConfiguratorPanelSkeleton from './components/ConfiguratorPanelSkeleton';
import ProductDataModal from './components/ProductDataModal';
import type { Option } from './types';

const App: React.FC = () => {
    const { isReady, options, selections, updateSelection, error, config, library, productData } = useEmbodee();
    const [isDataModalOpen, setDataModalOpen] = useState(false);

    useEffect(() => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
            if (isReady) {
                mainElement.classList.remove('is-loading');
            } else {
                mainElement.classList.add('is-loading');
            }
        }
    }, [isReady]);

    // Add event listener to the button outside of the React root
    useEffect(() => {
        const button = document.getElementById('show-data-btn');
        if (button) {
            if (isReady) {
                const handleClick = () => setDataModalOpen(true);
                button.addEventListener('click', handleClick);
                button.removeAttribute('disabled');

                return () => button.removeEventListener('click', handleClick);
            } else {
                 button.setAttribute('disabled', 'true');
            }
        }
    }, [isReady]);
    
    // Create a flattened list of options for the data modal, which expects a simple array of Option
    const flatOptionsForModal = useMemo(() => {
        return options.reduce((acc, opt) => {
            if ('type' in opt && opt.type === 'text') {
                if (opt.font) acc.push(opt.font);
                if (opt.color) acc.push(opt.color);
            } else {
                acc.push(opt as Option);
            }
            return acc;
        }, [] as Option[]);
    }, [options]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-red-50">
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="mt-4 text-xl font-semibold text-red-800">An Error Occurred</h2>
                <p className="mt-2 text-red-700">{error}</p>
                <p className="mt-4 text-sm text-gray-600">Please try refreshing the page. If the problem persists, it may be a temporary issue with the service.</p>
            </div>
        );
    }

    // Portal requires the target element to exist
    const modalPortalTarget = typeof window !== 'undefined' ? document.getElementById('modal-portal') : null;

    return (
        <>
            <div className="h-full w-full bg-white text-gray-800">
                {isReady ? (
                    <ConfiguratorPanel
                        options={options}
                        selections={selections}
                        onSelectionChange={updateSelection}
                        productName={config?.product?.name}
                    />
                ) : (
                    <ConfiguratorPanelSkeleton />
                )}
            </div>
            {isDataModalOpen && modalPortalTarget && createPortal(
                <ProductDataModal 
                    options={flatOptionsForModal}
                    config={config}
                    library={library}
                    productData={productData}
                    onClose={() => setDataModalOpen(false)} 
                />,
                modalPortalTarget
            )}
        </>
    );
};

export default App;
