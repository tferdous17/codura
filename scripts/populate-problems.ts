/**
 * Script to populate Supabase database with LeetCode problems
 * Run this script to fetch problems and insert descriptions
 *
 * Usage: npx tsx scripts/populate-problems.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file explicitly
config({ path: resolve(process.cwd(), '.env.local') });
import { createClient } from '@supabase/supabase-js';
import {
  fetchProblemsInBatches,
  fetchProblemDetail,
  transformProblemForDB,
  transformProblemDetailForDB,
} from '../lib/leetcode-fetcher';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY - this is required to bypass RLS policies.');
  console.error('Please add it to your .env.local file.');
  process.exit(1);
}

console.log('🔑 Using service role key to bypass RLS...\n');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('🚀 Starting LeetCode problems import...\n');

  try {
    // STEP 1: Fetch problem summaries
    const problems = await fetchProblemsInBatches(100);
    console.log(`✅ Retrieved ${problems.length} problems.`);

    // STEP 2: Insert or upsert basic problem info in batches
    console.log(`\n📝 Inserting ${problems.length} problems in batches...\n`);

    const BATCH_SIZE = 500; // Supabase can handle large batches
    const dbRows = problems.map(transformProblemForDB);

    for (let i = 0; i < dbRows.length; i += BATCH_SIZE) {
      const batch = dbRows.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(dbRows.length / BATCH_SIZE);

      console.log(`📦 Inserting batch ${batchNum}/${totalBatches} (${batch.length} problems)...`);

      const { error, count } = await supabase
        .from('problems')
        .upsert(batch, {
          onConflict: 'leetcode_id',
          count: 'exact'
        });

      if (error) {
        console.error(`❌ Error inserting batch ${batchNum}:`, error);
        // Continue with next batch instead of failing completely
      } else {
        console.log(`✅ Batch ${batchNum} inserted successfully (${count} rows affected)`);
      }
    }

    console.log('\n✅ Basic problem data inserted.\n');

    // STEP 3: Fetch and insert full descriptions
    // NOTE: This step is VERY slow due to rate limiting (1 request per second)
    // Set SKIP_DETAILS=true to skip this step
    const skipDetails = process.env.SKIP_DETAILS === 'true';

    if (skipDetails) {
      console.log('⏭️  Skipping detailed descriptions (SKIP_DETAILS=true)\n');
      console.log('🎯 Basic problem data import complete!');
      return;
    }

    console.log('📖 Fetching detailed descriptions for all problems...');
    console.log(`⏱️  This will take approximately ${Math.ceil(problems.length / 60)} minutes (rate limited to 1 req/sec)\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      const progress = `[${i + 1}/${problems.length}]`;

      try {
        console.log(`${progress} 📘 Fetching ${problem.titleSlug}...`);
        const detail = await fetchProblemDetail(problem.titleSlug);
        const detailedRow = transformProblemDetailForDB(detail);

        // First, fetch the existing row to get all current data
        const { data: existingRow, error: fetchError } = await supabase
          .from('problems')
          .select('*')
          .eq('leetcode_id', parseInt(problem.frontendQuestionId))
          .single();

        if (fetchError || !existingRow) {
          console.error(`${progress} ⚠️  Could not find existing problem:`, fetchError);
          errorCount++;
          continue;
        }

        // Use UPSERT with the complete existing row plus new fields
        const { error: upsertError } = await supabase
          .from('problems')
          .upsert({
            ...existingRow,  // All existing fields
            description: detailedRow.description,
            examples: detailedRow.examples,
            total_submissions: detailedRow.total_submissions,
            total_accepted: detailedRow.total_accepted,
            hints: detailedRow.hints,
            code_snippets: detailedRow.code_snippets,
          }, {
            onConflict: 'leetcode_id',
            ignoreDuplicates: false
          });

        if (upsertError) {
          console.error(`${progress} ⚠️  Failed updating ${problem.titleSlug}:`, upsertError);
          errorCount++;
        } else {
          successCount++;
          // Only log success every 10 problems to reduce noise
          if (successCount % 10 === 0) {
            console.log(`${progress} ✅ Updated ${successCount} problems so far...`);
          }
        }

        // avoid rate limits
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        console.error(`${progress} ❌ Error on ${problem.titleSlug}:`, err);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 Import complete!');
    console.log(`✅ Successfully updated: ${successCount} problems`);
    console.log(`❌ Errors: ${errorCount} problems`);
    console.log('='.repeat(50));
  } catch (err) {
    console.error('❌ Fatal error:', err);
  }
}

main();
