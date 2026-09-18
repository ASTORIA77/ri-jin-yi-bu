import { useState } from 'react';
import type { Project, ProjectType } from '../types';

interface ProjectFormProps {
  type?: ProjectType;
  project?: Project;
  onSave: (data: Omit<Project, 'id' | 'createdAt' | 'status'>) => void;
  onClose: () => void;
}

const COLORS = [
  '#2563EB', // 蓝色（主色）
  '#3B82F6', // 浅蓝
  '#6366F1', // 靛蓝
  '#8B5CF6', // 紫色
  '#0EA5E9', // 天蓝
  '#14B8A6', // 青色
  '#64748B', // 灰色
];

export function ProjectForm({ type, project, onSave, onClose }: ProjectFormProps) {
  const [projectType, setProjectType] = useState<ProjectType>(type || 'long-term');
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [color, setColor] = useState(project?.color || COLORS[0]);
  const [deadline, setDeadline] = useState(project?.deadline?.split('T')[0] || '');
  const [notes, setNotes] = useState(project?.notes || '');

  const deadlineValid = !deadline || /^\d{4}-\d{2}-\d{2}$/.test(deadline);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!deadlineValid) return;

    onSave({
      type: projectType,
      name: name.trim(),
      description: description.trim(),
      color,
      deadline: projectType === 'short-term' ? deadline : undefined,
      notes: projectType === 'long-term' ? notes : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {project ? '编辑项目' : '新建项目'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          {!type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">项目类型</label>
              <div className="grid grid-cols-3 gap-2">
                {(['long-term', 'short-term', 'chores'] as ProjectType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setProjectType(t)}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      projectType === t
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t === 'long-term' ? '长期' : t === 'short-term' ? '短期' : '杂活'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入项目名称"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              placeholder="可选"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === c ? 'border-gray-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Deadline (short-term only) */}
          {projectType === 'short-term' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="2025-10-31"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  deadline && !deadlineValid ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {deadline && !deadlineValid && (
                <p className="text-xs text-red-500 mt-1">请输入 YYYY-MM-DD 格式，如 2025-10-31</p>
              )}
            </div>
          )}

          {/* Notes (long-term only) */}
          {projectType === 'long-term' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="可选"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
