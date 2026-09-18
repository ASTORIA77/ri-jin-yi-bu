import { useState } from 'react';
import { useStore, getProjectsByType } from '../store/useStore';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';

export function LongTermPage() {
  const projects = useStore((s) => s.projects);
  const longTerm = getProjectsByType(projects, 'long-term');
  const addProject = useStore((s) => s.addProject);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Parameters<typeof addProject>[0]) => {
    addProject(data);
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">长期项目</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + 新建项目
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {longTerm.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {longTerm.length === 0 && (
        <p className="text-gray-500">暂无长期项目</p>
      )}

      {showForm && (
        <ProjectForm
          type="long-term"
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
