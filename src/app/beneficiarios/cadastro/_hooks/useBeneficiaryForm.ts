"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { beneficiarySchema, type BeneficiaryInput } from "@/domain/beneficiary";
import { createBeneficiary } from "../_actions/create-beneficiary";
import { updateBeneficiary } from "../_actions/update-beneficiary";
import { getBeneficiaryById } from "../../_actions/get-beneficiary-by-id";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { maskCPF } from "@/domain/beneficiary/masks";

export function useBeneficiaryForm() {
  const t = useTranslations("Beneficiary");
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [isPending, startTransition] = useTransition();
  const [initialLoading, setInitialLoading] = useState(Boolean(editId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BeneficiaryInput>({
    resolver: zodResolver(beneficiarySchema) as any,
    mode: "onChange",
    defaultValues: {
      fullName: "",
      document: "",
      phone: "",
      birthDate: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "Almenara",
      state: "MG",
      zipCode: "",
      complement: "",
      referencePoint: "",
      status: "ACTIVE",
      notes: "",
    },
  });

  useEffect(() => {
    if (editId) {
      setInitialLoading(true);
      getBeneficiaryById(Number(editId)).then((result) => {
        const res = result as any;
        if (res.success && res.beneficiary) {
          reset({
            fullName: res.beneficiary.fullName,
            document: res.beneficiary.document ? maskCPF(res.beneficiary.document) : "",
            phone: res.beneficiary.phone || "",
            birthDate: res.beneficiary.birthDate ? res.beneficiary.birthDate.split('-').reverse().join('/') : "",
            street: res.beneficiary.street,
            number: res.beneficiary.number,
            neighborhood: res.beneficiary.neighborhood,
            city: res.beneficiary.city,
            state: res.beneficiary.state,
            zipCode: res.beneficiary.zipCode,
            complement: res.beneficiary.complement || "",
            referencePoint: res.beneficiary.referencePoint || "",
            status: (res.beneficiary.status as any) || "ACTIVE",
            notes: res.beneficiary.notes || "",
          });
        }
        setInitialLoading(false);
      });
    }
  }, [editId, reset]);

  const onSubmit = (data: BeneficiaryInput) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      let result;
      if (editId) {
        result = await updateBeneficiary(Number(editId), data);
      } else {
        result = await createBeneficiary(data);
      }

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage(editId ? "Cadastro atualizado com sucesso!" : "Família cadastrada com sucesso!");
        setTimeout(() => {
          router.push("/beneficiarios");
        }, 1200);
      }
    });
  };

  return {
    t,
    router,
    editId,
    loading: isPending,
    initialLoading,
    errorMessage,
    successMessage,
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
  };
}
