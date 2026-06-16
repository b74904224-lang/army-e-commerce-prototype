import type { Metadata } from "next"
import { AccountShell } from "@/components/account-shell"

export const metadata: Metadata = {
  title: "Мій акаунт | ARMY",
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>
}
