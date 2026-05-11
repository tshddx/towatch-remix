import { Database } from "remix/data-table";
import { eq } from "remix/data-table/operators";
import type { Controller } from "remix/fetch-router";
import { redirect } from "remix/response/redirect";
import { Session } from "remix/session";
import { css, Fragment, type RemixNode } from "remix/ui";

import { movies, people, viewings } from "../../data/schema.ts";
import type { AppContext } from "../../router.ts";
import { routes } from "../../routes.ts";
import { Heading } from "../../ui/heading.tsx";
import { InlineLink } from "../../ui/inline-link.tsx";
import { Layout } from "../../ui/layout.tsx";
import { PaginationControls } from "../../ui/pagination-controls.tsx";
import { Table } from "../../ui/table.tsx";
import { loadCurrentUser, type CurrentUser } from "../../utils/current-user.ts";
import { formatDate } from "../../utils/date.ts";
import { parsePageParam, PAGE_SIZE } from "../../utils/pagination.ts";
import { render } from "../../utils/render.tsx";

interface MovieListRow {
  id: number;
  title: string;
  director_id: number | null;
  director_name: string | null;
}

interface MovieListPageProps {
  currentUser: CurrentUser | null;
  movies: MovieListRow[];
  page: number;
  hasNextPage: boolean;
}

interface MovieDetail {
  id: number;
  title: string;
  release_date: number | null;
  runtime: number | null;
  director_id: number | null;
  director_name: string | null;
  nationality: string | null;
  comments: string | null;
  tmdb_id: string | null;
  recommended_by: string | null;
  recommend_comments: string | null;
}

interface MovieViewing {
  date: number;
}

const VIEWING_USER_PLACEHOLDER = "\u2014";

interface MovieDetailPageProps {
  currentUser: CurrentUser | null;
  movie: MovieDetail;
  viewings: MovieViewing[];
}

export const movieController = {
  actions: {
    async index({ get, request }) {
      let url = new URL(request.url);
      let parsed = parsePageParam(url);
      if (parsed.shouldStripPage) {
        return redirect(routes.movies.index.href(), 303);
      }

      let db = get(Database);
      let [currentUser, rows] = await Promise.all([
        loadCurrentUser(db, get(Session)),
        loadMovieList(db, parsed.page),
      ]);

      // We over-fetch by one to know if there's a next page without
      // running a separate count query.
      let hasNextPage = rows.length > PAGE_SIZE;
      let pageRows = hasNextPage ? rows.slice(0, PAGE_SIZE) : rows;

      return render(
        <MovieListPage
          currentUser={currentUser}
          movies={pageRows}
          page={parsed.page}
          hasNextPage={hasNextPage}
        />,
        request,
      );
    },

    async show({ get, request, params }) {
      let movieId = Number(params.movieId);
      if (!Number.isInteger(movieId) || movieId <= 0) {
        return new Response("Not Found", { status: 404 });
      }

      let db = get(Database);
      let [currentUser, movie, movieViewings] = await Promise.all([
        loadCurrentUser(db, get(Session)),
        loadMovie(db, movieId),
        loadMovieViewings(db, movieId),
      ]);

      if (!movie) return new Response("Not Found", { status: 404 });

      return render(
        <MovieDetailPage
          currentUser={currentUser}
          movie={movie}
          viewings={movieViewings}
        />,
        request,
      );
    },
  },
} satisfies Controller<typeof routes.movies, AppContext>;

async function loadMovieList(
  db: Database,
  page: number,
): Promise<MovieListRow[]> {
  return await db
    .query(movies)
    .leftJoin(people, eq("movies.director_id", "people.id"))
    .select({
      id: "movies.id",
      title: "movies.title",
      director_id: "movies.director_id",
      director_name: "people.name",
    })
    .orderBy("movies.title", "asc")
    .orderBy("movies.id", "asc")
    .limit(PAGE_SIZE + 1)
    .offset((page - 1) * PAGE_SIZE)
    .all();
}

async function loadMovie(
  db: Database,
  id: number,
): Promise<MovieDetail | null> {
  let row = await db
    .query(movies)
    .leftJoin(people, eq("movies.director_id", "people.id"))
    .select({
      id: "movies.id",
      title: "movies.title",
      release_date: "movies.release_date",
      runtime: "movies.runtime",
      director_id: "movies.director_id",
      director_name: "people.name",
      nationality: "movies.nationality",
      comments: "movies.comments",
      tmdb_id: "movies.tmdb_id",
      recommended_by: "movies.recommended_by",
      recommend_comments: "movies.recommend_comments",
    })
    .where({ "movies.id": id })
    .first();

  return row ?? null;
}

async function loadMovieViewings(
  db: Database,
  movieId: number,
): Promise<MovieViewing[]> {
  return await db
    .query(viewings)
    .select({
      date: "viewings.date",
    })
    .where({ "viewings.movie_id": movieId })
    .orderBy("viewings.date", "desc")
    .orderBy("viewings.id", "desc")
    .limit(PAGE_SIZE)
    .all();
}

function MovieListPage() {
  return ({
    currentUser,
    movies: rows,
    page,
    hasNextPage,
  }: MovieListPageProps) => (
    <Layout title="Movies" currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        <Heading level={1}>Movies</Heading>
        {rows.length === 0 ? (
          <p mix={css({ margin: 0 })}>No movies on this page.</p>
        ) : (
          <Table
            columns={[
              { id: "title", label: "Title", width: 27 },
              { id: "director", label: "Director", width: 20 },
            ]}
            data={rows.map((row) => ({
              title: {
                href: routes.movies.show.href({ movieId: String(row.id) }),
                text: row.title,
              },
              director:
                row.director_id === null || row.director_name === null
                  ? "\u2014"
                  : {
                      href: routes.people.show.href({
                        personId: String(row.director_id),
                      }),
                      text: row.director_name,
                    },
            }))}
          />
        )}
        <PaginationControls
          basePath={routes.movies.index.href()}
          page={page}
          hasNextPage={hasNextPage}
        />
      </div>
    </Layout>
  );
}

function MovieDetailPage() {
  return ({ currentUser, movie, viewings }: MovieDetailPageProps) => (
    <Layout title={movie.title} currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        <Heading level={1}>{movie.title}</Heading>
        <MovieMetadataTable movie={movie} />
        <ViewingsTable movie={movie} viewings={viewings} />
      </div>
    </Layout>
  );
}

function MovieMetadataTable() {
  return ({ movie }: { movie: MovieDetail }) => {
    let entries: Array<[string, RemixNode]> = [];
    let releaseDate = formatDate(movie.release_date);
    if (releaseDate) entries.push(["Released", releaseDate]);
    if (movie.runtime !== null)
      entries.push(["Runtime", `${movie.runtime} min`]);
    if (movie.director_id !== null && movie.director_name !== null) {
      entries.push([
        "Director",
        <InlineLink
          href={routes.people.show.href({
            personId: String(movie.director_id),
          })}
        >
          {movie.director_name}
        </InlineLink>,
      ]);
    }
    if (movie.nationality) entries.push(["Nationality", movie.nationality]);
    if (movie.comments) entries.push(["Comments", movie.comments]);
    if (movie.recommended_by)
      entries.push(["Recommended by", movie.recommended_by]);
    if (movie.recommend_comments) {
      entries.push(["Recommend comments", movie.recommend_comments]);
    }
    if (movie.tmdb_id) entries.push(["TMDB id", movie.tmdb_id]);

    if (entries.length === 0) {
      return <p mix={css({ margin: 0 })}>No metadata.</p>;
    }

    return (
      <dl>
        {entries.map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>
    );
  };
}

function ViewingsTable() {
  return ({
    movie,
    viewings,
  }: {
    movie: MovieDetail;
    viewings: MovieViewing[];
  }) => (
    <section>
      <Heading level={3}>Recent Viewings</Heading>
      {viewings.length === 0 ? (
        <p mix={css({ margin: 0 })}>No viewings yet.</p>
      ) : (
        <Table
          columns={[
            { id: "title", label: "Title", width: 20 },
            { id: "user", label: "User", width: 7 },
            { align: "right", id: "date", label: "Date", width: 10 },
          ]}
          data={viewings.map((viewing) => ({
            title: {
              href: routes.movies.show.href({ movieId: String(movie.id) }),
              text: movie.title,
            },
            user: VIEWING_USER_PLACEHOLDER,
            date: formatDate(viewing.date) ?? "\u2014",
          }))}
        />
      )}
    </section>
  );
}
