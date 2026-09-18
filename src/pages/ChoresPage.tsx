import { useState } from 'react';
import { useStore, getProjectsByType } from '../store/useStore';
import { ProjectForm } from '../components/ProjectForm';

export function ChoresPage() {
  const projects = useStore((s) => s.projects);
  const chores = getProjectsByType(projects, 'chores');
  const completeProject = useStore((s) => s.completeProject);
  const addProject = useStore((s) => s.addProject);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Parameters<typeof addProject>[0]) => {
    addProject(data);
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">杂活</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + 新建杂活
        </button>
      </div>

      <div className="space-y-2">
        {chores.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              onChange={() => completeProject(p.id)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">{p.name}</span>
          </div>
        ))}
      </div>

      {chores.length === 0 && (
        <p className="text-gray-500">暂无杂活</p>
      )}

      {showForm && (
        <ProjectForm
          type="chores"
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
