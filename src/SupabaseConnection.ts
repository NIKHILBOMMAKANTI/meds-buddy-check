import {createClient} from '@supabase/supabase-js'
const supabaseurl:string = import.meta.env.VITE_SUPABASE_URL
const supabaseanonkey:string = import.meta.env.VITE_SUPABASE_ANON_KEY

export  const supabase = createClient(supabaseurl,supabaseanonkey);