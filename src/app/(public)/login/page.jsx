"use client";

import { Icon, ICONS } from "@/app/components/icons";
import { useLogin } from "@/hooks/useLogin";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[#070910]" />
    <div
      className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
    <div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-bg-card via-emerald-500/20 from-bg-card"
      style={{ top: "38%" }}
    />
  </div>
);

export const InputField = ({ label, type = "text", placeholder, icon, rightEl, error, register, name }) => (
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
      />
      {rightEl && <div className="p-3">{rightEl}</div>}
    </div>
    {error && <p className="text-red-400 text-xs mt-1.5">{error.message}</p>}
  </div>
);

export default function LoginPage() {
  const router = useRouter();

  const loginMutation = useLogin();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onSubmit",
  });

  const rememberMe = watch("rememberMe", false);

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    const payload = {
      userId: data.email,
      password: data.password,
    };
    await loginMutation.mutateAsync(payload);
  };

  const handleCreateAccount = () => {
    router.push("/register");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden">
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
                <h1 className="text-primary text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-primary/50 text-sm mt-1">Sign in to your dashboard</p>
              </div>

              <>
                <div className="fade-up delay-2 flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-inputbg" />
                  <span className="text-primary/70 text-xs capitalize">sign in</span>
                  <div className="flex-1 h-px bg-inputbg" />
                </div>

                <div className="fade-up delay-3 flex flex-col gap-4 mb-4">
                  <InputField
                    label="user id / email"
                    type="text"
                    placeholder="you@company.com"
                    icon={ICONS.mail}
                    name="email"
                    register={register("email", {
                      required: "user is required",
                      // pattern: {
                      //   value: /\S+@\S+\.\S+/,
                      //   message: "Enter a valid userid or email address",
                      // },
                    })}
                    error={errors.email}
                  />

                  <InputField
                    label="Password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    icon={ICONS.lock}
                    name="password"
                    register={register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                    error={errors.password}
                    rightEl={
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="text-primary/70 hover:text-primary/60 transition-colors"
                      >
                        <Icon path={showPw ? ICONS.eyeOff : ICONS.eye} className="w-4 h-4" />
                      </button>
                    }
                  />
                </div>

                <div className="fade-up delay-3 flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 cursor-pointer group" htmlFor="rememberMe">
                    <input type="checkbox" className="hidden" {...register("rememberMe")} id="rememberMe" />
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all
                        ${rememberMe ? "bg-accent border-emerald-500" : "border-white/20 bg-inputbg"}`}
                    ></div>
                    <span className="text-primary/40 text-xs group-hover:text-primary/60 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-xs text-accent/80 hover:text-accent transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="fade-up delay-4">
                  <button
                    type="submit"
                    disabled={loginMutation.isPending || isSubmitting}
                    className="relative w-full overflow-hidden py-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-70 text-primary text-sm font-semibold tracking-wide transition-all duration-200 shadow-md shadow-accent/20 hover:shadow-accent/20 flex items-center justify-center gap-2 shimmer-btn"
                  >
                    {loginMutation.isPending || isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Authenticating…
                      </>
                    ) : (
                      <>
                        Sign in
                        <Icon path={ICONS.arrow} className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>

              {loginMutation.isSuccess && (
                <div className="fade-up flex flex-col items-center py-8 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-emerald-500/30 flex items-center justify-center">
                    <Icon path={ICONS.check} className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <p className="text-primary/40 text-sm mt-1">Redirecting to dashboard…</p>
                  </div>
                </div>
              )}
            </div>

            {!loginMutation.isSuccess && (
              <div className="fade-up delay-5 border-t  border-[var(--border-clr)] px-8 py-4 bg-inputbg flex items-center justify-between">
                <p className="text-primary/50 text-xs">
                  No account?{" "}
                  <button
                    type="button"
                    className="text-accent/80 hover:text-accent font-medium transition-colors"
                    onClick={handleCreateAccount}
                  >
                    Create An Account
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

        <p className="text-primary text-xs text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary mt-4 my-4">
          <Link href="/">Terms of Service</Link> and <Link href="/">Privacy Policy</Link>.
        </p>

        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 blur-2xl rounded-full"
          style={{ background: "rgba(16,185,129,0.15)" }}
        />
      </div>
    </div>
  );
}
