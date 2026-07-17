import React from "react";
import ImportDevpostPage from "@/src/app/dashboard/import-devpost/ImportDevpostPage";
import { getSession } from "@/src/util/session";
import { ensureStaffPermission } from "@/src/util/staff";

export default async function Page() {
    const session = await getSession();
    await ensureStaffPermission(session);

    return <ImportDevpostPage />;
}
