import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { format } from 'date-fns';
import type { ProjectType } from '../types';

interface ProjectDetailProps {
  type: ProjectType;
}

const TYPE_LABELS: Record<ProjectType, string> = {
  'long-term': '长期项目',
  'short-term': '短期项目',
  'chores': '杂活',
};

const SUMMARY_LABELS: Record<string, string> = {
  weekly: '周总结',
  monthly: '月总结',
  quarterly: '季度收获',
};

export function ProjectDetail({ type }: ProjectDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projects = useStore((s) => s.projects);
  const summaries = useStore((s) => s.summaries);
  const updateProject = useStore((s) => s.updateProject);
  const deleteProject = useStore((s) => s.deleteProject);
  const completeProject = useStore((s) => s.completeProject);
  const archiveProject = useStore((s) => s.archiveProject);
  const addSummary = useStore((s) => s.addSummary);
  const updateSummary = useStore((s) => s.updateSummary);
  const deleteSummary = useStore((s) => s.deleteSummary);

  const project = projects.find((p) => p.id === id);
  const projectSummaries = summaries
    .filter((s) => s.projectId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const [newSummaryType, setNewSummaryType] = useState<'weekly' | 'monthly' | 'quarterly' | null>(null);
  const [newSummaryContent, setNewSummaryContent] = useState('');
  const [notesValue, setNotesValue] = useState(project?.notes || '');
  const [showActions, setShowActions] = useState(false);

  if (!project) {
    return (
      <div className="p-8">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
          ← 返回
        </button>
        <p className="text-gray-500">项目不存在</p>
      </div>
    );
  }

  const handleAddSummary = () => {
    if (!newSummaryType || !newSummaryContent.trim()) return;

    const now = new Date();
    let period = '';
    if (newSummaryType === 'weekly') {
      period = format(now, 'yyyy-MM-dd');
    } else if (newSummaryType === 'monthly') {
      period = format(now, 'yyyy-MM');
    } else {
      const quarter = Math.ceil((now.getMonth() + 1) / 3);
      period = `${now.getFullYear()}-Q${quarter}`;
    }

    addSummary({
      projectId: project.id,
      period,
      type: newSummaryType,
      content: newSummaryContent.trim(),
    });

    setNewSummaryContent('');
    setNewSummaryType(null);
  };

  const handleComplete = () => {
    if (confirm('确定标记为完成吗？')) {
      completeProject(project.id);
      navigate(-1);
    }
  };

  const handleArchive = () => {
    if (confirm('确定归档该项目吗？')) {
      archiveProject(project.id);
      navigate(-1);
    }
  };

  const handleDelete = () => {
    if (confirm('确定删除该项目吗？此操作不可恢复。')) {
      deleteProject(project.id);
      navigate(-1);
    }
  };

  const reviewCadence =
    type === 'long-term' ? '每月总结 · 每季度记录收获' : '每周总结 · 每月记录收获';

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            {TYPE_LABELS[type]}
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{project.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {project.status === 'active' && type !== 'long-term' && (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              标记完成
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
              </svg>
            </button>
            {showActions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  <button
                    onClick={() => { handleArchive(); setShowActions(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    归档
                  </button>
                  <button
                    onClick={() => { handleDelete(); setShowActions(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-[1fr_360px] gap-8">
          {/* Left column */}
          <div>
            {/* Project header */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 text-base mb-4">{project.description}</p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {TYPE_LABELS[type]}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                创建于 {format(new Date(project.createdAt), 'yyyy年M月d日')}
              </span>
              {project.deadline && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  计划结束 {project.deadline}
                </span>
              )}
            </div>

            <div className="border-t border-gray-200" />

            {/* Summaries section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">复盘记录</h2>
                {project.status === 'active' && (
                  <div className="relative">
                    {newSummaryType ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {SUMMARY_LABELS[newSummaryType]}
                        </span>
                        <button
                          onClick={() => setNewSummaryType(null)}
                          className="text-sm text-gray-400 hover:text-gray-600"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <SummaryDropdownButton
                        type={type}
                        onSelect={(t) => setNewSummaryType(t)}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* New summary form */}
              {newSummaryType && (
                <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                  <textarea
                    value={newSummaryContent}
                    onChange={(e) => setNewSummaryContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                    rows={3}
                    placeholder="输入内容..."
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleAddSummary}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => { setNewSummaryType(null); setNewSummaryContent(''); }}
                      className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {projectSummaries.length > 0 && (
                <div className="relative pl-6">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />
                  <div className="space-y-6">
                    {projectSummaries.map((s, idx) => (
                      <div key={s.id} className="relative">
                        <div className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          idx === 0 ? 'bg-blue-600' : 'bg-gray-300'
                        }`} />
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-700">
                              {SUMMARY_LABELS[s.type]} · {s.period}
                            </span>
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  const newContent = prompt('编辑内容', s.content);
                                  if (newContent !== null) {
                                    updateSummary(s.id, newContent);
                                  }
                                }}
                                className="text-sm text-gray-400 hover:text-gray-600"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('确定删除这条总结吗？')) {
                                    deleteSummary(s.id);
                                  }
                                }}
                                className="text-sm text-gray-400 hover:text-red-600"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{s.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projectSummaries.length === 0 && (
                <p className="text-gray-400 text-sm py-8 text-center">暂无复盘记录</p>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-base font-bold text-gray-900 mb-4">项目说明</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">目标</p>
                  <p className="text-sm text-gray-700">{project.description || '—'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">复盘节奏</p>
                  <p className="text-sm text-gray-700">{reviewCadence}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">状态</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      project.status === 'active' ? 'bg-blue-600' :
                      project.status === 'completed' ? 'bg-green-600' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm text-gray-700">
                      {project.status === 'active' ? '进行中' :
                       project.status === 'completed' ? '已完成' : '已归档'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {type === 'long-term' && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-base font-bold text-gray-900 mb-3">备注</h3>
                <textarea
                  value={notesValue}
                  onChange={(e) => {
                    setNotesValue(e.target.value);
                    updateProject(project.id, { notes: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  rows={6}
                  placeholder="记录与本项目相关的想法、计划或备注..."
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {notesValue.length} / 500
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryDropdownButton({ type, onSelect }: { type: ProjectType; onSelect: (t: 'weekly' | 'monthly' | 'quarterly') => void }) {
  const [open, setOpen] = useState(false);

  const options = type === 'long-term'
    ? [{ key: 'monthly' as const, label: '月总结' }, { key: 'quarterly' as const, label: '季度收获' }]
    : [{ key: 'weekly' as const, label: '周总结' }, { key: 'monthly' as const, label: '月收获' }];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
      >
        记录复盘
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => { onSelect(opt.key); setOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
