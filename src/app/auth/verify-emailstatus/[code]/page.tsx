import VerifyEmailStatusForm from "@/features/auth/components//VerifyEmailStatus";


export default async function VerifyEmailstatusPage({ params }: { params: { code: string } })
 {
  const { code } = await params;
  return   <VerifyEmailStatusForm code={code} />
}
