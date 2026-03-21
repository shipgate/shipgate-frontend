"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Mail } from "lucide-react";
import {
  useActiveSuperAdminUsersQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
} from "@/store/slice/apiSlice";

export default function ManageAdmins() {
  const [createAdmin, { isLoading: isCreating, data: newAdminData }] =
    useCreateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const { data, isLoading, refetch } = useActiveSuperAdminUsersQuery({});

  const [showForm, setShowForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
  });

  useEffect(() => {
    if (newAdminData) {
      setShowForm(false);
      refetch();
    }
  }, [newAdminData]);

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email) {
      createAdmin({
        email: newAdmin.email,
        fullName: newAdmin.name,
        role: newAdmin.role,
      });
    }
  };

  const handleDeleteAdmin = (id: string) => {
    deleteAdmin({ id: id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Admins & Staff
          </h1>
          <p className="text-foreground/60">
            Add and manage admin and operations staff accounts
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Admin
        </Button>
      </div>

      {/* Add Admin Form */}
      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Create New Admin/Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, role: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Admin</option>
                  <option>Operations Staff</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  disabled={isCreating}
                  onClick={handleAddAdmin}
                >
                  {isCreating ? "..creating admin" : " Create Admin"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && <div>....loading admin</div>}
      {isDeleting && <div>....deleting admin</div>}
      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admins & Staff ({data?.length})</CardTitle>
          <CardDescription>
            All administrators and operations staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((admin: any) => (
                  <tr
                    key={admin.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 font-semibold capitalize">
                      {admin.fullName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Mail className="w-4 h-4" />
                        {admin.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">{admin.role}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default">
                        {admin.isActive ? "Active" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
