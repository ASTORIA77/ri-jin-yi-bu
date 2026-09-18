import { Link } from 'react-router-dom';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
  align?: 'left' | 'right';
}

export function ProjectCard({ project, compact, align = 'left' }: ProjectCardProps) {
  if (compact) {
    const alignClasses = align === 'right' ? 'flex-row-reverse text-right' : '';
    return (
      <Link
        to={`/${project.type}/${project.id}`}
        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-50 ${alignClasses}`}
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
        <span className="font-motto text-base text-gray-700 truncate">{project.name}</span>
      </Link>
    );
  }

  return (
    <Link
      to={`/${project.type}/${project.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <span className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: project.color }} />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
          )}
          {project.deadline && (
            <p className="text-xs text-gray-400 mt-2">截止：{project.deadline}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
