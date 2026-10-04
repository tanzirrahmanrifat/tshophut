import { isAdminAuthed } from "@/lib/adminAuth";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  if (!isAdminAuthed()) {
    return (
      <main className="max-w-[1220px] mx-auto px-5 sm:px-7">
        <AdminLoginForm />
      </main>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
