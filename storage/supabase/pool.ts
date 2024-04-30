import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export async function all(supabase: SupabaseClient<Database>) {
  try {
    const { data } = await supabase.from('pool').select(`*, token0(*), token1(*)`).throwOnError();
    return data;
  } catch (e) {
    console.error(e);
  }
}

//TODO
export async function byToken(supabase: SupabaseClient<Database>, token: string[]) {
  try {
    const { data } = await supabase.from('pool').select(`*, token0(*), token1(*)`).in('token0', token).or(`token1`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function byAddress(supabase: SupabaseClient<Database>, address: string[]) {
  try {
    const { data } = await supabase.from('pool').select(`*, token0(*), token1(*)`).in('address', address);
    return data;
  } catch (e) {
    console.error(e);
  }
}

type Simplify<T> = { [k in keyof T]: T[k] };
type Require<T, P extends keyof T> = Omit<T, P> & Required<Pick<T, P>>;

type Pool = Simplify<Require<Partial<Database['public']['Tables']['pool']['Row']>, 'address'>>;


export async function save(supabase: SupabaseClient<Database>, pool: Pool[]) {
  try {
    const { data } = await supabase.from('pool').upsert(pool);
    return data;
  } catch (e) {
    console.error(e);
  }
}


