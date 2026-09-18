import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export function MiniCalendar() {
  const projects = useStore((s) => s.projects);
  const summaries = useStore((s) => s.summaries);
  const currentMonth = new Date();

  const daysWithActivities = useMemo(() => {
    const days = new Set<string>();
    projects.forEach((p) => {
      if (p.status === 'active') {
        days.add(format(new Date(p.createdAt), 'yyyy-MM-dd'));
      }
    });
    summaries.forEach((s) => {
      days.add(format(new Date(s.createdAt), 'yyyy-MM-dd'));
    });
    return days;
  }, [projects, summaries]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div>
      <div className="text-center text-sm font-medium text-gray-700 mb-1.5">
        {format(currentMonth, 'yyyy年M月')}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="w-11 h-5 flex items-center justify-center text-xs text-gray-400 font-medium"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasActivity = daysWithActivities.has(dateStr);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={`w-11 h-6 flex items-center justify-center text-sm rounded-lg transition-colors ${
                !isCurrentMonth
                  ? 'text-gray-300'
                  : isToday
                  ? 'bg-blue-600 text-white font-semibold'
                  : hasActivity
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700'
              }`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
