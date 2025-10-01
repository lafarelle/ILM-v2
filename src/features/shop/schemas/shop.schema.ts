import { z } from "zod";

export const createArtisanSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(100),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug invalide"),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export const createProductSchema = z
  .object({
    name: z.string().min(2).max(120),
    slug: z
      .string()
      .min(2)
      .max(140)
      .regex(/^[a-z0-9-]+$/),
    description: z.string().min(1).max(1000),
    priceCents: z.number().int().min(0),
    imageUrl: z.string().url().optional(),
    category: z.enum(["merch", "artisan", "dropshipping"]),
    artisanId: z.string().uuid().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.category === "artisan") return Boolean(data.artisanId);
      return true;
    },
    {
      message: "artisanId requis pour la catégorie 'artisan'",
      path: ["artisanId"],
    }
  );

export type CreateArtisanInput = z.infer<typeof createArtisanSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
