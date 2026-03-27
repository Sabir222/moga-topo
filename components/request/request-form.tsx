"use client"

import { useMemo, useState, useTransition } from "react"
import { uploadAttachmentsAndSubmit } from "@/app/[locale]/request/actions"
import { DrawMap } from "@/components/request/draw-map"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { Progress } from "@/components/ui/progress"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Step = 1 | 2 | 3 | 4

type FormState = {
  geojson: GeoJSON.Feature<GeoJSON.Polygon> | null
  area: number | null
  landAddress: string
  landCity: string
  landAreaSize: string
  landOtherInfo: string
  files: File[]
  name: string
  phone: string
  email: string
  commune: string
}

const COMMUNES = [
  "Essaouira",
  "Ait Daoud",
  "Ait Saadane",
  "Ait Tamlil",
  "Ait Amira",
  "Bizdad",
  "Bouabout",
  "Had Draa",
  "Hrara",
  "Ida Ougourd",
  "Ida Ouazzine",
  "Imintlit",
  "Meskala",
  "Moulay Bouzerktoun",
  "Ounagha",
  "Sidi Ahmed Essayeh",
  "Sidi Bouzid",
  "Sidi El Jazouli",
  "Sidi Hmad Ou Hamed",
  "Smimou",
  "Tafedna",
  "Tafraout",
  "Takate",
  "Tidzi",
  "Tamanar",
] as const

const initialState: FormState = {
  geojson: null,
  area: null,
  landAddress: "",
  landCity: "Essaouira",
  landAreaSize: "",
  landOtherInfo: "",
  files: [],
  name: "",
  phone: "+212",
  email: "",
  commune: "Essaouira",
}

export function RequestForm() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>(initialState)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const progressValue = useMemo(() => (step / 4) * 100, [step])

  const canGoNext = useMemo(() => {
    if (step === 2) {
      return (
        form.landAddress.trim().length > 2 &&
        form.landCity.trim().length > 1 &&
        form.landAreaSize.trim().length > 0
      )
    }

    if (step === 4) {
      return (
        form.name.trim().length > 1 &&
        form.phone.trim().length > 5 &&
        form.email.trim().length > 3 &&
        form.commune.trim().length > 1
      )
    }

    return true
  }, [
    form.commune,
    form.email,
    form.landAddress,
    form.landAreaSize,
    form.landCity,
    form.name,
    form.phone,
    step,
  ])

  const moveNext = () => {
    if (!canGoNext) {
      return
    }

    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev))
  }

  const moveBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))
  }

  const handleSubmit = () => {
    setErrorMessage(null)
    setSuccessMessage(null)

    startTransition(async () => {
      try {
        const payload = new FormData()
        payload.append("landAddress", form.landAddress)
        payload.append("landCity", form.landCity)
        payload.append("landAreaSize", form.landAreaSize)
        payload.append("landOtherInfo", form.landOtherInfo)
        payload.append("name", form.name)
        payload.append("phone", form.phone)
        payload.append("email", form.email)
        payload.append("commune", form.commune)

        if (form.geojson) {
          payload.append("geojson", JSON.stringify(form.geojson))
        }

        if (typeof form.area === "number") {
          payload.append("area", String(form.area))
        }

        for (const file of form.files) {
          payload.append("files", file)
        }

        const result = await uploadAttachmentsAndSubmit(payload)

        if (!result.ok) {
          setErrorMessage(result.message)
          return
        }

        setSuccessMessage(result.message)
        setForm(initialState)
        setStep(1)
      } catch {
        setErrorMessage("Something went wrong while sending your request.")
      }
    })
  }

  return (
    <Card className="border-border/60 bg-card/95 backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            Start Your Topography Request
          </CardTitle>
          <CardDescription>
            Follow the steps to submit land details, optional files, and your
            contact information.
          </CardDescription>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {step} of 4</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        {step === 1 && (
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">1. Select area on map</h3>
              <p className="text-xs text-muted-foreground">
                Draw your land boundary on the map, or skip this step.
              </p>
            </div>

            <DrawMap
              initialGeoJson={form.geojson}
              onChange={(payload) => {
                setForm((prev) => ({
                  ...prev,
                  geojson: payload.geojson,
                  area: payload.area,
                }))
              }}
            />

            {typeof form.area === "number" && (
              <p className="text-xs font-medium text-emerald-700">
                Estimated area: {(form.area / 10000).toFixed(2)} ha (
                {form.area.toFixed(0)} m²)
              </p>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">
                2. Information about the land
              </h3>
              <p className="text-xs text-muted-foreground">
                Fill the key land details, then add any extra notes.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="landAddress">Address</Label>
                <Input
                  id="landAddress"
                  value={form.landAddress}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, landAddress: value }))
                  }}
                  placeholder="Douar / street / nearest landmark"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landCity">City</Label>
                <Input
                  id="landCity"
                  value={form.landCity}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, landCity: value }))
                  }}
                  placeholder="Essaouira"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landAreaSize">Area size</Label>
                <Input
                  id="landAreaSize"
                  value={form.landAreaSize}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, landAreaSize: value }))
                  }}
                  placeholder="e.g. 2.4 ha or 24000 m2"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="commune">Commune</Label>
                <Select
                  id="commune"
                  value={form.commune}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, commune: value }))
                  }}
                >
                  {COMMUNES.map((commune) => (
                    <option key={commune} value={commune}>
                      {commune}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="landOtherInfo">Other information</Label>
                <Textarea
                  id="landOtherInfo"
                  value={form.landOtherInfo}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, landOtherInfo: value }))
                  }}
                  placeholder="Anything else you want us to know"
                  className="min-h-32"
                />
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">
                3. Upload files (optional)
              </h3>
              <p className="text-xs text-muted-foreground">
                You can add PDFs, images, or any relevant document.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Attachments</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={(event) => {
                  const selected = Array.from(event.target.files ?? [])
                  setForm((prev) => ({
                    ...prev,
                    files: [...prev.files, ...selected],
                  }))
                  event.currentTarget.value = ""
                }}
              />
              {form.files.length > 0 && (
                <ul className="space-y-1 rounded-md border border-border bg-muted/30 p-2 text-xs text-muted-foreground">
                  {form.files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            files: prev.files.filter((_, i) => i !== index),
                          }))
                        }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">4. Personal information</h3>
              <p className="text-xs text-muted-foreground">
                Fill your contact details so we can follow up on your request.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, name: value }))
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <PhoneInput
                  id="phone"
                  value={form.phone}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, phone: value }))
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((prev) => ({ ...prev, email: value }))
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </CardContent>

      <CardFooter className="justify-between border-t border-border/60 pt-4">
        <Button
          variant="outline"
          onClick={moveBack}
          disabled={step === 1 || isPending}
        >
          Back
        </Button>

        <div className="flex items-center gap-2">
          {step === 1 && (
            <Button variant="ghost" onClick={moveNext} disabled={isPending}>
              Skip map
            </Button>
          )}

          {step < 4 ? (
            <Button onClick={moveNext} disabled={!canGoNext || isPending}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canGoNext || isPending}>
              {isPending ? "Submitting..." : "Submit request"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
