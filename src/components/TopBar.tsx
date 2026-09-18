import { useState } from 'react';
import { ProjectForm } from './ProjectForm';
import { useStore } from '../store/useStore';
import type { ProjectType } from '../types';

interface TopBarProps {
  defaultType?: ProjectType;
}

export function TopBar({ defaultType }: TopBarProps) {
  const [showForm, setShowForm] = useState(false);
  const addProject = useStore((s) => s.addProject);

  const handleSave = (data: Parameters<typeof addProject>[0]) => {
    addProject(data);
    setShowForm(false);
  };

  return (
    <>
      <div className="border-b border-gray-200 bg-white px-4 py-2 flex items-center justify-between">
        <div />
        <button
          onClick={() => setShowForm(true)}
          className="w-8 h-8 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {showForm && (
        <ProjectForm
          type={defaultType}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
