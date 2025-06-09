"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ originalUrl: "", expiry: "" });
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  // New state for QR dialog
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrToShow, setQrToShow] = useState(null);

  const router = useRouter();

  const fetchUserAndLinks = async () => {
    try {
      const userRes = await axios.get("/api/users/me");
      setUser(userRes.data);

      const linksRes = await axios.get("/api/links/me");
      setLinks(linksRes.data);
    } catch {
      toast.error("Session expired");
      router.push("/auth");
    }
  };

  useEffect(() => {
    fetchUserAndLinks();
  }, []);

  const handleLogout = async () => {
    await axios.post("/api/users/logout");
    toast.success("Logged out");
    router.push("/auth");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/links/delete/${id}`);
      toast.success("Link deleted");
      fetchUserAndLinks();
    } catch {
      toast.error("Deletion failed");
    }
  };

  function copyShortUrl(shortUrl) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const fullUrl = `${baseUrl}/${shortUrl}`;

    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  }

  const handleSubmit = async () => {
    if (!form.originalUrl) return toast.error("URL required");
    try {
      if (editId) {
        const currentLink = links.find((l) => l._id === editId);

        await axios.put(`/api/links/edit/${editId}`, {
          originalUrl: form.originalUrl,
          shortUrl: currentLink?.shortUrl || "",
          expiresAt: form.expiry
            ? new Date(Date.now() + Number(form.expiry) * 24 * 60 * 60 * 1000)
            : undefined,
        });

        toast.success("Link updated");
      } else {
        await axios.post("/api/links/post", form);
        toast.success("Link created");
      }
      setForm({ originalUrl: "", expiry: "" });
      setEditId(null);
      setOpen(false);
      fetchUserAndLinks();
    } catch {
      toast.error("Operation failed");
    }
  };

  const redirect = async (id) => {
    try {
      await axios.put(`/api/links/click/${id}`);

      const link = links.find((link) => link._id === id);
      window.open(link.originalUrl, "_blank");
      fetchUserAndLinks();
    } catch (error) {
      toast.error("Failed to redirect");
    }
  };

  const openEditDialog = (link) => {
    setForm({
      originalUrl: link.originalUrl,
      expiry: link.expiresAt
        ? Math.max(
            0,
            Math.floor(
              (new Date(link.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
            )
          )
        : "",
    });
    setEditId(link._id);
    setOpen(true);
  };

  // New function to open QR dialog
  const openQrDialog = (qrUrl) => {
    setQrToShow(qrUrl);
    setQrDialogOpen(true);
  };

  // New function to download QR code
  const downloadQRCode = () => {
    if (!qrToShow) return;
    const a = document.createElement("a");
    a.href = qrToShow;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <motion.div
      className="min-h-screen p-8 bg-gradient-to-br from-black via-gray-900 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {user?.name || "..."}</h1>
          <p className="text-sm text-gray-400">Email: {user?.email}</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Card Grid */}
      <h2 className="text-2xl font-semibold mb-4">🔗 Your Shortened Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {links.length === 0 ? (
          <p className="text-gray-400">No links created yet.</p>
        ) : (
          links.map((link) => (
            <motion.div
              key={link._id}
              whileHover={{ scale: 1.05, rotate: 0.5 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="cursor-pointer"
              onClick={() => redirect(link._id)}
            >
              <Card className="bg-slate-800 border border-gray-700 hover:shadow-xl transition">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-amber-300 break-all">
                    {link.shortUrl}
                  </h3>
                  <p className="text-sm text-gray-400 break-all line-clamp-2">
                    {link.originalUrl}
                  </p>
                  <div className="flex justify-between text-xs mt-2 text-gray-500">
                    <span>👁 {link.clicks} clicks</span>
                    <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-6"
            onClick={() => {
              setEditId(null);
              setForm({ originalUrl: "", expiry: "" });
            }}
          >
            ➕ Create New Link
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 text-white border border-gray-700">
          <DialogTitle>{editId ? "Edit Link" : "Create New Link"}</DialogTitle>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Original URL</Label>
              <Input
                className="mt-1"
                value={form.originalUrl}
                onChange={(e) =>
                  setForm({ ...form, originalUrl: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Expiry (Optional, in days)</Label>
              <Input
                type="number"
                className="mt-1"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              />
            </div>
            <Button onClick={handleSubmit} className="mt-2">
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table Section */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">📋 All Links (Manage)</h2>
      <div className="overflow-x-auto">
        <Table className="w-full text-white border border-slate-700 bg-slate-900">
          <TableHeader>
            <TableRow>
              <TableHead className={"text-white"}>Short</TableHead>
              <TableHead className={"text-white"}>Original</TableHead>
              <TableHead className={"text-white"}>Clicks</TableHead>
              <TableHead className={"text-white"}>Created</TableHead>
              <TableHead className={"text-white"}>Actions</TableHead>
              <TableHead className={"text-white"}>QR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link._id}>
                <TableCell className="text-amber-300">{link.shortUrl}</TableCell>
                <TableCell className="truncate max-w-[250px]">
                  {link.originalUrl}
                </TableCell>
                <TableCell>{link.clicks}</TableCell>
                <TableCell>
                  {new Date(link.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="secondary" onClick={() => openEditDialog(link)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(link._id)}>
                    Delete
                  </Button>
                  <Button onClick={() => copyShortUrl(link.shortUrl)}>Copy URL</Button>
                </TableCell>
                <TableCell>
                  {link.qrCode && (
                    <img
                      src={link.qrCode}
                      alt="QR Code"
                      className="w-12 h-12 object-cover cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering redirect
                        openQrDialog(link.qrCode);
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border border-gray-700 max-w-md mx-auto">
          <DialogTitle className="mb-4">QR Code</DialogTitle>
          {qrToShow && (
            <img
              src={qrToShow}
              alt="QR Code Large"
              className="w-64 h-64 mx-auto mb-4"
            />
          )}
          <div className="flex justify-end space-x-4">
            <Button className="btn-primary" onClick={downloadQRCode}>
              Download PNG
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
