import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SchoolSearchStep from "./SchoolSearchStep";
export default async function Page() {
	const supabase = await createClient();
	
	const { data: { user } } = await supabase.auth.getUser();
	console.log("ONBOARDING user:", !!user);
	
	if (!user) {
	  console.log("ONBOARDING redirecting to login - no user");
	  redirect("/login");
	}
  
	const { data: profile } = await supabase
	  .from("users")
	  .select("federal_school_code, questionnaire_completed")
	  .eq("user_id", user.id)
	  .single();
	
	console.log("ONBOARDING profile:", profile);
  
	if (profile?.questionnaire_completed) {
	  console.log("ONBOARDING redirecting to dashboard - questionnaire completed");
	  redirect("/dashboard");
	}
  
	const code = profile?.federal_school_code;
	const codeStr = code === null || code === undefined ? "" : String(code).trim();
	const hasCode = codeStr.length > 0;
	
	console.log("ONBOARDING code check:", { code, hasCode });
  
	if (hasCode) {
	  console.log("ONBOARDING redirecting to questionnaire - has code");
	  redirect("/questionnaire");
	}
  
	console.log("ONBOARDING rendering SchoolSearchStep");
  
	return (
	  <div className="max-w-lg mx-auto p-6">		
		<SchoolSearchStep />
	  </div>
	);
  }