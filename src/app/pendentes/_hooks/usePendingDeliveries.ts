"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getPendingMonthlyDeliveries } from "../_actions/get-pending-monthly-deliveries";

export interface BeneficiaryItem {
  id: number;
  fullName: string;
  document: string;
  phone?: string;
  neighborhood: string;
  notes?: string;
}

export function usePendingDeliveries() {
  const t = useTranslations("Delivery");

  const todayStr = new Date().toISOString().split("T")[0];
  const defaultMonth = todayStr.substring(0, 7);

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [loading, setLoading] = useState(true);
  const [pendingList, setPendingList] = useState<BeneficiaryItem[]>([]);
  const [filterText, setFilterText] = useState("");

  // Modal de Ação Rápida
  const [modalOpen, setModalOpen] = useState(false);
  const [activeBeneficiary, setActiveBeneficiary] = useState<{ id: number; fullName: string } | null>(null);

  const loadPending = async (month: string) => {
    setLoading(true);
    const res = await getPendingMonthlyDeliveries(month);
    if (res.success) {
      setPendingList(res.items as BeneficiaryItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPending(selectedMonth);
  }, [selectedMonth]);

  const openModal = (id: number, fullName: string) => {
    setActiveBeneficiary({ id, fullName });
    setModalOpen(true);
  };

  const reloadCurrentMonth = () => {
    loadPending(selectedMonth);
  };

  const filteredItems = pendingList.filter((item) => {
    const query = filterText.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(query) ||
      item.neighborhood.toLowerCase().includes(query) ||
      item.document.includes(query)
    );
  });

  return {
    t,
    selectedMonth,
    setSelectedMonth,
    loading,
    filterText,
    setFilterText,
    pendingList,
    filteredItems,
    modalOpen,
    setModalOpen,
    activeBeneficiary,
    openModal,
    reloadCurrentMonth,
  };
}
