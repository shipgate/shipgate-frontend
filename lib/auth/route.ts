// ─────────────────────────────────────────────────────────────
// app/api/auth/me/route.ts
// Returns the current user's role from the JWT cookie.
// Replace the decoding logic with your actual auth provider.
// ─────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromToken } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const session = await getSessionFromToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    userId: session.userId,
    role: session.role,
    email: session.email,
  });
}


// ─────────────────────────────────────────────────────────────
// EXAMPLE LAYOUTS — wrap each dashboard section in ProtectedRoute
// ─────────────────────────────────────────────────────────────

// app/dashboard/layout.tsx
/*
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      {children}
    </ProtectedRoute>
  );
}
*/

// app/admin/dashboard/layout.tsx
/*
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
      {children}
    </ProtectedRoute>
  );
}
*/

// app/super-admin/dashboard/layout.tsx
/*
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["super-admin"]}>
      {children}
    </ProtectedRoute>
  );
}
*/

// app/staff/dashboard/layout.tsx
/*
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["operational-staff"]}>
      {children}
    </ProtectedRoute>
  );
}
*/

// app/courier/dashboard/layout.tsx
/*
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function CourierLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["courier"]}>
      {children}
    </ProtectedRoute>
  );
}
*/

export {};
