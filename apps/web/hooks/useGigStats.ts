"use client";
import { useState, useCallback, useEffect } from "react";

import api from "@/lib/axios.client";

export function useGigStats() {
    const [stats, setStats] = useState({
        activeGigs: 0,
        reportedGigs: 0,
        pausedGigs: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Min delay of 1s for skeletons
            const [statsRes] = await Promise.all([
                api.get("/admin/gig-stats"),
                new Promise((resolve) => setTimeout(resolve, 1000))
            ]);

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch gig moderation stats:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        stats,
        loading,
        refresh: fetchData
    };
}
