import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import {
  fetchProblemDetail,
  transformProblemForDB,
  transformProblemDetailForDB,
} from '../lib/leetcode-fetcher';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function test() {
  console.log('🧪 Testing single upsert with "Two Sum" problem...\n');

  // Get an existing problem from the database first
  const { data: existingProblems, error: fetchError } = await supabase
    .from('problems')
    .select('*')
    .eq('title_slug', 'two-sum')
    .single();

  if (fetchError || !existingProblems) {
    console.error('❌ Could not find "two-sum" problem:', fetchError);
    return;
  }

  console.log('✅ Found existing problem:', existingProblems.title);
  console.log(`Current description: ${existingProblems.description ? 'EXISTS' : 'NULL'}\n`);

  // Fetch detailed info from LeetCode
  console.log('📘 Fetching details from LeetCode...');
  const detail = await fetchProblemDetail('two-sum');
  const detailedRow = transformProblemDetailForDB(detail);

  console.log(`✅ Got description (${detailedRow.description?.length || 0} chars)\n`);

  // Create a basic problem object to match what we have
  const basicProblem = {
    leetcode_id: existingProblems.leetcode_id,
    title: existingProblems.title,
    title_slug: existingProblems.title_slug,
    difficulty: existingProblems.difficulty,
    acceptance_rate: existingProblems.acceptance_rate,
    topic_tags: existingProblems.topic_tags,
    is_premium: existingProblems.is_premium,
    has_solution: existingProblems.has_solution,
    has_video_solution: existingProblems.has_video_solution,
  };

  console.log('💾 Attempting upsert...');
  const { error: upsertError, data } = await supabase
    .from('problems')
    .upsert({
      ...basicProblem,
      description: detailedRow.description,
      examples: detailedRow.examples,
      total_submissions: detailedRow.total_submissions,
      total_accepted: detailedRow.total_accepted,
      hints: detailedRow.hints,
      code_snippets: detailedRow.code_snippets,
    }, {
      onConflict: 'leetcode_id',
      ignoreDuplicates: false
    })
    .select('title, description');

  if (upsertError) {
    console.error('\n❌ UPSERT FAILED:', upsertError);
  } else {
    console.log('\n✅ SUCCESS! Upsert worked!');
    console.log(`Description now: ${data?.[0]?.description ? 'EXISTS (' + data[0].description.substring(0, 50) + '...)' : 'NULL'}`);
  }
}

test();
