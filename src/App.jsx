import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center items-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="group">
            <img 
              src={viteLogo} 
              className="h-20 w-20 transition-transform group-hover:scale-110" 
              alt="Vite logo" 
            />
          </a>
          <a href="https://react.dev" target="_blank" className="group">
            <img 
              src={reactLogo} 
              className="h-20 w-20 transition-transform group-hover:scale-110 animate-spin [animation-duration:20s]" 
              alt="React logo" 
            />
          </a>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          Vite + React + 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {' '}Tailwind CSS v4
          </span>
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Count is {count}
          </button>
          
          <p className="mt-6 text-gray-600">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">src/App.jsx</code> and save to test HMR
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">⚡ Vite</h3>
            <p className="text-gray-600 text-sm">Lightning fast build tool</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">⚛️ React</h3>
            <p className="text-gray-600 text-sm">Component-based UI library</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">🎨 Tailwind v4</h3>
            <p className="text-gray-600 text-sm">Next-gen utility-first CSS</p>
          </div>
        </div>
        
        <p className="text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
