import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import {
  fetchProblemsInBatches,
  fetchProblemDetail,
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
  console.log('🧪 Testing with Roman to Integer problem...\n');

  const problems = await fetchProblemsInBatches(20);
  const problem = problems.find(p => p.titleSlug === 'roman-to-integer')!;

  console.log(`Testing: ${problem.title}\n`);

  const detail = await fetchProblemDetail(problem.titleSlug);
  const detailedRow = transformProblemDetailForDB(detail);

  // Fetch existing row
  const { data: existingRow, error: fetchError } = await supabase
    .from('problems')
    .select('*')
    .eq('leetcode_id', parseInt(problem.frontendQuestionId))
    .single();

  if (fetchError || !existingRow) {
    console.error('❌ Could not find existing problem:', fetchError);
    return;
  }

  console.log('✅ Found existing row');
  console.log(`Current description: ${existingRow.description ? 'EXISTS' : 'NULL'}\n`);

  // Upsert with all fields
  const { error: upsertError, data } = await supabase
    .from('problems')
    .upsert({
      ...existingRow,
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
    console.log('\n✅ SUCCESS!');
    console.log(`Description: ${data?.[0]?.description ? 'EXISTS' : 'NULL'}`);
  }
}

test();
