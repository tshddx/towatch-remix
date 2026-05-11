import { Database, sql } from "remix/data-table";
import { eq } from "remix/data-table/operators";
import type { BuildAction } from "remix/fetch-router";
import { Session } from "remix/session";
import { css } from "remix/ui";

import { movies, viewings } from "../data/schema.ts";
import type { AppContext } from "../router.ts";
import { routes } from "../routes.ts";
import { Heading } from "../ui/heading.tsx";
import { Layout } from "../ui/layout.tsx";
import { Table } from "../ui/table.tsx";
import { loadCurrentUser, type CurrentUser } from "../utils/current-user.ts";
import { formatDate } from "../utils/date.ts";
import { render } from "../utils/render.tsx";

const VIEWING_USER_PLACEHOLDER = "\u2014";

interface RecentlyWatched {
  movieId: number | null;
  movieTitle: string;
  date: number;
}

interface MostWatched {
  movieId: number;
  movieTitle: string;
  viewings: number;
}

interface HomePageProps {
  currentUser: CurrentUser | null;
  recentlyWatched: RecentlyWatched[];
  mostWatched: MostWatched[];
}

export const home: BuildAction<"GET", typeof routes.home, AppContext> = {
  async handler({ get, request }) {
    let db = get(Database);
    let [currentUser, recentlyWatched, mostWatched] = await Promise.all([
      loadCurrentUser(db, get(Session)),
      loadRecentlyWatched(db),
      loadMostWatched(db),
    ]);
    return render(
      <HomePage
        currentUser={currentUser}
        recentlyWatched={recentlyWatched}
        mostWatched={mostWatched}
      />,
      request,
    );
  },
};

async function loadRecentlyWatched(db: Database): Promise<RecentlyWatched[]> {
  let rows = await db
    .query(viewings)
    .leftJoin(movies, eq("viewings.movie_id", "movies.id"))
    .select({
      movieId: "movies.id",
      movieTitle: "movies.title",
      date: "viewings.date",
    })
    .orderBy("viewings.date", "desc")
    .orderBy("viewings.id", "desc")
    .limit(10)
    .all();

  return rows.map((row) => ({
    movieId: row.movieId,
    movieTitle: row.movieTitle ?? "(unknown)",
    date: row.date,
  }));
}

async function loadMostWatched(db: Database): Promise<MostWatched[]> {
  let result = await db.exec(sql`
    select
      movies.id as movie_id,
      movies.title as movie_title,
      count(*) as viewings
    from viewings
    left join movies on movies.id = viewings.movie_id
    group by viewings.movie_id
    order by viewings desc, movies.title asc
    limit 10
  `);

  let rows = result.rows ?? [];
  return rows.map((row) => ({
    movieId: row.movie_id as number,
    movieTitle: (row.movie_title as string | null) ?? "(unknown)",
    viewings: row.viewings as number,
  }));
}

function HomePage() {
  return ({ currentUser, recentlyWatched, mostWatched }: HomePageProps) => (
    <Layout title="Home" currentUser={currentUser}>
      <div mix={css({ display: "flex", flexWrap: "wrap", gap: "1lh" })}>
        <RecentlyWatchedTable rows={recentlyWatched} />
        <MostWatchedTable rows={mostWatched} />
      </div>
    </Layout>
  );
}

function RecentlyWatchedTable() {
  return ({ rows }: { rows: RecentlyWatched[] }) => (
    <section>
      <Heading level={2}>Recently Watched</Heading>
      {rows.length === 0 ? (
        <p mix={css({ margin: 0 })}>No viewings yet.</p>
      ) : (
        <Table
          columns={[
            { id: "title", label: "Title", width: 27 },
            { id: "user", label: "User", width: 9 },
            { align: "right", id: "date", label: "Date", width: 10 },
          ]}
          data={rows.map((row) => ({
            title:
              row.movieId === null
                ? row.movieTitle
                : {
                    href: routes.movies.show.href({
                      movieId: String(row.movieId),
                    }),
                    text: row.movieTitle,
                  },
            user: VIEWING_USER_PLACEHOLDER,
            date: formatDate(row.date) ?? "\u2014",
          }))}
        />
      )}
    </section>
  );
}

function MostWatchedTable() {
  return ({ rows }: { rows: MostWatched[] }) => (
    <section>
      <Heading level={2}>Most Watched All Time</Heading>
      {rows.length === 0 ? (
        <p mix={css({ margin: 0 })}>No viewings yet.</p>
      ) : (
        <Table
          columns={[
            { id: "title", label: "Title", width: 39 },
            { align: "right", id: "viewings", label: "Viewings", width: 8 },
          ]}
          data={rows.map((row) => ({
            title: {
              href: routes.movies.show.href({ movieId: String(row.movieId) }),
              text: row.movieTitle,
            },
            viewings: String(row.viewings),
          }))}
        />
      )}
    </section>
  );
}
