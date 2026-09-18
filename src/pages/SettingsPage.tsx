import { useStore } from '../store/useStore';

export function SettingsPage() {
  const projects = useStore((s) => s.projects);
  const summaries = useStore((s) => s.summaries);

  const handleExport = () => {
    const data = {
      projects,
      summaries,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ri-jin-yi-bu-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700 font-medium">设置</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Data management */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">数据管理</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">项目数</p>
                <p className="text-sm text-gray-700">{projects.length}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">总结数</p>
                <p className="text-sm text-gray-700">{summaries.length}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  导出数据
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">关于</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">版本</p>
                <p className="text-sm text-gray-700">日进一步 v0.1.0</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">简介</p>
                <p className="text-sm text-gray-700">个人项目管理工具</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
