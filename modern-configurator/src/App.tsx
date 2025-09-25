import React from 'react';
import { ConfiguratorWrapper } from './components';
import { useEmbodee } from './hooks';

function App() {
  const { isLoading, error, isInitialized } = useEmbodee();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Embodee Product Configurator
          </h1>
          <p className="text-lg text-gray-600">
            Modern React + TypeScript + Vite + Tailwind CSS
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <ConfiguratorWrapper>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Configurator Status
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm font-medium">
                    {isLoading ? 'Loading...' : 'Ready'}
                  </span>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                
                {isInitialized && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-800 text-sm">
                      ✅ Configurator initialized successfully!
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Test URL Parameters
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add these parameters to test the configurator:
                </p>
                <div className="bg-white p-4 rounded border font-mono text-sm">
                  ?workspaceID=demo-workspace&productID=demo-product&variant=Master
                </div>
              </div>
            </div>
          </ConfiguratorWrapper>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with React, TypeScript, Vite, and Tailwind CSS</p>
          <p>Deployed on GitHub Pages</p>
        </footer>
      </div>
    </div>
  );
}

export default App;