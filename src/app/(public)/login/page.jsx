"use client";

import { Icon, ICONS } from "@/app/components/icons";
import { useLogin } from "@/hooks/useLogin";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <style>{`
      @keyframes a1 {
        0%,100% { transform: translate(0,0) scale(1); }
        33%      { transform: translate(40px,-30px) scale(1.06); }
        66%      { transform: translate(-20px,20px) scale(0.96); }
      }
      @keyframes a2 {
        0%,100% { transform: translate(0,0) scale(1); }
        33%      { transform: translate(-50px,30px) scale(1.08); }
        66%      { transform: translate(30px,-20px) scale(0.94); }
      }
      @keyframes a3 {
        0%,100% { transform: translate(0,0) scale(1); }
        50%      { transform: translate(25px,35px) scale(1.05); }
      }
      .a1 { animation: a1 14s ease-in-out infinite; }
      .a2 { animation: a2 17s ease-in-out infinite; }
      .a3 { animation: a3 11s ease-in-out infinite; }
    `}</style>

    <div className="absolute inset-0 bg-base" />

    <div
      className="a1 absolute -top-40 -left-20 w-[650px] h-[500px] rounded-full"
      style={{ background: `var(--accent)`, opacity: 0.08, filter: "blur(110px)" }}
    />
    <div
      className="a2 absolute -bottom-40 -right-20 w-[600px] h-[500px] rounded-full"
      style={{ background: "rgba(6,182,212,1)", opacity: 0.07, filter: "blur(110px)" }}
    />
    <div
      className="a3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full"
      style={{ background: "rgba(139,92,246,1)", opacity: 0.05, filter: "blur(90px)" }}
    />

    {/* Soft noise */}
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }}
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
        <div className="relative rounded-3xl bg-card/95 backdrop-blur-xl border  border-[var(--border-clr)] overflow-hidden shadow-md">
          <div className="h-px w-full bg-gradient-to-r from-bg-card via-accent/80 from-bg-card" />

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
                    className="relative w-full overflow-hidden py-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-70 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md shadow-accent/20 hover:shadow-accent/20 flex items-center justify-center gap-2 shimmer-btn"
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
