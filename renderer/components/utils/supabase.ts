import { createClient } from "@supabase/supabase-js";
import env from "../../env";
import type { Database } from "./database.types";

const supabase = createClient<Database>(
	env.publicSupabaseUrl,
	env.publicSupabaseKey,
);

export default supabase;
