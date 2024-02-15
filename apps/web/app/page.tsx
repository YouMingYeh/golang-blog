"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import LoadingCircle from "@/components/ui/icons/loading-circle";
import { getIssues } from "@/lib/github-issues-api";
import { useScrollPosition } from "@/lib/hooks/use-scroll-position";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

// export const runtime = "edge";

const SCROLL_THRESHOLD = 80;
const PER_PAGE = 10;
const DIRECTION = "asc";
const FETCH_DELAY = 5000;

export default function Page() {
  const { token } = useAuth();
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const router = useRouter();

  const searchParams = useSearchParams();

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (loading) return;
    if (scrollPosition > SCROLL_THRESHOLD) {
      const nextPage = currentPage + 1;

      router.push(`?page=${nextPage}`, { scroll: false });
      setLoading(true);
    }
  }, [scrollPosition]);

  const fetchData = useCallback(async () => {
    const params = {
      page: searchParams.get("page"),
      per_page: String(PER_PAGE),
      direction: DIRECTION,
    };

    const issues = await getIssues({ token, params });
    setLoading(false);
    if (issues.length === 0 || !issues.length) {
      return;
    }

    setIssues((prev) => {
      const unique = issues?.filter(
        (issue) => !prev.some((prevIssue) => prevIssue.number === issue.number),
      );
      return [...prev, ...unique];
    });
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams, token]);

  useEffect(() => {
    if (!loading) return;
    setTimeout(() => {
      setLoading(false);
    }, FETCH_DELAY);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("page")) {
      router.replace("/", { scroll: false });
    }
  }, []);

  const mappedIssues = useMemo(() => {
    return issues.map((issue) => {
      return {
        title: issue.title,
        description:
          issue.body?.length > 100
            ? `${issue.body?.slice(0, 100)}...`
            : issue.body,
        link: `/posts/${issue.number}`,
      };
    });
  }, [issues]);

  return (
    <div className="z-0 p-3">
      <h1 className="text-center text-3xl font-bold">Posts</h1>
      <div className="h-96 w-full ">
        {issues.length == 0 ? (
          <div className="grid grid-cols-1  gap-3 py-10 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="group relative block min-h-48 min-w-96  rounded-xl md:min-w-96 lg:min-w-72" />
            <Skeleton className="group relative block min-h-48 min-w-96 rounded-xl md:min-w-96 lg:min-w-72" />
            <Skeleton className="group relative block min-h-48 min-w-96 rounded-xl md:min-w-96 lg:min-w-72" />
          </div>
        ) : (
          <HoverEffect items={mappedIssues} />
        )}
      </div>

      {loading && (
        <div className="flex w-full justify-center">
          <LoadingCircle />
        </div>
      )}
    </div>
  );
}
