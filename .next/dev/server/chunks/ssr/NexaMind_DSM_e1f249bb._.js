module.exports = [
"[project]/NexaMind_DSM/lib/admin-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"400795a96a8174bb8ac47552c999f18f3dd709026f":"softDeleteUser","60ecf1d42611f3ce695692b18b59de53d4cbe6284c":"promoteUserRole","7041b84ba7a47b9eb102bab8468bb94f6a6d5e1d9e":"updateUserStatus"},"",""] */ __turbopack_context__.s([
    "promoteUserRole",
    ()=>promoteUserRole,
    "softDeleteUser",
    ()=>softDeleteUser,
    "updateUserStatus",
    ()=>updateUserStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NexaMind_DSM/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NexaMind_DSM/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/NexaMind_DSM/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NexaMind_DSM/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NexaMind_DSM/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NexaMind_DSM/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function getAdminClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://guzkwaikeiniglzbhgka.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1emt3YWlrZWluaWdsemJoZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzODEzMjQsImV4cCI6MjA4Nzk1NzMyNH0.ZQh07tKMoiNl0BsfG06YHv3rSdPu6j6Sh61kKrEgYac"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            }
        }
    });
}
async function updateUserStatus(userId, status, isApproved) {
    const supabase = await getAdminClient();
    // 1. Verify admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin') throw new Error("Executive authority required");
    // 2. Execute update
    const { error } = await supabase.from("profiles").update({
        account_status: status,
        is_approved: isApproved,
        verification_status: isApproved ? 'Verified' : 'Rejected'
    }).eq("id", userId);
    if (error) throw error;
    // 3. Log action
    await supabase.rpc('log_admin_action', {
        action_type: 'UPDATE_USER_STATUS',
        target_type: 'PROFILE',
        target_id: userId,
        metadata: {
            status,
            isApproved
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/users');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/approvals');
    return {
        success: true
    };
}
async function promoteUserRole(userId, newRole) {
    const supabase = await getAdminClient();
    const { error } = await supabase.from("profiles").update({
        role: newRole
    }).eq("id", userId);
    if (error) throw error;
    await supabase.rpc('log_admin_action', {
        action_type: 'PROMOTE_ROLE',
        target_type: 'PROFILE',
        target_id: userId,
        metadata: {
            newRole
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/users');
    return {
        success: true
    };
}
async function softDeleteUser(userId) {
    const supabase = await getAdminClient();
    const { error } = await supabase.from("profiles").update({
        deleted_at: new Date().toISOString()
    }).eq("id", userId);
    if (error) throw error;
    await supabase.rpc('log_admin_action', {
        action_type: 'SOFT_DELETE_USER',
        target_type: 'PROFILE',
        target_id: userId,
        metadata: {
            deletedAt: new Date().toISOString()
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/users');
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateUserStatus,
    promoteUserRole,
    softDeleteUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserStatus, "7041b84ba7a47b9eb102bab8468bb94f6a6d5e1d9e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(promoteUserRole, "60ecf1d42611f3ce695692b18b59de53d4cbe6284c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(softDeleteUser, "400795a96a8174bb8ac47552c999f18f3dd709026f", null);
}),
"[project]/NexaMind_DSM/.next-internal/server/app/admin/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/NexaMind_DSM/lib/admin-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NexaMind_DSM/lib/admin-actions.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/NexaMind_DSM/.next-internal/server/app/admin/users/page/actions.js { ACTIONS_MODULE0 => \"[project]/NexaMind_DSM/lib/admin-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "400795a96a8174bb8ac47552c999f18f3dd709026f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["softDeleteUser"],
    "60ecf1d42611f3ce695692b18b59de53d4cbe6284c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["promoteUserRole"],
    "7041b84ba7a47b9eb102bab8468bb94f6a6d5e1d9e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserStatus"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$users$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$NexaMind_DSM$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/NexaMind_DSM/.next-internal/server/app/admin/users/page/actions.js { ACTIONS_MODULE0 => "[project]/NexaMind_DSM/lib/admin-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$NexaMind_DSM$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NexaMind_DSM/lib/admin-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=NexaMind_DSM_e1f249bb._.js.map