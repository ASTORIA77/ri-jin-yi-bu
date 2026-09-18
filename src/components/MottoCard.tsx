import { useState } from 'react';
import { useStore } from '../store/useStore';

export function MottoCard() {
  const motto = useStore((s) => s.motto);
  const setMotto = useStore((s) => s.setMotto);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(motto);

  const handleSave = () => {
    setMotto(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[288px] bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <div className="w-6 h-px bg-blue-200 mx-auto mb-3" />
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-motto w-full text-center text-lg text-slate-700 tracking-wide resize-none outline-none"
          rows={2}
          placeholder="输入座右铭..."
          autoFocus
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            保存
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            取消
          </button>
        </div>
        <div className="w-6 h-px bg-blue-200 mx-auto mt-3" />
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[288px] bg-white rounded-xl shadow-md p-6 border border-blue-100 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="w-6 h-px bg-blue-200 mx-auto mb-3" />
      <p className="font-motto font-bold text-center text-lg text-slate-700 tracking-wide">
        {motto || '重要的事情没有那么多。'}
      </p>
      <div className="w-6 h-px bg-blue-200 mx-auto mt-3" />
    </div>
  );
}
