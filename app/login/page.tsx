import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const array: string[] = [
    "Request TOR, COR and certifications online",
    "Track payment and request status in real time",
    "Role-based access for students, registrar and cashier",
  ];

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-center bg-[#0F4526] text-white px-10 lg:px-12 xl:px-16 2xl:px-20 py-10">

        <div className="flex items-center gap-3 mb-5 xl:mb-7">
          <span className="flex h-10 w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 shrink-0 items-center justify-center rounded-full bg-green-700 text-lg xl:text-xl 2xl:text-2xl font-bold">
            UC
          </span>

          <div className="min-w-0">
            <h4 className="text-xs xl:text-sm 2xl:text-base font-bold">
              CayoTech University
            </h4>
            <p className="text-[10px] xl:text-xs 2xl:text-sm text-gray-300">
              Student Services Information System
            </p>
          </div>
        </div>

        {/* Heading and Description */}
        <section className="mb-5 xl:mb-7">
          <h1 className="mb-3 text-3xl sm:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight tracking-tight">
            Student services,
            <br />
            without the long lines.
          </h1>

          <p className="max-w-lg text-xs lg:text-xs xl:text-sm 2xl:text-base leading-relaxed text-gray-300">
            Enrollment, clearance, grades and document requests in one secure
            portal.
          </p>
        </section>

        <section>
          <ul className="mb-5 space-y-2 xl:space-y-3">
            {array.map((item: string, index: number) => (
              <li
                key={index}
                className="flex items-start gap-2 xl:gap-3 text-xs xl:text-sm 2xl:text-base leading-relaxed"
              >
                <span className="mt-1.5 h-1.5 w-1.5 xl:h-2 xl:w-2 shrink-0 rounded-full bg-orange-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-[9px] xl:text-[10px] 2xl:text-xs text-gray-400">
            University of Cabuyao · College of Computing Studies
          </p>
        </section>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col gap-4 p-6 sm:p-8 lg:p-6 xl:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}