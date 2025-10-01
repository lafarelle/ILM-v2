"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitArtisan } from "@/features/shop/actions/submit-artisan.action";

export function ArtisanForm() {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Ajouter un artisan</CardTitle>
        <CardDescription>
          Créez un artisan avec un avatar optionnel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={submitArtisan}
          className="grid gap-4"
          encType="multipart/form-data"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="ex: atelier-ceramique"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={3} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatarFile">Avatar</Label>
            <Input
              id="avatarFile"
              name="avatarFile"
              type="file"
              accept="image/*"
            />
          </div>
          <div>
            <Button type="submit">Créer l&apos;artisan</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
