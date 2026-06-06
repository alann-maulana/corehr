import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AppShell from "@/components/ui/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Safety fallback if session is not available
  if (!session?.user) {
    redirect("/login");
  }

  // Double check verification status
  if (session.user.status === "unverified") {
    redirect("/waiting-verification");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
