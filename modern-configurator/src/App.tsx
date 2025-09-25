import React, { useEffect, useState } from 'react'

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const mainElement = document.querySelector('main')
    if (mainElement) {
      if (isReady) {
        mainElement.classList.remove('is-loading')
      } else {
        mainElement.classList.add('is-loading')
      }
    }
  }, [isReady])

  // Simulate loading for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="iframe-container">
      <div className="iframe-content">
        {!isReady ? (
          <div className="viewer-loading">
            <div className="text-center">
              <div className="spinner spinner-lg mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Embodee Configurator...</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-gray-50">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-blue-600 mb-2 fade-in">
                Embodee Product Configurator
              </h1>
              <p className="text-gray-600 mb-6 slide-up">
                Modern React + TypeScript + Vite implementation with Tailwind CSS
              </p>
              
              {/* CSS Processing Test */}
              <div className="test-css-processing mb-4">
                <p>CSS PROCESSING TEST: If you see this in red with white text, CSS is being processed!</p>
              </div>
              
              {/* Inline Style Test */}
              <div style={{ backgroundColor: 'blue', color: 'white', padding: '20px', marginBottom: '16px' }}>
                <p>INLINE STYLE TEST: If you see this in blue with white text, React is working!</p>
              </div>
              
              {/* Basic CSS Test */}
              <div className="basic-css-test">
                <p>BASIC CSS TEST: If you see this with a gradient background, CSS is working!</p>
              </div>
              
              {/* Tailwind Test - This should be very obvious if styles are working */}
              <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                <p className="text-lg font-bold">TAILWIND TEST: If you see this in red with white text, Tailwind is working!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="card-hover">
                  <p className="text-green-800 text-sm font-medium mb-2">
                    Direct 3D Viewer Integration
                  </p>
                  <p className="text-green-700 text-xs leading-relaxed">
                    Using window.EmbodeeLoader.init() for direct DOM injection
                  </p>
                </div>
                
                <div className="card-hover">
                  <p className="text-blue-800 text-sm font-medium mb-2">
                    Responsive Layout Ready
                  </p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    Side-by-side configurator panel and 3D viewer
                  </p>
                </div>
                
                <div className="card-hover">
                  <p className="text-purple-800 text-sm font-medium mb-2">
                    Iframe Embeddable
                  </p>
                  <p className="text-purple-700 text-xs leading-relaxed">
                    Complete configurator can be embedded in embodee.com
                  </p>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tailwind CSS Integration Test
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-primary">Primary Button</button>
                    <button className="btn btn-secondary">Secondary Button</button>
                    <button className="btn btn-outline">Outline Button</button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-primary btn-sm">Small</button>
                    <button className="btn btn-primary">Medium</button>
                    <button className="btn btn-primary btn-lg">Large</button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="color-swatch bg-red-500"></div>
                    <div className="color-swatch bg-blue-500 color-swatch-selected"></div>
                    <div className="color-swatch bg-green-500"></div>
                  </div>
                  
                  <div className="option-group">
                    <h4 className="option-group-title">Customization Options</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="option-value option-value-selected">A</div>
                      <div className="option-value">B</div>
                      <div className="option-value">C</div>
                      <div className="option-value">D</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 card">
                <p className="text-gray-700 text-sm">
                  <strong>Next Steps:</strong> Implement Embodee API integration, 
                  customization components, and real-time 3D updates.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
