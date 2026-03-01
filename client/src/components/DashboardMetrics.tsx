import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  LabelList,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { LearningPath } from "../types";
import { useUI } from "../context/UIContext";

interface DashboardMetricsProps {
  paths: LearningPath[];
}

const DashboardMetrics = ({ paths }: DashboardMetricsProps) => {
  const { theme } = useUI();

  const pieData = useMemo(() => {
    const completed = paths.filter((p) => p.isCompleted).length;
    const active = paths.length - completed;
    return [
      { name: "Completed", value: completed, fill: "#10b981" },
      { name: "Active", value: active, fill: "#3b82f6" },
    ];
  }, [paths]);

  const barData = useMemo(() => {
    return paths
      .filter((p) => !p.isCompleted)
      .slice(0, 5)
      .map((p) => {
        const total = p.milestones?.length || 0;
        const done = p.milestones?.filter((m) => m.isCompleted).length || 0;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        return {
          name:
            p.title.length > 15 ? p.title.substring(0, 15) + "..." : p.title,
          Progress: progress,
        };
      });
  }, [paths]);

  if (paths.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {/* DONUT CHART */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Path Status
        </h2>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              />
              <Tooltip
                cursor={{
                  fill:
                    theme === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(148, 163, 184, 0.1)",
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border:
                    theme === "dark"
                      ? "1px solid #334155"
                      : "1px solid #e2e8f0",
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  color: theme === "dark" ? "#f8fafc" : "#0f172a",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                itemStyle={{
                  color: theme === "dark" ? "#cbd5e1" : "#475569",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Active Path Progress (%)
        </h2>
        <div className="flex-1 min-h-[250px]">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={{
                    fill:
                      theme === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(148, 163, 184, 0.1)",
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border:
                      theme === "dark"
                        ? "1px solid #334155"
                        : "1px solid #e2e8f0",
                    backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                    color: theme === "dark" ? "#f8fafc" : "#0f172a",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#cbd5e1" : "#475569",
                  }}
                />
                <Bar
                  dataKey="Progress"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  <LabelList
                    dataKey="Progress"
                    position="top"
                    fill="#94a3b8"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No active paths with milestones to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
