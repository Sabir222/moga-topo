import { RequestForm } from "@/components/request/request-form"

export default function RequestPage() {
  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[radial-gradient(circle_at_20%_20%,#d4f7f0_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#f8eed5_0%,transparent_30%),linear-gradient(180deg,#f9fbff_0%,#eef3f9_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(15,118,110,0.06)_35%,transparent_70%)]" />

      <section className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-6 max-w-2xl space-y-2">
          <p className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
            New Request
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Land Request Workflow
          </h1>
          <p className="text-sm text-slate-600">
            Select area on map (or skip), add land information, attach files,
            then submit your personal details.
          </p>
        </div>

        <RequestForm />
      </section>
    </main>
  )
}
