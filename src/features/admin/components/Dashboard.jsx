import React, { useState, useEffect } from 'react';
import { getDashboardStatsAPI, getUserGrowthAPI, getTopicDistributionAPI, getReportWeeklyAPI } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatNumber = (n) => {
  if (n === undefined || n === null) return '0';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
};

// ── SVG Icons (inline, no external deps) ─────────────────────────────────────
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconFileText = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconTrendUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, trend, colorScheme }) => {
  const schemes = {
    blue: {
      bg: 'bg-blue-50/60',
      border: 'border-blue-100',
      iconBg: 'bg-blue-100 text-blue-600',
      value: 'text-blue-700',
      trend: 'text-blue-500 bg-blue-100',
    },
    green: {
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-600',
      value: 'text-emerald-700',
      trend: 'text-emerald-600 bg-emerald-100',
    },
    red: {
      bg: 'bg-red-50/80',
      border: 'border-red-200',
      iconBg: 'bg-red-100 text-red-600',
      value: 'text-red-600',
      trend: 'text-red-600 bg-red-100',
    },
    neutral: {
      bg: 'bg-gray-50/60',
      border: 'border-gray-100',
      iconBg: 'bg-gray-100 text-gray-600',
      value: 'text-gray-800',
      trend: 'text-gray-500 bg-gray-100',
    },
  };

  const s = schemes[colorScheme] || schemes.neutral;

  return (
    <div className={`relative flex flex-col gap-4 p-5 rounded-2xl border ${s.bg} ${s.border} overflow-hidden transition-shadow hover:shadow-md`}>
      {/* Decorative blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 ${s.iconBg.split(' ')[0]}`} />

      <div className="flex items-start justify-between relative z-10">
        <div className={`p-2.5 rounded-xl ${s.iconBg}`}>{icon}</div>
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${s.trend}`}>
            <IconTrendUp />
            {trend}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className={`text-3xl font-black tracking-tight ${s.value}`}>{formatNumber(value)}</p>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mt-1">{label}</p>
      </div>
    </div>
  );
};

// ── Bar Chart (Tailwind-simulated) ────────────────────────────────────────────
const BarChartSimulated = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex gap-2 h-40 pt-2">
      {data.map((d, i) => {
        const height = Math.round((d.value / max) * 100);
        const isMax = d.value === max;
        return (
          <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
            <span className={`text-[10px] font-black mb-1 transition-all duration-300 ${isMax ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
              {d.value}
            </span>
            <div className="w-full relative flex-1 flex items-end justify-center px-1">
              <div
                className={`w-full rounded-t-md transition-all duration-700 ease-out shadow-sm border-t border-x ${isMax ? 'bg-blue-600 border-blue-700' : 'bg-blue-100 border-blue-200 group-hover:bg-blue-300'}`}
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 mt-2">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Horizontal Bar Chart (Space distribution) ─────────────────────────────────
const SpaceBarChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="space-y-3 pt-2">
      {/* Segmented bar */}
      <div className="flex rounded-xl overflow-hidden h-4 gap-0.5">
        {data.map((d, i) => (
          <div
            key={i}
            className="transition-all duration-700 first:rounded-l-xl last:rounded-r-xl"
            style={{ width: `${d.value}%`, backgroundColor: d.color }}
            title={`${d.label}: ${d.value}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs font-semibold text-gray-600">{d.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
              </div>
              <span className="text-[11px] font-black text-gray-700 w-8 text-right">{d.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Dashboard Component ──────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [data, setData] = useState({
    stats: null,
    urgentReports: [],
    growthData: [],
    topicDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, growthRes, topicRes, reportsRes] = await Promise.all([
          getDashboardStatsAPI(),
          getUserGrowthAPI(),
          getTopicDistributionAPI(),
          getReportWeeklyAPI()
        ]);
        
        // Cấu trúc dữ liệu giả định từ Backend
        setData({
          stats: statsRes?.stats || statsRes,
          urgentReports: reportsRes.items || [],
          growthData: growthRes || [],
          topicDistribution: topicRes || []
        });
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const { stats, urgentReports, growthData, topicDistribution } = data;

  const formattedDate = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Tổng quan Hệ thống</h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">
            Xin chào, <span className="font-bold text-gray-700">Admin</span> 👋 &mdash; {formattedDate}, {formattedTime}
          </p>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<IconUsers />}
          label="Tổng Người dùng"
          value={stats.totalUsers}
          trend={stats.userGrowthPercent > 0 ? `+${stats.userGrowthPercent}%` : `${stats.userGrowthPercent}%`}
          colorScheme="blue"
        />
        <StatCard
          icon={<IconFileText />}
          label="Bài Viết Tuần Này"
          value={stats.weeklyPosts}
          trend={stats.postGrowthPercent > 0 ? `+${stats.postGrowthPercent}%` : `${stats.postGrowthPercent}%`}
          colorScheme="green"
        />
        <StatCard
          icon={<IconAlertTriangle />}
          label="Báo Cáo Mới (Tuần)"
          value={stats.weeklyReports}
          trend={stats.reportGrowthPercent > 0 ? `+${stats.reportGrowthPercent}%` : `${stats.reportGrowthPercent}%`}
          colorScheme="red"
        />
        <StatCard
          icon={<IconHeart />}
          label="Tương Tác Tuần"
          value={stats.weeklyInteractions}
          trend={stats.interactionGrowthPercent > 0 ? `+${stats.interactionGrowthPercent}%` : `${stats.interactionGrowthPercent}%`}
          colorScheme="neutral"
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar Chart: User Growth */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Biểu đồ</p>
              <h2 className="text-sm font-black text-gray-900 mt-0.5">Tăng trưởng người dùng mới</h2>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Năm 2026
              </span>
            </div>
          </div>

          <BarChartSimulated 
            data={growthData.length > 0 ? growthData : [{ month: 'N/A', value: 0 }]} 
          />

          {/* Summary row */}
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Trung bình: <span className="text-gray-900">
                {growthData.length > 0 
                  ? Math.round(growthData.reduce((s, d) => s + d.value, 0) / growthData.length)
                  : 0}
              </span> người dùng/tháng
            </p>
          </div>
        </div>

        {/* Horizontal Bar Chart: Space Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Biểu đồ</p>
              <h2 className="text-sm font-black text-gray-900 mt-0.5">Tỷ lệ Bài viết theo chủ đề</h2>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
              Chủ đề
            </span>
          </div>

          <SpaceBarChart 
            data={[...topicDistribution]
              .sort((a, b) => b.value - a.value)
              .map((t, i) => ({
                ...t,
                color: ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#e5e7eb'][i % 7]
              }))} 
          />

          <div className="mt-5 pt-4 border-t border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Tổng số báo cáo hệ thống: <span className="text-gray-900">{stats.totalReports}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Urgent Reports Table ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl text-red-600">
              <IconAlertTriangle />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900">Việc cần làm ngay</h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">Báo cáo vi phạm đang chờ xử lý</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {stats.weeklyReports} báo cáo mới tuần này
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['#', 'Người bị báo cáo', 'Lý do vi phạm', 'Thời gian', 'Hành động'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {urgentReports.map((report, idx) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-black text-gray-300">#{String(idx + 1).padStart(2, '0')}</span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-xs text-gray-500 border border-gray-200 flex-shrink-0">
                        {report.targetName?.charAt(0) || report.target_name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">{report.targetName || report.target_name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 ring-1 ring-amber-200 whitespace-nowrap">
                      {report.reason}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-400 font-medium whitespace-nowrap">
                    {report.createdAt || report.created_at}
                  </td>

                  <td className="px-5 py-4">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-700 transition-all shadow-sm whitespace-nowrap group-hover:shadow-md">
                      Xử lý ngay
                      <IconArrowRight />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Hiển thị <span className="text-gray-900">{urgentReports.length}</span> báo cáo khẩn cấp
          </p>
          <button className="text-[11px] font-black text-gray-500 hover:text-gray-900 uppercase tracking-wider transition-colors flex items-center gap-1"
            onClick={() => navigate('/admin/reports')}>
            Xem tất cả <IconArrowRight />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;