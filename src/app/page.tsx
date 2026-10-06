"use client";

export default function LandingPage() {
  return (
    <main className="absolute inset-0 h-full w-full object-cover">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/landing-page-video-1.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: "rgba(19, 13, 9, 0.55)" }}
      />
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl p-10 text-center ">
          <h1 className="mb-3 text-3xl font-bold text-white">
            Book Your Appointment
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-white/80">
            Would you like to book a Wellness Appointment or a Dental
            Appointment?
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="group relative overflow-hidden rounded-full bg-[#423C36] px-10 py-4 text-lg font-medium text-white backdrop-blur-md">
              {/* The circle */}
              <span
                className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/40
                   transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                   group-hover:scale-[14]"
              />

              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                Dentally
              </span>
            </button>
            <button className="group relative overflow-hidden rounded-full bg-[#423C36] px-10 py-4 text-lg font-medium text-white backdrop-blur-md">
              {/* The circle */}
              <span
                className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/40
                   transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                   group-hover:scale-[14]"
              />

              <span className="relative z-10 transition-colors duration-500">
                Wellness
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
