"use client";
import { useEffect, useRef, useState } from "react";
import { saveEducationChoice } from "./actions";
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type School = {
  code: string;   // FAFSA/Title-IV code, 6 chars
  name: string;
  city?: string | null;
  state?: string | null;
};

export default function SchoolSearchStep() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<School | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Search using our secure API route
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

        console.log("Searching for:", query);

        // Use our secure internal API route
        const response = await fetch(
          `/api/schools?q=${encodeURIComponent(query)}`,
          { signal: ctrl.signal }
        );

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API response:", data);
        console.log("Data type:", typeof data);
        console.log("Is array:", Array.isArray(data));
        
        // Handle the response - it should be an array of schools
        const schools: School[] = Array.isArray(data) ? data : [];
        console.log("Processed schools:", schools);
        console.log("Schools length:", schools.length);

        console.log("About to set results and open state");
        setResults(schools);
        setOpen(schools.length > 0);
        console.log("State should be updated now");
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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Find your school</CardTitle>
        <CardDescription>
          Enter your school name or choose "No school" if you're self-taught
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          {/* Search Input Section */}
          <div className="grid gap-3">
            <label className="text-sm font-medium">School name</label>
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

          {/* Results Dropdown */}
          {open && results.length > 0 && (
            <div
              id="school-results"
              role="listbox"
              className="border rounded max-h-64 overflow-auto bg-white shadow-lg z-10"
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
                    w-full text-left px-3 py-2 transition-colors border-b border-gray-100 last:border-b-0
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

          {/* Action Buttons */}
          <div className="grid gap-3">
            {/* Submit selected school via server action */}
            <form action={handleSchoolSubmit}>
              <input type="hidden" name="school_code" value={selected?.code ?? ""} />
              <button
                type="submit"
                disabled={!selected}
                className="w-full rounded bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-50"
              >
                Continue with {selected ? selected.name : "selected school"}
              </button>
            </form>

            {/* Fallback: user doesn't have / doesn't want to choose a school */}
            <form action={handleNoSchoolSubmit}>
              <button
                type="submit"
                className="w-full rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                I don't have a school
              </button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}