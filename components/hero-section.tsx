import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#eeeeef]">
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px bg-black/10 lg:block" />

      <div className="mx-auto grid min-h-[720px] w-full max-w-[1920px] grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 md:px-10 lg:px-14">
          <div className="max-w-2xl space-y-6 md:space-y-8">
            <h1 className="text-4xl font-medium tracking-tight text-balance text-black md:text-6xl">
              From microns to Mars
            </h1>

            <p className="max-w-xl text-base font-semibold text-black/60 md:text-3xl/normal">
              Hexagon&apos;s measurement and autonomous solutions transform the
              world&apos;s most vital industries.
            </p>

            <Link
              href="#"
              className="inline-flex h-14 min-w-72 items-center justify-center rounded-full bg-[#0059a7] px-8 text-lg font-semibold text-white transition-colors hover:bg-[#004a8b]"
            >
              <span>Explore what&apos;s possible</span>
              <span aria-hidden className="ml-4 text-2xl leading-none">
                {"->"}
              </span>
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] lg:min-h-full">
          <Image
            src="/hero.webp"
            alt="Survey engineer using a total station"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />

          {/*
style={{ clipPath: "polygon(0 0, 64% 0, 0 48%)" }}
          */}
          <div
            aria-hidden
            className="absolute inset-0 bg-white"
            style={{ clipPath: "polygon(0 0, 64% 0, 0 48%)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-white"
            style={{ clipPath: "polygon(0 100%, 24% 100%, 0 50%)" }}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute top-0 left-1/2 z-20 hidden h-full w-28 -translate-x-1/2 lg:block">
        <div className="absolute top-[49%] left-1/2 h-[56%] w-5 origin-bottom -translate-x-1/2 -translate-y-full rotate-20 rounded-full bg-[#72c100]" />
        <div className="absolute top-[47%] left-1/2 h-[60%] w-5 origin-top -translate-x-1/2 rounded-full bg-[#0aa1e6]" />
        <div className="absolute top-[47.3%] left-1/2 h-[72%] w-5 origin-top -translate-x-1/2 -rotate-32 rounded-full bg-[#0aa1e6]" />
      </div>
    </section>
  )
}
