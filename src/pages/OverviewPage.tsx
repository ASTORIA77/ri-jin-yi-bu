import { useState } from 'react';
import { useStore, getProjectsByType } from '../store/useStore';
import { ProjectCard } from '../components/ProjectCard';
import { MottoCard } from '../components/MottoCard';
import { ProjectForm } from '../components/ProjectForm';

export function OverviewPage() {
  const projects = useStore((s) => s.projects);
  const addProject = useStore((s) => s.addProject);
  const completeProject = useStore((s) => s.completeProject);
  const [showForm, setShowForm] = useState(false);
  const longTerm = getProjectsByType(projects, 'long-term');
  const shortTerm = getProjectsByType(projects, 'short-term');
  const chores = getProjectsByType(projects, 'chores');

  const handleSave = (data: Parameters<typeof addProject>[0]) => {
    addProject(data);
    setShowForm(false);
  };

  return (
    <div className="h-full p-8">
      <div className="max-w-6xl mx-auto h-full">
        {/* Eisenhower Matrix */}
        <div className="relative h-full border-2 border-blue-200 rounded-3xl p-8">
          {/* Axis labels */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-base font-mono text-blue-600 tracking-wider">
            URGENCY
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-base font-mono text-blue-600 tracking-wider">
            IMPORTANCE
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 grid-rows-2 h-full gap-8 pt-8 pb-12 px-12 relative">
            {/* Vertical divider */}
            <div className="absolute left-1/2 top-8 bottom-12 w-0.5 bg-blue-200 -translate-x-1/2 pointer-events-none" />
            {/* Horizontal divider */}
            <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-blue-200 -translate-y-1/2 pointer-events-none" />
            {/* Top-left: Chores (Urgent, Not Important) */}
            <div className="relative">
              <h3 className="text-base font-mono text-blue-600 tracking-wider">CHORES</h3>
              <p className="font-motto font-bold text-base text-gray-400 mt-1 mb-4">糊弄糊弄就完了</p>
              <div className="space-y-1">
                {[...chores].reverse().slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      onChange={() => completeProject(p.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="font-motto text-base text-gray-700 truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-right: Short-term Projects (Urgent, Important) */}
            <div className="relative">
              <h3 className="text-base font-mono text-blue-600 tracking-wider text-right">SHORT-TERM PROJECTS</h3>
              <p className="font-motto font-bold text-base text-gray-400 mt-1 mb-4 text-right">
                短期所得不过是长期收益的具象化
              </p>
              <div className="space-y-1">
                {[...shortTerm].reverse().slice(0, 3).map((p) => (
                  <ProjectCard key={p.id} project={p} compact align="right" />
                ))}
              </div>
            </div>

            {/* Bottom-left: Motto text */}
            <div className="relative flex flex-col items-start justify-center">
              <p className="font-motto font-bold text-gray-500 text-base text-left mb-12">
                总有一些时间，你不是工位上的标准件
              </p>
              <p className="font-cursive font-bold text-7xl text-blue-600 ml-12">
                Be Yourself
              </p>
            </div>

            {/* Bottom-right: Long-term Projects (Not Urgent, Important) */}
            <div className="relative flex flex-col justify-center">
              <h3 className="text-base font-mono text-blue-600 tracking-wider text-right">LONG-TERM PROJECTS</h3>
              <p className="font-motto font-bold text-base text-gray-400 mt-1 mb-4 text-right">
                你不会达到目标的高度，只会跌到系统的水平
              </p>
              <div className="space-y-1">
                {[...longTerm].reverse().slice(0, 3).map((p) => (
                  <ProjectCard key={p.id} project={p} compact align="right" />
                ))}
              </div>
            </div>
          </div>

          {/* Center motto card */}
          <MottoCard />

          {/* Create button */}
          <button
            onClick={() => setShowForm(true)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-300 bg-white/80 backdrop-blur text-gray-500 flex items-center justify-center hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-colors"
            title="新建项目"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {showForm && (
        <ProjectForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
