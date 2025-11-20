import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, //Supabase url
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY //Supase anon key- Get it when you creat project in supabase
);
