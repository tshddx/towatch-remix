import { Database } from "remix/data-table";
import type { Controller } from "remix/fetch-router";
import { redirect } from "remix/response/redirect";
import { Session } from "remix/session";
import { css, Fragment, type RemixNode } from "remix/ui";

import { movies, people } from "../../data/schema.ts";
import type { AppContext } from "../../router.ts";
import { routes } from "../../routes.ts";
import { Heading } from "../../ui/heading.tsx";
import { Layout } from "../../ui/layout.tsx";
import { PaginationControls } from "../../ui/pagination-controls.tsx";
import { Table } from "../../ui/table.tsx";
import { loadCurrentUser, type CurrentUser } from "../../utils/current-user.ts";
import { formatYear } from "../../utils/date.ts";
import { parsePageParam, PAGE_SIZE } from "../../utils/pagination.ts";
import { render } from "../../utils/render.tsx";

interface PersonListRow {
  id: number;
  name: string;
}

interface PersonListPageProps {
  currentUser: CurrentUser | null;
  people: PersonListRow[];
  page: number;
  hasNextPage: boolean;
}

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
    async index({ get, request }) {
      let url = new URL(request.url);
      let parsed = parsePageParam(url);
      if (parsed.shouldStripPage) {
        return redirect(routes.people.index.href(), 303);
      }

      let db = get(Database);
      let [currentUser, rows] = await Promise.all([
        loadCurrentUser(db, get(Session)),
        loadPersonList(db, parsed.page),
      ]);

      let hasNextPage = rows.length > PAGE_SIZE;
      let pageRows = hasNextPage ? rows.slice(0, PAGE_SIZE) : rows;

      return render(
        <PersonListPage
          currentUser={currentUser}
          people={pageRows}
          page={parsed.page}
          hasNextPage={hasNextPage}
        />,
        request,
      );
    },

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
        <PersonDetailPage
          currentUser={currentUser}
          person={person}
          directed={directed}
        />,
        request,
      );
    },
  },
} satisfies Controller<typeof routes.people, AppContext>;

async function loadPersonList(
  db: Database,
  page: number,
): Promise<PersonListRow[]> {
  return await db
    .query(people)
    .select({
      id: "people.id",
      name: "people.name",
    })
    .orderBy("people.name", "asc")
    .orderBy("people.id", "asc")
    .limit(PAGE_SIZE + 1)
    .offset((page - 1) * PAGE_SIZE)
    .all();
}

async function loadPerson(
  db: Database,
  id: number,
): Promise<PersonDetail | null> {
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

async function loadDirected(
  db: Database,
  personId: number,
): Promise<DirectedMovie[]> {
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

function PersonListPage() {
  return ({
    currentUser,
    people: rows,
    page,
    hasNextPage,
  }: PersonListPageProps) => (
    <Layout title="People" currentUser={currentUser}>
      <div mix={css({ display: "flex", flexDirection: "column", gap: "1lh" })}>
        <Heading level={1}>People</Heading>
        {rows.length === 0 ? (
          <p mix={css({ margin: 0 })}>No people on this page.</p>
        ) : (
          <Table
            columns={[{ id: "name", label: "Name", width: 48 }]}
            data={rows.map((row) => ({
              name: {
                href: routes.people.show.href({ personId: String(row.id) }),
                text: row.name,
              },
            }))}
          />
        )}
        <PaginationControls
          basePath={routes.people.index.href()}
          page={page}
          hasNextPage={hasNextPage}
        />
      </div>
    </Layout>
  );
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

function DirectedTable() {
  return ({ directed }: { directed: DirectedMovie[] }) => (
    <section>
      <Heading level={2}>Movies Directed</Heading>
      {directed.length === 0 ? (
        <p mix={css({ margin: 0 })}>No movies.</p>
      ) : (
        <Table
          columns={[
            { id: "title", label: "Title", width: 43 },
            { align: "right", id: "year", label: "Year", width: 8 },
          ]}
          data={directed.map((movie) => ({
            title: {
              href: routes.movies.show.href({ movieId: String(movie.id) }),
              text: movie.title,
            },
            year: formatYear(movie.release_date) ?? "\u2014",
          }))}
        />
      )}
    </section>
  );
}
