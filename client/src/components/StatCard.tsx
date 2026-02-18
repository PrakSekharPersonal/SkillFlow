import React from "react";

interface StateCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  isText?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  isText = false,
}: StateCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <p
          className={`font-extrabold text-slate-800 dark:text-slate-100 ${isText ? "text-base truncate max-w-[150px]" : "text-2xl"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
