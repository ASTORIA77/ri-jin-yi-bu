import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const projects = useStore((s) => s.projects);
  const summaries = useStore((s) => s.summaries);

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
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">日历</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg font-medium text-gray-900 min-w-[140px] text-center">
              {format(currentMonth, 'yyyy年 M月', { locale: zhCN })}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekDays.map((day) => (
              <div key={day} className="py-4 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hasActivity = daysWithActivities.has(dateStr);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-3 border-b border-r border-gray-100 transition-colors ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  } ${isToday ? 'bg-blue-50' : ''}`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm ${
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
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-blue-100" />
            <span>浅蓝色日期：当天有项目、总结或杂活</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-blue-600" />
            <span>深蓝色日期：今天</span>
          </div>
        </div>
      </div>
    </div>
  );
}
