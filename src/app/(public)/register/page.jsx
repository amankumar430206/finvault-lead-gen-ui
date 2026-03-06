"use client";

import { ICONS } from "@/app/components/icons";
import { useCreateStudent } from "@/hooks/useStudent";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BackgroundGrid } from "../login/page";

const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export const InputField = ({ label, type = "text", placeholder, icon, rightEl, error, register, name, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-primary/75 mb-1.5 tracking-wide uppercase">{label}</label>
    <div
      className={`relative flex items-center rounded-lg border transition-all duration-200
      ${
        error
          ? "border-red-500/50 bg-red-500/5"
          : " border-[var(--border-clr)] bg-inputbg focus-within:border-accent/50 focus-within:bg-accent/[0.03]"
      }`}
    >
      {icon && (
        <div className="px-3 text-primary/70 shrink-0">
          <Icon path={icon} className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`flex-1 bg-transparent py-3 px-3 text-sm text-primary placeholder:text-[var(--text-muted)] outline-none ${!icon && "rounded-lg"}`}
        {...register}
        {...props}
      />
      {rightEl && <div className="p-3">{rightEl}</div>}
    </div>
    {error && <p className="text-red-400 text-xs mt-1.5">{error.message}</p>}
  </div>
);

const formatDOB = (value) => {
  const numbers = value.replace(/\D/g, "").slice(0, 8);

  const day = numbers.slice(0, 2);
  const month = numbers.slice(2, 4);
  const year = numbers.slice(4, 8);

  let formatted = day;

  if (month) formatted += "/" + month;
  if (year) formatted += "/" + year;

  return formatted;
};

export default function RegisterPage() {
  const { isPending, isSuccess, mutateAsync } = useCreateStudent();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all",
  });

  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passportNumber: data.passportNumber,
      fileNumber: data.passportFileNo,
      dob: data.dateOfBirth,
    };
    await mutateAsync(payload);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden py-12 md:py-32">
      <BackgroundGrid />

      <div className="relative w-full max-w-md z-10">
        <div
          className="absolute -inset-px rounded-3xl opacity-40"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.3), transparent 50%, rgba(6,182,212,0.2))",
            filter: "blur(1px)",
          }}
        />

        <div className="relative rounded-3xl bg-card/95 backdrop-blur-xl border  border-[var(--border-clr)] overflow-hidden shadow-md">
          <div className="h-px w-full bg-gradient-to-r from-bg-card via-emerald-500/60 from-bg-card" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-8">
              <div className="fade-up flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <Image src="/icons/logo-white.png" width={25} height={25} alt="Logo" />
                </div>
                <span className="text-primary font-semibold text-lg tracking-tight">Myntpe</span>
                <span className="ml-auto">
                  <span className="mono text-[10px] text-accent/70 bg-accent/10 px-2 py-0.5 rounded-full border  border-[var(--border-clr)]">
                    v1.0.0
                  </span>
                </span>
              </div>

              <div className="fade-up delay-1 mb-7">
                <h1 className="text-primary text-2xl font-semibold tracking-tight">Welcome!</h1>
                <p className="text-primary/40 text-sm mt-1">Create An Account</p>
              </div>

              <>
                <div className="fade-up delay-3 flex flex-col gap-4 mb-4">
                  <InputField
                    label="Email address"
                    type="email"
                    placeholder="you@company.com"
                    icon={ICONS.mail}
                    name="email"
                    register={register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Enter a valid email",
                      },
                    })}
                    error={errors.email}
                  />
                </div>

                <div className="fade-up delay-3 flex flex-col gap-4 mb-4">
                  <InputField
                    label="First Name"
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    register={register("firstName", {
                      required: "First name is required",
                    })}
                    error={errors.firstName}
                  />
                  <InputField
                    label="Last Name"
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    register={register("lastName", {
                      required: "Last name is required",
                    })}
                    error={errors.lastName}
                  />

                  <InputField
                    label="Passport Number"
                    type="text"
                    placeholder="•••••••••"
                    icon={ICONS.file}
                    name="passportNumber"
                    register={register("passportNumber", {
                      required: "Passport number is required",
                      minLength: {
                        value: 8,
                        message: "Passport number must be 8 characters",
                      },
                      maxLength: {
                        value: 12,
                        message: "Passport number must be 12 characters",
                      },
                      pattern: {
                        value: /^[A-Z][0-9]{7}$/,
                        message: "Invalid format (Example: T1234567)",
                      },
                      setValueAs: (value) => value?.toUpperCase().trim(),
                    })}
                    error={errors.passportNumber}
                  />
                  <InputField
                    label="Passport File Number"
                    type="text"
                    placeholder="•••••••••••••••••••••"
                    icon={ICONS.file}
                    name="passportFileNo"
                    register={register("passportFileNo", {
                      required: "Passport file number is required",
                      pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message: "Invalid format (Example: UP1234567890122)",
                      },
                      setValueAs: (value) => value?.toUpperCase().trim(),
                    })}
                    error={errors.passportFileNo}
                  />
                  <InputField
                    label="Date of Birth"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    name="dateOfBirth"
                    onChange={(e) => {
                      e.target.value = formatDOB(e.target.value);
                    }}
                    register={register("dateOfBirth", {
                      required: "Date of birth is required",
                      pattern: {
                        value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                        message: "Format must be DD/MM/YYYY (Example: 01/01/1990)",
                      },
                      validate: {
                        validDate: (value) => {
                          const [day, month, year] = value.split("/").map(Number);
                          const date = new Date(year, month - 1, day);

                          if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                            return "Invalid date";
                          }

                          return true;
                        },

                        notFutureDate: (value) => {
                          const [day, month, year] = value.split("/").map(Number);
                          const birthDate = new Date(year, month - 1, day);
                          const today = new Date();

                          return birthDate <= today || "Date cannot be in the future";
                        },

                        minimumAge: (value) => {
                          const [day, month, year] = value.split("/").map(Number);
                          const today = new Date();
                          const birthDate = new Date(year, month - 1, day);

                          let age = today.getFullYear() - birthDate.getFullYear();
                          const m = today.getMonth() - birthDate.getMonth();

                          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                          }

                          return age >= 18 || "You must be at least 18 years old";
                        },
                      },
                    })}
                    error={errors.dateOfBirth}
                  />
                </div>

                <div className="fade-up delay-4">
                  <button
                    type="submit"
                    disabled={isPending || isSubmitting}
                    className="relative w-full overflow-hidden py-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-70 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md shadow-accent/20 hover:shadow-accent/20 flex items-center justify-center gap-2 shimmer-btn"
                  >
                    {isPending || isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Authenticating…
                      </>
                    ) : (
                      <>Verify Passport & Submit</>
                    )}
                  </button>
                </div>
              </>

              {isSuccess && (
                <div className="fade-up flex flex-col items-center py-8 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-emerald-500/30 flex items-center justify-center">
                    <Icon path={ICONS.check} className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <p className="text-primary/40 text-sm mt-1">Redirecting to Login..</p>
                  </div>
                </div>
              )}
            </div>

            {!isSuccess && (
              <div className="fade-up delay-5 border-t  border-[var(--border-clr)] px-8 py-4 bg-inputbg flex items-center justify-between">
                <p className="text-primary/50 text-xs">
                  Already Have Account?{" "}
                  <button
                    type="button"
                    className="text-accent/80 hover:text-accent font-medium transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                </p>
                <div className="flex items-center gap-1 text-primary/20">
                  <Icon path={ICONS.sparkles} className="w-3 h-3" />
                  <span className="text-[10px] mono">256-bit SSL</span>
                </div>
              </div>
            )}
          </form>
        </div>

        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 blur-2xl rounded-full"
          style={{ background: "rgba(16,185,129,0.15)" }}
        />
      </div>
    </div>
  );
}
