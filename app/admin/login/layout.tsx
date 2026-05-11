// Login page should NOT use the admin layout (which requires auth)
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
