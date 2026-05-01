import { useState, useMemo, useCallback } from 'react';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: "u1",
    avatar: "https://i.pravatar.cc/150?u=1",
    full_name: "Nguyễn Hải Đăng",
    email: "dang.nguyen@campushub.edu.vn",
    student_id: "IT2022001",
    department: "Công nghệ Thông tin",
    joined_at: "2024-09-05",
    status: "ACTIVE",
    stats: { total_posts: 45, total_comments: 120, reported_count: 0 },
  },
  {
    id: "u2",
    avatar: "https://i.pravatar.cc/150?u=2",
    full_name: "Trần Thị Bé",
    email: "be.tran@campushub.edu.vn",
    student_id: "BA2021099",
    department: "Quản trị Kinh doanh",
    joined_at: "2023-10-12",
    status: "BANNED",
    stats: { total_posts: 12, total_comments: 8, reported_count: 5 },
  },
  {
    id: "u3",
    avatar: "https://i.pravatar.cc/150?u=3",
    full_name: "Lê Minh Khoa",
    email: "khoa.le@campushub.edu.vn",
    student_id: "EN2023056",
    department: "Kỹ thuật Điện tử",
    joined_at: "2025-02-18",
    status: "ACTIVE",
    stats: { total_posts: 8, total_comments: 31, reported_count: 1 },
  },
  {
    id: "u4",
    avatar: "https://i.pravatar.cc/150?u=4",
    full_name: "Phạm Thị Lan",
    email: "lan.pham@campushub.edu.vn",
    student_id: "AC2022034",
    department: "Kế toán",
    joined_at: "2024-01-20",
    status: "ACTIVE",
    stats: { total_posts: 23, total_comments: 56, reported_count: 0 },
  },
];

export const useUserManagement = () => {
  // ── States ──────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [detailUser, setDetailUser] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  // ── Computed ────────────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((u) => {
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchSearch = !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [users, search, statusFilter]);

  const totalActive = useMemo(() => users.filter((u) => u.status === 'ACTIVE').length, [users]);
  const totalBanned = useMemo(() => users.filter((u) => u.status === 'BANNED').length, [users]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleToggleBan = useCallback((userId) => {
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' } : u)
    );
    setConfirmUser(null);
  }, []);

  return {
    users,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    detailUser,
    setDetailUser,
    confirmUser,
    setConfirmUser,
    filteredUsers,
    totalActive,
    totalBanned,
    handleToggleBan
  };
};
