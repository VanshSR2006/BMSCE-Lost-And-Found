import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [tab, setTab] = useState<"users" | "items">("users");
  const token = localStorage.getItem("token");

  // FETCH USERS
  const loadUsers = async () => {
    const res = await api.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  // FETCH ITEMS
  const loadItems = async () => {
    const res = await api.get("/admin/items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(res.data);
  };

  useEffect(() => {
    tab === "users" ? loadUsers() : loadItems();
  }, [tab]);

  // ROLE UPDATE
  const updateRole = async (id: string, role: string) => {
    await api.put(
      `/admin/users/${id}/role`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadUsers();
  };

  // DELETE USER
  const deleteUser = async (id: string) => {
    await api.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  };

  // DELETE ITEM
  const deleteItem = async (id: string) => {
    await api.delete(`/admin/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadItems();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-black overflow-hidden">
      <Navbar />

      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-transparent blur-3xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <main className="relative z-10 container mx-auto px-6 py-12 flex-1">
        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-white tracking-wide"
        >
          Admin Dashboard
        </motion.h1>

        {/* TABS */}
        <div className="flex gap-6 mb-10">
          {["users", "items"].map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.1 }}
              onClick={() => setTab(t as any)}
              className={`text-lg transition-all ${
                tab === t
                  ? "text-blue-400 underline"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "users" ? "Manage Users" : "Manage Items"}
            </motion.button>
          ))}
        </div>

        {/* CONTENT */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6"
        >
          {tab === "users" &&
            users.map((u) => (
              <motion.div
                key={u._id}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-semibold">{u.name}</p>
                  <p className="text-gray-400 text-sm">{u.email}</p>
                  <p className="text-xs text-indigo-400">Role: {u.role}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateRole(u._id, u.role === "admin" ? "user" : "admin")
                    }
                  >
                    Toggle Role
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}

          {tab === "items" &&
            items.map((i) => (
              <motion.div
                key={i._id}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-semibold">{i.title}</p>
                  <p className="text-gray-400 text-sm">
                    {i.type.toUpperCase()} • {i.location}
                  </p>
                  <p className="text-xs text-indigo-400">
                    By: {i.createdBy?.email}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => deleteItem(i._id)}
                >
                  Remove
                </Button>
              </motion.div>
            ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
