"use client";
import { useEffect, useRef, useState } from "react";
import { saveEducationChoice } from "./actions";

type School = {
  code: string;   // FAFSA/Title-IV code, 6 chars
  name: string;
  city?: string | null;
  state?: string | null;
};

const POPULAR_MAJORS = [
  // Technology
  'Computer Science',
  'Software Engineering',
  'Data Science',
  'Information Technology',
  'Web Development',
  'Cybersecurity',
  
  // Engineering
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  
  // Business
  'Business Administration',
  'Marketing',
  'Finance',
  'Accounting',
  'Economics',
  
  // Sciences
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Psychology',
  
  // Liberal Arts
  'English',
  'History',
  'Political Science',
  'Communications',
  
  // Health
  'Nursing',
  'Pre-Med',
  'Public Health',
  
  // Creative
  'Graphic Design',
  'UX/UI Design',
  'Fine Arts',
  
  // Other
  'Undecided',
  'Self-Taught',
  'Bootcamp Graduate',
  'Other'
];

export default function SchoolSearchStep() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<School | null>(null);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [customMajor, setCustomMajor] = useState("");
  const [showCustomMajor, setShowCustomMajor] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Search using our secure API route
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
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

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        console.log("Is array:", Array.isArray(data));
        
        // Handle the response - it should be an array of schools
        const schools: School[] = Array.isArray(data) ? data : [];
        console.log("Processed schools:", schools);
        console.log("School count:", schools.length);

        setResults(schools);
        setOpen(schools.length > 0);
        console.log("Set open to:", schools.length > 0);
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

  const handleMajorChange = (value: string) => {
    setSelectedMajor(value);
    if (value === 'Other') {
      setShowCustomMajor(true);
    } else {
      setShowCustomMajor(false);
      setCustomMajor("");
    }
  };

  const getFinalMajor = () => {
    if (selectedMajor === 'Other' && customMajor.trim()) {
      return customMajor.trim();
    }
    return selectedMajor;
  };

  const handleSchoolSubmit = async (formData: FormData) => {
    const code = formData.get("school_code") as string;
    const major = getFinalMajor();
    
    if (!code) {
      alert("Please select a school first.");
      return;
    }
    
    if (!major) {
      alert("Please select your major/field of study.");
      return;
    }
    
    try {
      await saveEducationChoice({ kind: "college", code, major });
      // Redirect will happen automatically via middleware
    } catch (error) {
      console.error("Error saving school choice:", error);
    }
  };

  const handleNoSchoolSubmit = async () => {
    const major = getFinalMajor();
    
    // For "no school" option, major is optional
    // Users can proceed to questionnaire without specifying major
    try {
      await saveEducationChoice({ kind: "no_school", major: major || null });
      // Redirect will happen automatically via middleware
    } catch (error) {
      console.error("Error saving no school choice:", error);
    }
  };

  const isSchoolFormValid = () => {
    return selected && getFinalMajor().length > 0;
  };

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      {/* Header */}
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 text-center">
        <div className="leading-none font-semibold text-xl">Tell us about your education</div>
        <div className="text-muted-foreground text-sm">
          Enter your school and field of study, or choose "No school" if you're self-taught
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <div className="grid gap-6">
          {/* School Search Section */}
          <div className="grid gap-3">
            <label className="text-sm font-medium">School name (optional)</label>
            <input
              value={query}
              onChange={(e) => {
                const newQuery = e.target.value;
                console.log("Query changed to:", newQuery);
                setQuery(newQuery);
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
            
            {/* Debug info */}
            <div className="text-xs text-gray-500 mt-1">
              Debug: query="{query}" (len: {query.length}), results={results.length}, open={open.toString()}
            </div>
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

          {/* Major Selection Section */}
          <div className="grid gap-3">
            <label className="text-sm font-medium">
              Major / Field of Study 
              <span className="text-gray-500">(required for school selection)</span>
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => handleMajorChange(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select your major or field of study</option>
              <optgroup label="Technology">
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Web Development">Web Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </optgroup>
              <optgroup label="Engineering">
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
              </optgroup>
              <optgroup label="Business">
                <option value="Business Administration">Business Administration</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Accounting">Accounting</option>
                <option value="Economics">Economics</option>
              </optgroup>
              <optgroup label="Sciences">
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Psychology">Psychology</option>
              </optgroup>
              <optgroup label="Liberal Arts">
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Political Science">Political Science</option>
                <option value="Communications">Communications</option>
              </optgroup>
              <optgroup label="Health">
                <option value="Nursing">Nursing</option>
                <option value="Pre-Med">Pre-Med</option>
                <option value="Public Health">Public Health</option>
              </optgroup>
              <optgroup label="Creative">
                <option value="Graphic Design">Graphic Design</option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="Fine Arts">Fine Arts</option>
              </optgroup>
              <optgroup label="Other">
                <option value="Undecided">Undecided</option>
                <option value="Self-Taught">Self-Taught</option>
                <option value="Bootcamp Graduate">Bootcamp Graduate</option>
                <option value="Other">Other (specify below)</option>
              </optgroup>
            </select>
          </div>

          {/* Custom Major Input */}
          {showCustomMajor && (
            <div className="grid gap-3">
              <label className="text-sm font-medium">Please specify your major/field</label>
              <input
                type="text"
                value={customMajor}
                onChange={(e) => setCustomMajor(e.target.value)}
                placeholder="Enter your specific major or field of study"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid gap-3">
            {/* Submit selected school via server action */}
            <form action={handleSchoolSubmit}>
              <input type="hidden" name="school_code" value={selected?.code ?? ""} />
              <button
                type="submit"
                disabled={!isSchoolFormValid()}
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
                Continue without school
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}