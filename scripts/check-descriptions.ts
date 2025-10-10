import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDescriptions() {
  const { data, error } = await supabase
    .from('problems')
    .select('id, title, description')
    .limit(10);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n📊 Sample of first 10 problems:\n');
  data?.forEach(p => {
    const hasDesc = p.description ? '✅' : '❌';
    const preview = p.description ? p.description.substring(0, 50) + '...' : 'NULL';
    console.log(`${hasDesc} ${p.title}: ${preview}`);
  });

  // Count totals
  const { count: totalCount } = await supabase
    .from('problems')
    .select('*', { count: 'exact', head: true });

  const { count: withDesc } = await supabase
    .from('problems')
    .select('*', { count: 'exact', head: true })
    .not('description', 'is', null);

  console.log(`\n📈 Stats:`);
  console.log(`Total problems: ${totalCount}`);
  console.log(`With descriptions: ${withDesc}`);
  console.log(`Without descriptions: ${(totalCount || 0) - (withDesc || 0)}`);
}

checkDescriptions();
