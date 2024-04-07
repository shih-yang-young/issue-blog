"use client";
import { title } from "@/components/primitives";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { Octokit } from "octokit";
import { GithubIssue } from "@/interfaces/GithubIssue";
import { browseColumns } from "@/composables/table";

const octokit = new Octokit({});
const username = "Shih-Yang-Young";
const repoName = "issue-blog";
const perPage = 10;
export default function Browse() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(false); // init true, cause need to load first data
  const list = useAsyncList<GithubIssue>({
    async load({ signal, cursor }) {
      if (!cursor) {
        cursor = "1";
      } else {
        cursor = String(Number(cursor) + 1);
      }
      setIsLoading(true);
      const randomParam = Math.random().toString(36).substring(7);
      const response = await octokit.rest.issues.listForRepo({
        owner: username,
        repo: repoName,
        per_page: perPage,
        page: Number(cursor),
        url: `https://api.github.com/repos/Shih-Yang-Young/issue-blog/issues?random=${randomParam}`,
      });
      const githubIssues: GithubIssue[] = response.data.map((issue: any) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || null,
        comments_url: issue.comments_url,
        updated_at: issue.updated_at,
        state: issue.state,
        locked: issue.locked,
      }));
      const unlockedIssues = githubIssues.filter(issue => issue.locked === false);
      if (response.data.length < perPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setIsLoading(false);
      return { items: unlockedIssues, cursor: cursor.toString() };
    },
  });

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });
  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <span
          className={`${title({ size: "sm", color: "violet" })} lg:text-2xl`}
        >
          {username}&nbsp;
        </span>
      </section>
      <Table
        isHeaderSticky
        aria-label="Example table with infinite pagination"
        baseRef={scrollerRef}
        bottomContent={
          hasMore ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="white" />
            </div>
          ) : null
        }
        classNames={{
          base: "max-h-[500px]",
          table: "min-h-[500px]",
        }}
        onRowAction={(key) => alert(`Opening item ${key}...`)}
      >
        <TableHeader columns={browseColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner color="white" />}
        >
          {(item) => (
            <TableRow key={item.number}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
