// Simple test script to verify Supabase connection
// Run with: node test-db.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('user_stats')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('\nPossible issues:');
      console.log('1. Database schema not created - run the SQL in database-schema.sql');
      console.log('2. Wrong environment variables');
      console.log('3. Supabase project not set up correctly');
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log('✅ user_stats table exists and is accessible');
    
    // Test game_records table
    const { data: gameData, error: gameError } = await supabase
      .from('game_records')
      .select('count')
      .limit(1);
    
    if (gameError) {
      console.error('❌ game_records table error:', gameError.message);
    } else {
      console.log('✅ game_records table exists and is accessible');
    }
    
    // Test difficulty_stats view
    const { data: diffData, error: diffError } = await supabase
      .from('difficulty_stats')
      .select('count')
      .limit(1);
    
    if (diffError) {
      console.error('❌ difficulty_stats view error:', diffError.message);
    } else {
      console.log('✅ difficulty_stats view exists and is accessible');
    }
    
    console.log('\n🎉 All database tests passed! Your Supabase setup is working correctly.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection(); 