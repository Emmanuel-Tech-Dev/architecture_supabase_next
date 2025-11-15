import { supabase } from "./conn.js";

const Model = {
  get: async (
    table,
    {
      select = "*",
      filters = [], // [{ field, op, value }]
      order = { field: "createdAt", ascending: false }, // { field: "created_at", ascending: false }
      limit = null,
      range = null, // { from: 0, to: 9 }
      or = null, // "age.gt.18,city.eq.Accra"
      textSearch = null, // { column: "name", query: "john" , type: "websearch" }
    } = {}
  ) => {
    let query = supabase.from(table).select(select);

    // Dynamic filters GET/POST etc
    if (filters.length > 0) {
      filters.forEach((f) => {
        query = query[f.op](f.field, f.value);
        // example: query.eq("status", "active")
        // example: query.gte("age", 18)
      });
    }

    if (textSearch) {
      query = query.textSearch(textSearch.column, textSearch.query, {
        type: textSearch.type || "websearch",
      });
    }

    // OR filters
    if (or) query = query.or(or);

    // Order
    if (order) {
      query = query.order(order.field, { ascending: order.ascending ?? true });
    }

    // Limit
    if (limit) query = query.limit(limit);

    // Range pagination
    if (range) query = query.range(range.from, range.to);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  insert: async (table, payload, autoFetch = false) => {
    let query = supabase.from(table).insert(payload);

    if (autoFetch) query = query.select();

    const { data, error } = await query;

    if (error) throw error;

    return data;
  },

  update: async (table, id, payload, autoFetch = false) => {
    // const { data, error } = await supabase
    //   .from(table)
    //   .update(payload)
    //   .eq("id", id)
    //   .select();

    let query = supabase.from(table).update(payload).eq("id", id);

    if (autoFetch) query = query.select();
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  delete: async (table, payloadKey = "id", payload) => {
    let query = supabase
      .from(table)
      .delete()
      .eq(payloadKey, payload[payloadKey]);
    let { data, error } = await query;
    if (error) throw error;
    return data;
  },

  save: async (table, payload, payloadKey = "id", autoFetch = false) => {
    let query = supabase
      .from(table)
      .upsert(payload, { onConflict: payloadKey });

    if (autoFetch) query = query.select();
    let { data, error } = await query;
    if (error) throw error;
    return data;
  },

  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    if (error) throw error;
    return data;
  },

  downloadFile: async (bucket, path) => {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) throw error;
    return data;
  },

  deleteFile: async (bucket, path) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  },

  // ---------------- REALTIME ----------------
  subscribe: (table, callback) => {
    const channel = supabase
      .channel(`testing:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, callback)
      .subscribe();
    return channel;
  },

  unsubscribe: (channel) => {
    supabase.removeChannel(channel);
  },

  // ---------------- RPC / FUNCTIONS ----------------
  rpc: async (fnName, params = {}) => {
    const { data, error } = await supabase.rpc(fnName, params);
    if (error) throw error;
    return data;
  },

  // ---------------- AUTH ----------------
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  updateUser: async (updates) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },
};

export default Model;
