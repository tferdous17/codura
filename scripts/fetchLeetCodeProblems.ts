import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';
import { fetchProblemDetail, LeetCodeProblemDetail } from '../lib/leetcode-fetcher';

type ProblemRow = {
  id: number;
  leetcode_id: number;
  title: string;
  title_slug: string;
  description: string | null;
  examples: Record<string, unknown> | null;
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;


if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials.');
  console.error(
    'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseCliArguments() {
  const args = process.argv.slice(2);
  const slugArg = args.find((arg) => arg.startsWith('--slug='));
  const slugsArg = args.find((arg) => arg.startsWith('--slugs='));
  const limitArg = args.find((arg) => arg.startsWith('--limit='));

  const slug = slugArg ? slugArg.split('=')[1] : null;
  const slugs = slugsArg
    ? slugsArg
        .split('=')[1]
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    : null;
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

  return { slug, slugs, limit };
}

async function fetchTargetProblems(
  slugFilters: string[] | null,
  limit?: number
): Promise<ProblemRow[]> {
  if (slugFilters && slugFilters.length > 0) {
    const { data, error } = await supabase
      .from('problems')
      .select('id, leetcode_id, title, title_slug, description, examples')
      .in('title_slug', slugFilters);

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  const query = supabase
    .from('problems')
    .select('id, leetcode_id, title, title_slug, description, examples')
    .or('description.is.null,examples.is.null');

  if (typeof limit === 'number' && Number.isFinite(limit)) {
    query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

function normaliseExampleTestcases(exampleTestcases: string | null): string[] | null {
  if (!exampleTestcases) {
    return null;
  }

  const lines = exampleTestcases
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  return lines;
}

function buildUpdatePayload(
  problem: ProblemRow,
  detail: LeetCodeProblemDetail
): Record<string, unknown> {
  const description = detail.content || problem.description || null;
  const exampleTestcasesArray = normaliseExampleTestcases(detail.exampleTestcases ?? null);
  const sampleTestCase = detail.sampleTestCase ?? null;

  const existingExamples = (problem.examples ?? {}) as Record<string, unknown>;
  const mergedExamples = {
    ...existingExamples,
    ...(sampleTestCase ? { sampleTestCase } : {}),
    ...(exampleTestcasesArray && exampleTestcasesArray.length > 0
      ? { exampleTestcases: exampleTestcasesArray }
      : {}),
  };

  const payload: Record<string, unknown> = {
    description,
  };

  if (
    Object.keys(mergedExamples).length > 0 &&
    (sampleTestCase || (exampleTestcasesArray && exampleTestcasesArray.length > 0))
  ) {
    payload.examples = mergedExamples;
  }

  return payload;
}

async function updateProblem(
  problem: ProblemRow,
  detail: LeetCodeProblemDetail
) {
  const payload = buildUpdatePayload(problem, detail);

  const { error } = await supabase
    .from('problems')
    .update(payload)
    .eq('id', problem.id);

  if (error) {
    throw error;
  }

  return payload;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const { slug, slugs, limit } = parseCliArguments();
  const slugFilters = slug ? [slug] : slugs;

  console.log('🚀 Starting LeetCode problem enrichment.');
  if (slugFilters && slugFilters.length > 0) {
    console.log(`🔍 Filtering by ${slugFilters.length} slug(s).`);
  } else if (typeof limit === 'number') {
    console.log(`🔁 Updating up to ${limit} problem(s).`);
  } else {
    console.log('🔁 Updating all problems missing description/test cases.');
  }

  let problems: ProblemRow[];
  try {
    problems = await fetchTargetProblems(slugFilters, limit);
  } catch (error) {
    console.error('❌ Failed to fetch problems from Supabase:', error);
    process.exit(1);
    return;
  }

  if (problems.length === 0) {
    console.log('✅ Nothing to update. Exiting.');
    return;
  }

  console.log(`📋 Found ${problems.length} problem(s) to process.`);

  let processed = 0;
  let updated = 0;
  let failed = 0;

  for (const problem of problems) {
    processed += 1;
    console.log(
      `\n➡️  [${processed}/${problems.length}] ${problem.title} (${problem.title_slug})`
    );

    try {
      const detail = await fetchProblemDetail(problem.title_slug);

      if (!detail.content && !detail.sampleTestCase) {
        console.warn('⚠️  Missing description or sample test case in response.');
      }

      await updateProblem(problem, detail);
      updated += 1;
      console.log('✅ Updated problem in Supabase.');
    } catch (error) {
      failed += 1;
      console.error(
        `❌ Failed to update "${problem.title_slug}": ${
          (error as Error).message
        }`
      );
    }

    await delay(500);
  }

  console.log('\n📊 Summary');
  console.log(`   Processed: ${processed}`);
  console.log(`   Updated:   ${updated}`);
  console.log(`   Failed:    ${failed}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('💥 Unhandled error in fetchLeetCodeProblems script:', error);
  process.exit(1);
});
