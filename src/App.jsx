import React from 'react';
import Wizard from './components/wizard/Wizard';
import useAutoSave from './hooks/useAutoSave';
import { Save, Trash2 } from 'lucide-react';

function App() {
  const { hasDraft, restoreDraft, clearDraft, isRestoring } = useAutoSave();

  if (isRestoring) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Draft Resume Modal */}
      {hasDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Resume Application?</h2>
            <p className="text-gray-600 mb-6">
              We found a saved draft of your previous loan application. Would you like to resume from where you left off, or start a new application?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={clearDraft}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-error" />
                Start Fresh
              </button>
              <button
                onClick={restoreDraft}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Resume Draft
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">
        <header className="bg-primary text-white p-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">LendSwift</h1>
          <p className="mt-2 text-primary-100 opacity-80">Streamlined Loan Application</p>
        </header>
        <main className="p-6 sm:p-10">
          <Wizard />
        </main>
      </div>
    </div>
  );
}

export default App;
