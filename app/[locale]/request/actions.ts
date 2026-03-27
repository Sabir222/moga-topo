"use server"

import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { profiles, requestFiles, requests } from "@/drizzle/schema"
import { createClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 10 * 1024 * 1024

type SubmitResult = {
  ok: boolean
  message: string
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function uploadAttachmentsAndSubmit(
  formData: FormData
): Promise<SubmitResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      message: "Please login before submitting a request.",
    }
  }

  const landAddress = String(formData.get("landAddress") ?? "").trim()
  const landCity = String(formData.get("landCity") ?? "").trim()
  const landAreaSize = String(formData.get("landAreaSize") ?? "").trim()
  const landOtherInfo = String(formData.get("landOtherInfo") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const commune = String(formData.get("commune") ?? "").trim()
  const area = formData.get("area") ? Number(formData.get("area")) : null
  const geoJsonRaw = formData.get("geojson")

  if (!landAddress || !landCity || !landAreaSize) {
    return {
      ok: false,
      message:
        "Address, city, and area size are required for land information.",
    }
  }

  if (!name || !phone || !email || !commune) {
    return {
      ok: false,
      message: "Please complete all personal information fields.",
    }
  }

  const [profile] = await db
    .select({
      id: profiles.id,
      monthlyQuota: profiles.monthlyQuota,
      usedQuota: profiles.usedQuota,
    })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1)

  if (!profile) {
    return {
      ok: false,
      message: "Your profile is not ready yet. Please try again later.",
    }
  }

  const usedQuota = profile.usedQuota ?? 0
  const monthlyQuota = profile.monthlyQuota ?? 0

  if (usedQuota >= monthlyQuota) {
    return {
      ok: false,
      message: "You reached your monthly request quota.",
    }
  }

  const parsedGeoJson =
    typeof geoJsonRaw === "string" && geoJsonRaw ? JSON.parse(geoJsonRaw) : null

  const notes = [
    `Land address: ${landAddress}`,
    `Land city: ${landCity}`,
    `Land size: ${landAreaSize}`,
    `Land other info: ${landOtherInfo || "N/A"}`,
    `Client name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Commune: ${commune}`,
  ].join("\n")

  const [createdRequest] = await db
    .insert(requests)
    .values({
      userId: user.id,
      notes,
      geojson: parsedGeoJson,
      area,
    })
    .returning({ id: requests.id })

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return {
        ok: false,
        message: `File ${file.name} is too large. Max allowed is 10MB.`,
      }
    }

    const objectPath = `requests/${user.id}/${createdRequest.id}/${Date.now()}-${sanitizeFileName(file.name)}`

    const { error: uploadError } = await supabase.storage
      .from("request-files")
      .upload(objectPath, file, {
        upsert: false,
      })

    if (uploadError) {
      return {
        ok: false,
        message: `Upload failed for ${file.name}.`,
      }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("request-files").getPublicUrl(objectPath)

    await db.insert(requestFiles).values({
      requestId: createdRequest.id,
      fileUrl: publicUrl,
      fileType: file.type || "application/octet-stream",
    })
  }

  await db
    .update(profiles)
    .set({ usedQuota: usedQuota + 1 })
    .where(and(eq(profiles.id, user.id)))

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/requests")

  return {
    ok: true,
    message: "Request submitted successfully.",
  }
}
