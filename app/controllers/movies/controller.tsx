import { Database } from "remix/data-table";
import { eq } from "remix/data-table/operators";
import type { Controller } from "remix/fetch-router";
import { Session } from "remix/session";
import { css, Fragment, type RemixNode } from "remix/ui";

import { movies, people, viewings } from "../../data/schema.ts";
import type { AppContext } from "../../router.ts";
import { routes } from "../../routes.ts";
import { DataGrid, DataGridHeader } from "../../ui/data-grid.tsx";
import { Heading } from "../../ui/heading.tsx";
import { InlineLink } from "../../ui/inline-link.tsx";
import { Layout } from "../../ui/layout.tsx";
import { loadCurrentUser, type CurrentUser } from "../../utils/current-user.ts";
import { formatDate } from "../../utils/date.ts";
import { render } from "../../utils/render.tsx";

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
  id: number;
  date: number;
  notes: string | null;
}

interface MovieDetailPageProps {
  currentUser: CurrentUser | null;
  movie: MovieDetail;
  viewings: MovieViewing[];
}

export const movieController = {
  actions: {
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
        <MovieDetailPage currentUser={currentUser} movie={movie} viewings={movieViewings} />,
        request,
      );
    },
  },
} satisfies Controller<typeof routes.movies, AppContext>;

async function loadMovie(db: Database, id: number): Promise<MovieDetail | null> {
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

async function loadMovieViewings(db: Database, movieId: number): Promise<MovieViewing[]> {
  return await db
    .query(viewings)
    .select({
      id: "viewings.id",
      date: "viewings.date",
      notes: "viewings.notes",
    })
    .where({ "viewings.movie_id": movieId })
    .orderBy("viewings.date", "desc")
    .orderBy("viewings.id", "desc")
    .all();
}

function MovieDetailPage() {
  return ({ currentUser, movie, viewings }: MovieDetailPageProps) => (
    <Layout title={movie.title} currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        <Heading level={1}>{movie.title}</Heading>
        <MovieMetadataTable movie={movie} />
        <ViewingsTable viewings={viewings} />
      </div>
    </Layout>
  );
}

function MovieMetadataTable() {
  return ({ movie }: { movie: MovieDetail }) => {
    let entries: Array<[string, RemixNode]> = [];
    let releaseDate = formatDate(movie.release_date);
    if (releaseDate) entries.push(["Release date", releaseDate]);
    if (movie.runtime !== null) entries.push(["Runtime", `${movie.runtime} min`]);
    if (movie.director_id !== null && movie.director_name !== null) {
      entries.push([
        "Director",
        <InlineLink href={routes.people.show.href({ personId: String(movie.director_id) })}>
          {movie.director_name}
        </InlineLink>,
      ]);
    }
    if (movie.nationality) entries.push(["Nationality", movie.nationality]);
    if (movie.comments) entries.push(["Comments", movie.comments]);
    if (movie.recommended_by) entries.push(["Recommended by", movie.recommended_by]);
    if (movie.recommend_comments) {
      entries.push(["Recommend comments", movie.recommend_comments]);
    }
    if (movie.tmdb_id) entries.push(["TMDB id", movie.tmdb_id]);

    if (entries.length === 0) {
      return <p mix={css({ margin: 0 })}>No metadata.</p>;
    }

    return (
      <DataGrid columns={2}>
        {entries.map(([key, value]) => (
          <Fragment key={key}>
            <div>{key}</div>
            <div>{value}</div>
          </Fragment>
        ))}
      </DataGrid>
    );
  };
}

function ViewingsTable() {
  return ({ viewings }: { viewings: MovieViewing[] }) => (
    <section mix={css({ display: "flex", flexDirection: "column", gap: "0.5lh" })}>
      <Heading level={2}>Viewings</Heading>
      {viewings.length === 0 ? (
        <p mix={css({ margin: 0 })}>No viewings yet.</p>
      ) : (
        <DataGrid columns={2}>
          <DataGridHeader>
            <div>Date</div>
            <div>Notes</div>
          </DataGridHeader>
          {viewings.map((viewing) => (
            <ViewingRow key={viewing.id} viewing={viewing} />
          ))}
        </DataGrid>
      )}
    </section>
  );
}

function ViewingRow() {
  return ({ viewing }: { viewing: MovieViewing }) => (
    <>
      <div>{formatDate(viewing.date) ?? "\u2014"}</div>
      <div>{viewing.notes ?? "\u2014"}</div>
    </>
  );
}
