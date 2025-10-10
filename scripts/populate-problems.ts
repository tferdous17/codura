/**
 * Script to populate Supabase database with LeetCode problems
 * Run this script to fetch problems and insert descriptions
 *
 * Usage: 
 * export NEXT_PUBLIC_SUPABASE_URL="https://prxtkrteujbptauwhnxs.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByeHRrcnRldWpicHRhdXdobnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTM5NjMsImV4cCI6MjA3MjkyOTk2M30.EtwGS8bf_SXbQZEGubNe0Q2uUtC3hTbhX1jYQD1Bgpw"
npx tsx scripts/populate-problems.ts
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import {
  fetchProblemsInBatches,
  fetchProblemDetail,
  transformProblemForDB,
  transformProblemDetailForDB,
} from '../lib/leetcode-fetcher';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🚀 Starting LeetCode problems import...\n');

  try {
    // STEP 1: Fetch problem summaries
    const problems = await fetchProblemsInBatches(100);
    console.log(`✅ Retrieved ${problems.length} problems.`);

    // STEP 2: Insert or upsert basic problem info
    for (const problem of problems) {
      const dbRow = transformProblemForDB(problem);
      const { error } = await supabase.from('problems').upsert(dbRow, {
        onConflict: 'leetcode_id',
      });
      if (error) {
        console.error(`❌ Error inserting problem ${problem.title}:`, error);
      }
    }

    console.log('✅ Basic problem data inserted.\n');

    // STEP 3: Fetch and insert full descriptions
    for (const problem of problems) {
      try {
        console.log(`📘 Fetching details for ${problem.titleSlug}...`);
        const detail = await fetchProblemDetail(problem.titleSlug);
        const detailedRow = transformProblemDetailForDB(detail);

        // Update existing record
        const { error: updateError } = await supabase
          .from('problems')
          .update({
            description: detailedRow.description,
            examples: detailedRow.examples,
            total_submissions: detailedRow.total_submissions,
            total_accepted: detailedRow.total_accepted,
            acceptance_rate: detailedRow.acceptance_rate,
            hints: detailedRow.hints,
            code_snippets: detailedRow.code_snippets,
          })
          .eq('leetcode_id', detailedRow.leetcode_id);

        if (updateError) {
          console.error(`⚠️ Failed updating ${problem.titleSlug}:`, updateError);
        } else {
          console.log(`✅ Updated ${problem.titleSlug}`);
        }

        // avoid rate limits
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        console.error(`❌ Error on ${problem.titleSlug}:`, err);
      }
    }

    console.log('\n🎯 All problems and descriptions inserted successfully.');
  } catch (err) {
    console.error('❌ Fatal error:', err);
  }
}

main();
