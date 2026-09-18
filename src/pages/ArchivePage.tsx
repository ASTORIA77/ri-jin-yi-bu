import { useStore, getArchivedProjects } from '../store/useStore';

export function ArchivePage() {
  const projects = useStore((s) => s.projects);
  const archived = getArchivedProjects(projects);
  const restoreProject = useStore((s) => s.restoreProject);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">归档</h2>
      <div className="space-y-2">
        {archived.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-gray-700">{p.name}</span>
            </div>
            <button
              onClick={() => restoreProject(p.id)}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              恢复
            </button>
          </div>
        ))}
      </div>
      {archived.length === 0 && (
        <p className="text-gray-500">暂无归档项目</p>
      )}
    </div>
  );
}
