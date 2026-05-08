import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { db } from "./database.ts";
import { migrate } from "./migrate.ts";
import { movies, people, viewings } from "./schema.ts";

type SeedFile = {
  people: Array<{ name: string; tmdb_id: string | null }>;
  movies: Array<{
    title: string;
    release_date_ms: number | null;
    runtime: number | null;
    director_index: number | null;
    nationality: string | null;
    comments: string | null;
    tmdb_id: string | null;
  }>;
  viewings: Array<{
    movie_index: number;
    date_ms: number;
    notes: string | null;
  }>;
};

const seedPath = fileURLToPath(
  new URL("../../db/seed/watchlist-2010.json", import.meta.url),
);
const seed = JSON.parse(readFileSync(seedPath, "utf8")) as SeedFile;

async function main(): Promise<void> {
  await migrate();

  const [peopleCount, movieCount, viewingCount] = await Promise.all([
    db.count(people),
    db.count(movies),
    db.count(viewings),
  ]);

  if (peopleCount > 0 || movieCount > 0 || viewingCount > 0) {
    console.error(
      `Seed aborted: tables are not empty (people=${peopleCount}, movies=${movieCount}, viewings=${viewingCount}).`,
    );
    console.error(
      "Drop db/app.db (or clear those tables) before running `npm run seed`.",
    );
    process.exit(1);
  }

  const now = Date.now();

  const personIds: number[] = [];
  for (const p of seed.people) {
    const row = await db.create(
      people,
      { name: p.name, tmdb_id: p.tmdb_id, created_at: now },
      { returnRow: true },
    );
    personIds.push(row.id);
  }

  const movieIds: number[] = [];
  for (const m of seed.movies) {
    const directorId =
      m.director_index === null ? null : personIds[m.director_index];
    if (m.director_index !== null && directorId === undefined) {
      throw new Error(
        `Movie "${m.title}" references unknown director_index ${m.director_index}`,
      );
    }
    const row = await db.create(
      movies,
      {
        title: m.title,
        release_date: m.release_date_ms,
        runtime: m.runtime,
        director_id: directorId ?? null,
        nationality: m.nationality,
        comments: m.comments,
        tmdb_id: m.tmdb_id,
        recommended_by: null,
        recommend_comments: null,
        created_at: now,
      },
      { returnRow: true },
    );
    movieIds.push(row.id);
  }

  for (const v of seed.viewings) {
    const movieId = movieIds[v.movie_index];
    if (movieId === undefined) {
      throw new Error(
        `Viewing references unknown movie_index ${v.movie_index}`,
      );
    }
    await db.create(viewings, {
      movie_id: movieId,
      date: v.date_ms,
      notes: v.notes,
      created_at: now,
    });
  }

  console.log(
    `Seeded ${personIds.length} people, ${movieIds.length} movies, ${seed.viewings.length} viewings.`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
