"use client";

import React, { useState } from "react";
import { useCreateJewelTypeMutation } from "@/redux/services/productApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader2, IconCategory } from "@tabler/icons-react";

interface CreateCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCategoryModal = ({ open, onClose }: CreateCategoryModalProps) => {
  const [createJewelType, { isLoading }] = useCreateJewelTypeMutation();
  const [nameType, setNameType] = useState("");
  const [errors, setErrors] = useState<{ nameType?: string }>({});

  const validate = () => {
    const newErrors: { nameType?: string } = {};
    if (!nameType.trim()) {
      newErrors.nameType = "Category name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createJewelType({ name_type: nameType.trim() }).unwrap();
      toast.success(`Category "${nameType}" created successfully!`);
      handleClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create category.");
    }
  };

  const handleClose = () => {
    setNameType("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b8860b]/10">
              <IconCategory className="h-5 w-5 text-[#b8860b]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Add New Category</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Create a new jewelry category (type) for your products.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="category-name">
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Ring, Necklace, Bracelet..."
              value={nameType}
              onChange={(e) => {
                setNameType(e.target.value);
                if (errors.nameType) setErrors({});
              }}
              className={errors.nameType ? "border-destructive focus-visible:ring-destructive" : ""}
              disabled={isLoading}
            />
            {errors.nameType && (
              <p className="text-xs text-destructive">{errors.nameType}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#b8860b] hover:bg-[#9a7b0a] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
