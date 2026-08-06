"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { getBeneficiaries } from "../_actions/get-beneficiaries";
import { toggleBeneficiaryStatus } from "../_actions/toggle-beneficiary-status";
import { deleteBeneficiary } from "../_actions/delete-beneficiary";

export function useBeneficiariesList() {
  const t = useTranslations("Beneficiary");
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const loadData = async (currentPage = 1, searchQuery = "") => {
    setLoading(true);
    const res = await getBeneficiaries({ page: currentPage, pageSize: 8, search: searchQuery });
    if (res.success) {
      setItems(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData(1, search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    loadData(newPage, search);
  };

  const handleToggleStatus = async (id: number, currentStatus: "ACTIVE" | "INACTIVE") => {
    await toggleBeneficiaryStatus(id, currentStatus);
    loadData(page, search);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o cadastro de ${name} e todo o seu histórico?`)) {
      await deleteBeneficiary(id);
      loadData(page, search);
    }
  };

  return {
    t,
    router,
    items,
    loading,
    page,
    totalPages,
    totalCount,
    search,
    setSearch,
    handlePageChange,
    handleToggleStatus,
    handleDelete,
  };
}
