import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import useAdminData from "../hooks/useAdminData";

export default function AdminManagement({
  admins: propAdmins,
  onAddAdmin,
  onDeleteAdmin,
}) {
  // Consume Hook Data & Actions
  const {
    admins: hookAdmins = [],
    createAdmin,
    deleteAdmin,
    refreshAdmins,
    currentUser,
  } = useAdminData();

  // Load latest admin accounts from backend when this view mounts
  useEffect(() => {
    if (refreshAdmins) {
      refreshAdmins();
    }
  }, []);

  // Prefer hook state over passed props
  const adminList = hookAdmins.length > 0 ? hookAdmins : propAdmins || [];

  // Local Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN"); // Default aligned with Prisma Enum
  const [password, setPassword] = useState("");

  // Feedback & Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Submit Handler for Registering Admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setFormError("All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (createAdmin) {
        await createAdmin({ name, email, role, password });
      } else if (onAddAdmin) {
        await onAddAdmin({ name, email, role, password });
      }

      setFormSuccess(`Account for ${name} created successfully.`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("ADMIN");
    } catch (err) {
      setFormError(err.message || "Failed to register new admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for Removing Admin Account
  const handleRemove = async (admin) => {
    setFormError("");
    setFormSuccess("");

    const targetId = admin.id || admin.email;
    const isSelf = currentUser?.email === admin.email;

    if (isSelf) {
      toast.error("You cannot delete your own active session account.");
      return;
    }

    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col gap-3 min-w-[260px]">
            <p className="text-sm font-medium text-slate-800">
              Remove {admin.name || admin.email}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ),
        { duration: Infinity, id: `remove-admin-${targetId}` }
      );
    });

    if (!confirmed) {
      return;
    }

    try {
      if (deleteAdmin && admin.id) {
        await deleteAdmin(admin.id);
      } else if (onDeleteAdmin) {
        await onDeleteAdmin(targetId);
      }
      setFormSuccess("Admin account removed successfully.");
      toast.success("Admin account removed successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to remove admin account.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Team Management</h2>
        <p className="text-slate-500 text-sm">
          Add new church admins or remove access from existing team members.
        </p>
      </div>

      {/* Form: Add New Admin */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Administrator</h3>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lfciseyin.org"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900 bg-white"
            >
              <option value="ADMIN">Super Admin</option>
              <option value="SECRETARY">Secretary</option>
              <option value="MEDIA">Media Team</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Temporary Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="py-2.5 px-6">
              {isSubmitting ? "Registering..." : "+ Register New Admin"}
            </Button>
          </div>
        </form>
      </div>

      {/* Table: Existing Admin Accounts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Current Admins</h3>
          <span className="text-xs text-slate-500 font-medium">{adminList.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-400">
                    No active admin accounts found.
                  </td>
                </tr>
              ) : (
                adminList.map((admin) => {
                  const isCurrent = currentUser?.email === admin.email;

                  return (
                    <tr key={admin.id || admin.email} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          {admin.name}
                          {isCurrent && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{admin.email}</td>
                      <td className="p-4">
                        <span className="uppercase px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                          {admin.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemove(admin)}
                          disabled={isCurrent}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}