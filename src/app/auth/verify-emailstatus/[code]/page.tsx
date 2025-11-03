import VerifyEmailStatusForm from "@/features/auth/components/VerifyEmailStatus";

export default async function VerifyEmailstatusPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params; 
  return <VerifyEmailStatusForm code={code} />;
}
