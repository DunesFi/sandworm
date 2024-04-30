import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;

if (!SUPABASE_URL) throw new Error("Missing Supabase URL");
if (!SUPABASE_SECRET_KEY) throw new Error("Missing Supabase Admin Key");

export const client = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
