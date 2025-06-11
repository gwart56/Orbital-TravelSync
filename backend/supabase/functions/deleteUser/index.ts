// import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// serve(async (req) => {
//   // Allow only POST requests
//   if (req.method !== "POST") {
//     return new Response("Method Not Allowed", { status: 405 });
//   }

//   const { userId } = await req.json();

//   if (!userId) {
//     return new Response(JSON.stringify({ error: "Missing userId" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   // Create Supabase admin client using service role key (do NOT expose this to frontend)
//   const supabaseAdmin = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//   );

//   const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

//   if (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   return new Response(JSON.stringify({ message: "User deleted successfully" }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// });
