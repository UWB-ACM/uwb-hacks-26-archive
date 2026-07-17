import { getSession } from "@/src/util/session";
import { ensureStaffPermission } from "@/src/util/staff";

import BroadcastPanel from "./BroadcastPanel";

export default async function Page() {
    const session = await getSession();
    await ensureStaffPermission(session);

    return <BroadcastPanel></BroadcastPanel>;
}
