import { useState, useCallback, useEffect } from "react";

import api from "@/lib/axios.client";

export function useAdminStats() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [requests, setRequests] = useState<any[]>([]);
    const [userCount, setUserCount] = useState<number>(0);
    const [gigCount, setGigCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Add a minimum delay of 1.5s so the skeleton animations have time to beautifully display
            const [signupRes, usersRes, gigsRes] = await Promise.all([
                api.get("/admin/signup"),
                api.get("/admin/total-users"),
                api.get("/admin/total-gigs"),
                new Promise((resolve) => setTimeout(resolve, 1500))
            ]);

            if (signupRes.data.success) {
                setRequests(signupRes.data.data);
            }
            if (usersRes.data.success) {
                setUserCount(usersRes.data.data);
            }
            if (gigsRes.data.success) {
                setGigCount(gigsRes.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        requests,
        userCount,
        gigCount,
        loading,
        refresh: fetchData
    };
}
