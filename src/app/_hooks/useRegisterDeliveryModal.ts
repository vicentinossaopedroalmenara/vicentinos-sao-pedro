"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "@/auth/client";
import { registerDelivery } from "../_actions/register-delivery";

interface UseRegisterDeliveryModalProps {
  beneficiaryId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useRegisterDeliveryModal({
  beneficiaryId,
  onClose,
  onSuccess,
}: UseRegisterDeliveryModalProps) {
  const t = useTranslations("Delivery");
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const todayStr = new Date().toISOString().split("T")[0];
  const currentMonthStr = todayStr.substring(0, 7);

  const [deliveredAt, setDeliveredAt] = useState(todayStr);
  const [referenceMonth, setReferenceMonth] = useState(currentMonthStr);
  const [basketsQuantity, setBasketsQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [deliveredBy, setDeliveredBy] = useState(session?.user?.name || session?.user?.email || "Conferência São Pedro");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDateChange = (val: string) => {
    setDeliveredAt(val);
    if (val && val.length >= 7) {
      setReferenceMonth(val.substring(0, 7));
    }
  };

  const handleSubmit = (e?: React.FormEvent, overrideWarning: boolean = false) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setWarningMessage(null);

    startTransition(async () => {
      const result = await registerDelivery({
        beneficiaryId,
        deliveredAt,
        referenceMonth,
        basketsQuantity,
        description,
        deliveredBy: deliveredBy || "Voluntário Vicentino",
      }, overrideWarning);

      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.warning) {
        setWarningMessage(result.warning);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      }
    });
  };

  return {
    t,
    deliveredAt,
    handleDateChange,
    referenceMonth,
    setReferenceMonth,
    basketsQuantity,
    setBasketsQuantity,
    description,
    setDescription,
    deliveredBy,
    setDeliveredBy,
    loading: isPending,
    errorMessage,
    warningMessage,
    success,
    handleSubmit,
  };
}
