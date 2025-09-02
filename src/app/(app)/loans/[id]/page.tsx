import { LoanDetailClient } from "@/components/loans/loan-detail-client";
import { getLoanById } from "@/lib/data";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const loan = getLoanById(params.id);
  if (!loan) {
    return { title: "Loan Not Found" };
  }
  return {
    title: `Loan ${loan.id} | LoanFlow`,
    description: `Details for loan ${loan.id} for applicant ${loan.applicant.name}.`,
  };
}

export default function LoanDetailPage({ params }: { params: { id:string } }) {
  const loan = getLoanById(params.id);

  if (!loan) {
    notFound();
  }

  return <LoanDetailClient loan={loan} />;
}
