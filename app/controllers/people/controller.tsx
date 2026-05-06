import { Database } from "remix/data-table";
import type { Controller } from "remix/fetch-router";
import { Session } from "remix/session";
import { css, Fragment, type RemixNode } from "remix/ui";

import { movies, people } from "../../data/schema.ts";
import type { AppContext } from "../../router.ts";
import { routes } from "../../routes.ts";
import { DataGrid, DataGridHeader } from "../../ui/data-grid.tsx";
import { Heading } from "../../ui/heading.tsx";
import { InlineLink } from "../../ui/inline-link.tsx";
import { Layout } from "../../ui/layout.tsx";
import { loadCurrentUser, type CurrentUser } from "../../utils/current-user.ts";
import { formatYear } from "../../utils/date.ts";
import { render } from "../../utils/render.tsx";

interface PersonDetail {
  id: number;
  name: string;
  tmdb_id: string | null;
}

interface DirectedMovie {
  id: number;
  title: string;
  release_date: number | null;
}

interface PersonDetailPageProps {
  currentUser: CurrentUser | null;
  person: PersonDetail;
  directed: DirectedMovie[];
}

export const personController = {
  actions: {
    async show({ get, request, params }) {
      let personId = Number(params.personId);
      if (!Number.isInteger(personId) || personId <= 0) {
        return new Response("Not Found", { status: 404 });
      }

      let db = get(Database);
      let [currentUser, person, directed] = await Promise.all([
        loadCurrentUser(db, get(Session)),
        loadPerson(db, personId),
        loadDirected(db, personId),
      ]);

      if (!person) return new Response("Not Found", { status: 404 });

      return render(
        <PersonDetailPage currentUser={currentUser} person={person} directed={directed} />,
        request,
      );
    },
  },
} satisfies Controller<typeof routes.people, AppContext>;

async function loadPerson(db: Database, id: number): Promise<PersonDetail | null> {
  let row = await db
    .query(people)
    .select({
      id: "people.id",
      name: "people.name",
      tmdb_id: "people.tmdb_id",
    })
    .where({ "people.id": id })
    .first();

  return row ?? null;
}

async function loadDirected(db: Database, personId: number): Promise<DirectedMovie[]> {
  return await db
    .query(movies)
    .select({
      id: "movies.id",
      title: "movies.title",
      release_date: "movies.release_date",
    })
    .where({ "movies.director_id": personId })
    .orderBy("movies.release_date", "desc")
    .orderBy("movies.title", "asc")
    .all();
}

function PersonDetailPage() {
  return ({ currentUser, person, directed }: PersonDetailPageProps) => (
    <Layout title={person.name} currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        <Heading level={1}>{person.name}</Heading>
        <PersonMetadataTable person={person} />
        <DirectedTable directed={directed} />
      </div>
    </Layout>
  );
}

function PersonMetadataTable() {
  return ({ person }: { person: PersonDetail }) => {
    let entries: Array<[string, RemixNode]> = [];
    if (person.tmdb_id) entries.push(["TMDB id", person.tmdb_id]);

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

function DirectedTable() {
  return ({ directed }: { directed: DirectedMovie[] }) => (
    <section mix={css({ display: "flex", flexDirection: "column", gap: "0.5lh" })}>
      <Heading level={2}>Movies directed</Heading>
      {directed.length === 0 ? (
        <p mix={css({ margin: 0 })}>No movies.</p>
      ) : (
        <DataGrid columns={2}>
          <DataGridHeader>
            <div>Movie</div>
            <div>Year</div>
          </DataGridHeader>
          {directed.map((movie) => (
            <DirectedRow key={movie.id} movie={movie} />
          ))}
        </DataGrid>
      )}
    </section>
  );
}

function DirectedRow() {
  return ({ movie }: { movie: DirectedMovie }) => (
    <>
      <div>
        <InlineLink href={routes.movies.show.href({ movieId: String(movie.id) })}>
          {movie.title}
        </InlineLink>
      </div>
      <div>{formatYear(movie.release_date) ?? "\u2014"}</div>
    </>
  );
}
