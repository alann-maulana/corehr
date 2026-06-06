import type { Metadata } from "next";
import LoginCard from "@/components/auth/LoginCard";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke CoreHR menggunakan akun Google Anda.",
};

export default function LoginPage() {
  return <LoginCard />;
}
