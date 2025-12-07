import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";

import { compressImage } from "@/utils/imageUtils";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Post = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    location: "",
    date: "",
    contactName: user?.name || "",
    contactPhone: "",
    contactEmail: user?.email || "",
    category: "", // ✅ IMPORTANT
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setIsCompressing(true);

    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed.base64);
      toast.success("Image ready");
    } catch {
      toast.error("Failed to process image");
    } finally {
      setIsCompressing(false);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to post an item");
      navigate("/auth");
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.date ||
      !formData.contactPhone ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await api.post("/items/create", {
        ...formData,
        image: imagePreview || null,
      });

      toast.success("Item posted successfully ✅");
      setTimeout(() => navigate("/"), 1200);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to post item"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Provide as much information as possible
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ✅ LOST / FOUND */}
                <div>
                  <Label>Item Type *</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(v) =>
                      setFormData({ ...formData, type: v })
                    }
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="lost" />
                      <Label>Lost</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="found" />
                      <Label>Found</Label>
                    </div>
                  </RadioGroup>
                </div>


                {/* TITLE */}
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <Label>Location *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                {/* CATEGORY */}
<div>
  <Label>Category *</Label>
  <Select
    value={formData.category}
    onValueChange={(value) =>
      setFormData({ ...formData, category: value })
    }
  >
    <SelectTrigger className="mt-2">
      <SelectValue placeholder="Select category" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="wallet">Wallet</SelectItem>
      <SelectItem value="id-card">ID Card</SelectItem>
      <SelectItem value="bottle">Bottle</SelectItem>
      <SelectItem value="stationery">Stationery</SelectItem>
      <SelectItem value="electronics">Electronics</SelectItem>
      <SelectItem value="other">Other</SelectItem>
    </SelectContent>
  </Select>
</div>


                {/* DATE */}
                <div>
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                {/* CONTACT */}
                <div>
                  <Label>Contact Phone *</Label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <Label>Image (optional)</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        className="rounded-lg w-full h-40 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview("")}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <label className="border-dashed border-2 p-6 rounded-lg text-center cursor-pointer block">
                      <Upload className="mx-auto mb-2" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                        disabled={isCompressing}
                      />
                    </label>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Post Item
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Post;
