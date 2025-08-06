import { z } from "zod";

export const createForumSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du forum est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
  isDefault: z.boolean().default(false),
});

export const updateForumSchema = z.object({
  id: z.string().uuid("ID de forum invalide"),
  name: z
    .string()
    .min(1, "Le nom du forum est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .optional(),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
  isDefault: z.boolean().optional(),
});

export const deleteForumSchema = z.object({
  id: z.string().uuid("ID de forum invalide"),
});

export const getForumSchema = z.object({
  id: z.string().uuid("ID de forum invalide"),
});

export type CreateForumInput = z.infer<typeof createForumSchema>;
export type UpdateForumInput = z.infer<typeof updateForumSchema>;
export type DeleteForumInput = z.infer<typeof deleteForumSchema>;
export type GetForumInput = z.infer<typeof getForumSchema>;
