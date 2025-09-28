"use client";
import { useEffect, useRef, useState } from "react";
import { saveEducationChoice } from "./actions";
import { createClient } from "@/utils/supabase/client";

type School = {
  code: string;   // FAFSA/Title-IV code, 6 chars
  name: string;
  city?: string | null;
  state?: string | null;
};

export default function SchoolSearchStep() {
  const supabase = createClient();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<School | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Search using College Scorecard API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setSelected(null);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        // Use your College Scorecard API key
        const apiKey = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY || "Q3vFYKsHWLdcmu0Z8tWWH6Rd2DuTMRoYkJfWv2lX";
        const baseUrl = process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_BASE_URL || "https://api.data.gov/ed/collegescorecard/v1/schools";
        
        console.log("Environment check:", {
          hasApiKey: !!apiKey,
          hasBaseUrl: !!baseUrl,
          apiKeyLength: apiKey?.length,
          baseUrl: baseUrl
        });

        const response = await fetch(
          `${baseUrl}.json?api_key=${apiKey}&school.name=${encodeURIComponent(query)}&_fields=id,school.name,school.city,school.state&_per_page=12&school.operating=1`,
          { signal: ctrl.signal }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform the API response to match our School type
        const schools: School[] = (data.results || []).map((school: any) => ({
          code: String(school.id || '').padStart(6, '0'), // Federal school code
          name: school["school.name"] || "Unknown School",
          city: school["school.city"] || null,
          state: school["school.state"] || null,
        })).filter((school: { name: string; }) => school.name !== "Unknown School");

        setResults(schools);
        setOpen(schools.length > 0);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("School search error:", error);
          // Fallback to mock data on error
          const mockSchools: School[] = [
            { code: "002546", name: "Harvard University", city: "Cambridge", state: "MA" },
            { code: "003285", name: "Stanford University", city: "Stanford", state: "CA" },
            { code: "002132", name: "Massachusetts Institute of Technology", city: "Cambridge", state: "MA" },
            { code: "004642", name: "SUNY Farmingdale", city: "Farmingdale", state: "NY" },
          ];
          
          const filteredResults = mockSchools.filter(school => 
            school.name.toLowerCase().includes(query.toLowerCase())
          );
          
          setResults(filteredResults);
          setOpen(filteredResults.length > 0);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  const handleSchoolSubmit = async (formData: FormData) => {
    const code = formData.get("school_code") as string;
    if (!code) return;
    
    try {
      await saveEducationChoice({ kind: "college", code });
      // Redirect will happen automatically via middleware
    } catch (error) {
      console.error("Error saving school choice:", error);
    }
  };

  const handleNoSchoolSubmit = async () => {
    try {
      await saveEducationChoice({ kind: "no_school" });
      // Redirect will happen automatically via middleware
    } catch (error) {
      console.error("Error saving no school choice:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Find your school</label>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="Start typing (e.g., 'Farm' → SUNY Farmingdale)"
          className="w-full border rounded px-3 py-2"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="school-results"
        />
        {loading && <div className="text-xs opacity-70 mt-1">Searching…</div>}
      </div>

      {open && results.length > 0 && (
        <div
          id="school-results"
          role="listbox"
          className="border rounded max-h-64 overflow-auto"
        >
          {results.map((s) => (
            <button
              key={s.code}
              type="button"
              role="option"
              aria-selected={selected?.code === s.code}
              onClick={() => {
                setSelected(s);
                setQuery(`${s.name}${s.city ? ` — ${s.city}, ${s.state ?? ""}` : ""}`);
                setOpen(false);
              }}
              className={`
                w-full text-left px-3 py-2 transition-colors
                ${selected?.code === s.code 
                  ? "bg-blue-50 text-blue-900 hover:bg-blue-100 hover:text-blue-900" 
                  : "bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <div className="font-medium">{s.name}</div>
              <div className="text-xs opacity-80">
                {s.city ?? ""}{s.city && s.state ? ", " : ""}{s.state ?? ""} • Code {s.code}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Submit selected school via server action */}
      <form action={handleSchoolSubmit}>
        <input type="hidden" name="school_code" value={selected?.code ?? ""} />
        <button
          type="submit"
          disabled={!selected}
          className="inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium border hover:opacity-90 disabled:opacity-50 border-gray-300 bg-black text-white"
        >
          Continue with {selected ? selected.name : "selected school"}
        </button>
      </form>

      {/* Fallback: user doesn't have / doesn't want to choose a school */}
      <form action={handleNoSchoolSubmit}>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium border hover:opacity-90 disabled:opacity-50 border-gray-300"
        >
          I don't have a school
        </button>
      </form>
    </div>
  );
}