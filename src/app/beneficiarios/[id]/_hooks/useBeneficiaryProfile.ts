"use client";

import { useEffect, useState, use } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { getBeneficiaryById } from "../../_actions/get-beneficiary-by-id";
import { removeDeliveryRecord } from "../../../_actions/remove-delivery-record";

export function useBeneficiaryProfile(params: Promise<{ id: string }>) {
  const t = useTranslations("Beneficiary");
  const router = useRouter();
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    const res = await getBeneficiaryById(id);
    if (res.success) {
      setData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isNaN(id)) {
      loadProfile();
    }
  }, [id]);

  const handleRemoveDelivery = async (delId: number, month: string) => {
    if (window.confirm(`Confirme a remoção da entrega da competência ${month} do histórico?`)) {
      await removeDeliveryRecord(delId);
      loadProfile();
    }
  };

  return {
    t,
    router,
    id,
    data,
    loading,
    modalOpen,
    setModalOpen,
    loadProfile,
    handleRemoveDelivery,
  };
}
