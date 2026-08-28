import { LoginForm } from "@/components/cms/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <LoginForm next={next ?? "/admin"} />
    </div>
  );
}
