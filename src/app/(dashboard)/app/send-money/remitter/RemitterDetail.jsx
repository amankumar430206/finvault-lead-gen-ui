"use client";

import { InputField } from "@/app/(public)/register/page";
import { Icon, ICONS } from "@/app/components/icons";
import { ListSkeleton } from "@/app/components/skeleton";
import { usePanVerify, usePassportConfirm, usePassportVerify } from "@/hooks/useKYC";
import { useGetUserById } from "@/hooks/useStudent";
import { useAuthStore } from "@/store/auth.store";
import { useSendMoneyForm } from "@/store/form.store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const RemitterDetail = ({ _id = null }) => {
  const router = useRouter();
  const { isLoading, data, refetch } = useGetUserById({
    query: {
      populate: "passport pan",
    },
    params: {
      _id: _id,
    },
  });

  const userData = data?.content;

  const isPasportVerified = userData?.passport?.verified;
  const isPanVerified = userData?.pan?.verified;
  const allowProceedNext = isPasportVerified && isPanVerified;

  // if current user if student set auth user to send mone y user, else show students list to agent then show remittter details

  if (isLoading) return <ListSkeleton />;

  return (
    <div>
      <>
        <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto max-w-2xl mx-auto">
          <h1 className="text-white text-sm mb-3">Remitter Details</h1>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
            {[
              [
                "KYC Status",
                <span className=" text-xs font-medium px-2.5 py-1 rounded-full border">{userData?.kycStatus}</span>,
              ],
              ["Remitter Name", `${userData?.firstName} ${userData?.lastName}`],
              ["Email Address", userData?.email],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-4 py-3">
                <span className="text-white/35 text-sm capitalize">{k}</span>
                <span className="text-white/75 text-sm font-medium mono">{v}</span>
              </div>
            ))}
          </div>

          {/* Passport details */}
          <h1 className="text-white text-sm mb-3">Passport Details</h1>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
            {[
              ["passport Number", `${userData?.passport?.passportNumber}`],
              ["passport File No.", `${userData?.passport?.fileNumber}`],
              ["D.O.B", `${userData?.passport?.dob}`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-4 py-3">
                <span className="text-white/35 text-sm capitalize">{k}</span>
                <span className="text-white/75 text-sm font-medium mono">{v}</span>
              </div>
            ))}

            {/* Passport Verification */}
            <PassportVerification isVerified={isPasportVerified} userData={userData} />
          </div>

          {/* PAN details */}
          {isPasportVerified && (
            <>
              <h1 className="text-white text-sm mb-3">PAN Details</h1>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
                {/* PAN Verification */}
                <PANVerification isVerified={isPanVerified} user={userData} />
              </div>
            </>
          )}

          {allowProceedNext && (
            <button
              type="button"
              onClick={() => {
                router.push("/app/send-money/recipient");
              }}
              className="w-full relative overflow-hidden py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              <>Confirm & Proceed</>
            </button>
          )}
        </div>
      </>
    </div>
  );
};

const PANVerification = ({ isVerified = false, user = null }) => {
  const { data, isPending, mutateAsync, isSuccess } = usePanVerify();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all",
  });

  const onSubmit = async (data) => {
    await mutateAsync({ panNumber: data?.panNo, user: user?._id });
  };

  if (isVerified || isSuccess)
    return (
      <>
        {[["PAN", `${user?.pan?.panNumber}`]].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3">
            <span className="text-white/35 text-sm capitalize">{k}</span>
            <span className="text-white/75 text-sm font-medium mono">{v}</span>
          </div>
        ))}

        <div className="flex items-center justify-between px-4 py-3 bg-emerald-400/10">
          <span className="text-white/35 text-sm capitalize">Verfication Status</span>
          <span className="text-white/75 text-sm font-medium mono flex gap-2">
            PAN Verfied <Icon path={ICONS.shield} />
          </span>
        </div>
      </>
    );

  return (
    <>
      {/* Verified PAN details */}

      {/* Pan Verification */}
      <div className="p-3">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="false">
          <div className="space-y-4">
            <InputField
              label="PAN No."
              type="text"
              placeholder="•••••••••••••••••••••"
              icon={ICONS.file}
              name="panNo"
              onChange={(e) => {
                e.target.value = e.target.value?.toUpperCase().trim();
              }}
              register={register("panNo", {
                required: "PAN number is required",
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Invalid PAN format (Example: ABCDE1234F)",
                },
                setValueAs: (value) => value?.toUpperCase().trim(),
              })}
              error={errors.panNo}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative overflow-hidden py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              {isSubmitting || isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying..
                </>
              ) : (
                <>Verify PAN & Match</>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const PassportVerification = ({ isVerified = false, userData = null }) => {
  const PassportVerify = usePassportVerify();
  const PassportConfirm = usePassportConfirm();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all",
    defaultValues: {
      passportNumber: userData?.passport?.passportNumber,
      passportFileNo: userData?.passport?.fileNumber,
      dateOfBirth: userData?.passport?.dob,
    },
  });

  const onSubmit = async (data) => {
    console.log(userData);
    if (!userData?._id) return;

    const payload = {
      passportNumber: data.passportNumber,
      fileNumber: data.passportFileNo,
      dob: data.dateOfBirth,
      user: userData._id,
    };

    await PassportVerify.mutateAsync(payload);
  };

  const confirmPassport = async () => {
    await PassportConfirm({ user: userData._id });
  };

  if (isVerified)
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-400/10">
        <span className="text-white/35 text-sm capitalize">Verfication Status</span>
        <span className="text-white/75 text-sm font-medium mono flex gap-2">
          Passport Verfied <Icon path={ICONS.shield} />
        </span>
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-red-400 text-sm capitalize">{userData?.passport?.verified ? "" : "Action Required"}</span>
        <span className="text-white/75 text-sm font-medium mono flex gap-2">
          Passport Not Verfied <Icon path={ICONS.eyeOff} />
        </span>
      </div>

      {/* Note */}
      <div className="flex items-center justify-between px-4 py-3 bg-amber-200/10">
        <span className="text-amber-400 text-sm">
          To continue with the verification process, the information on your Passport and PAN documents must match.
          Kindly review and resubmit if there is any discrepancy.
        </span>
      </div>
      <div className="p-3">
        <form onSubmit={handleSubmit(onSubmit)} disabled={PassportVerify.isPending} autoComplete="false">
          <div className="space-y-4">
            <InputField
              label="Passport No."
              type="text"
              placeholder="•••••••••••"
              icon={ICONS.file}
              name="passportNumber"
              onChange={(e) => {
                e.target.value = e.target.value?.toUpperCase().trim();
              }}
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

            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-white/75 text-sm">
                Note : Please ensure all entered details are accurate and confirmed before continuing. Once submitted,
                the information cannot be modified.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative overflow-hidden py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>Verify Passport</>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RemitterDetail;
