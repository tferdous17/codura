// app/onboarding/SchoolSearchStep.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveEducationChoice, validateFederalSchoolCode } from "./actions";

type Mode = "ask" | "enter_code";

export default function SchoolSearchStep() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("ask");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function onCodeChange(val: string) {
    const v = val.toUpperCase();
    setCode(v);
    if (!v) { setError(null); return; }
    const check = validateFederalSchoolCode(v);
    setError(check.ok ? null : check.error || "Invalid FAFSA code.");
  }

  async function submitCode() {
    const check = validateFederalSchoolCode(code);
    if (!check.ok || !check.code) {
      setError(check.error || "Invalid FAFSA code.");
      return;
    }
    setSaving(true);
    try {
      await saveEducationChoice({ kind: "college", code: check.code });
      router.push("/questionnaire");
    } finally {
      setSaving(false);
    }
  }

  async function chooseNoSchool() {
    setSaving(true);
    try {
      await saveEducationChoice({ kind: "no_school" });
      router.push("/questionnaire");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {mode === "ask" ? (
        <>
          <label className="block text-sm font-medium">Do you currently attend a college or university?</label>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded border px-3 py-2 hover:bg-gray-50"
              onClick={() => setMode("enter_code")}
              disabled={saving}
            >
              Yes
            </button>
            <button
              type="button"
              className="rounded border px-3 py-2 hover:bg-gray-50"
              onClick={chooseNoSchool}
              disabled={saving}
              aria-busy={saving}
            >
              No
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Choosing “No” will leave your FAFSA code empty (bootcamp / self-taught), then you’ll continue to the questionnaire.
          </p>
        </>
      ) : (
        <>
          <label className="block text-sm font-medium" htmlFor="fafsa">
            Enter your FAFSA/Title-IV school code (6 characters)
          </label>
          <div className="flex items-start gap-2">
            <input
              id="fafsa"
              className="w-full rounded border px-3 py-2 tracking-widest uppercase"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="e.g., 002546"
              maxLength={6}
              autoComplete="off"
              inputMode="text"
            />
            <button
              type="button"
              className="rounded border px-3 py-2 hover:bg-gray-50"
              onClick={submitCode}
              disabled={!!error || code.trim().length !== 6 || saving}
              aria-busy={saving}
            >
              Save &amp; Continue
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="button"
            className="text-sm underline"
            onClick={() => setMode("ask")}
            disabled={saving}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}