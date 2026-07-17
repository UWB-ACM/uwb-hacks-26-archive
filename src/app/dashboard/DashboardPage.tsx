import React from "react";
import UserDashboard from "@/src/components/dashboards/UserDashboard";
import DeleteAccountButton from "@/src/components/dashboards/userdashboard/DeleteAccountButton";
import { demoUser } from "@/src/data/archive";

/**
 * The static archive dashboard. On the live site this rendered the signed-in
 * user's dashboard (plus staff/admin tooling for privileged accounts). The
 * archive has no authentication, so it always shows the standard user view
 * populated with demo data.
 */
export default function DashboardPage() {
    return (
        <>
            <UserDashboard user={demoUser} />

            {/* Delete account section */}
            <div className="text-center">
                <h2 className="text-3xl py-2">Danger Zone</h2>

                <DeleteAccountButton />
            </div>
        </>
    );
}
