"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getDashboardMonitoringStats } from "../_actions/get-dashboard-monitoring-stats";

export function useDashboardMonitoring() {
  const t = useTranslations("Dashboard");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Controle do Modal Reativo de Doação
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<{ id: number; fullName: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const result = await getDashboardMonitoringStats(selectedMonth);
    if (result.success) {
      setStats(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const openModalFor = (id: number, fullName: string) => {
    setSelectedBeneficiary({ id, fullName });
    setModalOpen(true);
  };

  return {
    t,
    selectedMonth,
    setSelectedMonth,
    stats,
    loading,
    modalOpen,
    setModalOpen,
    selectedBeneficiary,
    openModalFor,
    loadData,
  };
}
