import { column as c, table } from "remix/data-table";
import type { TableRow } from "remix/data-table";

export const users = table({
  name: "users",
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    username: c.text().notNull(),
    username_lower: c.text().notNull().unique(),
    password_hash: c.text().notNull(),
    created_at: c.integer().notNull(),
  },
});

export type User = TableRow<typeof users>;

export const people = table({
  name: "people",
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    name: c.text().notNull(),
    tmdb_id: c.text().nullable(),
    created_at: c.integer().notNull(),
  },
});

export type Person = TableRow<typeof people>;

export const movies = table({
  name: "movies",
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    title: c.text().notNull(),
    release_date: c.integer().nullable(),
    runtime: c.integer().nullable(),
    director_id: c
      .integer()
      .nullable()
      .references("people", "movies_director_id_fk")
      .onDelete("restrict"),
    nationality: c.text().nullable(),
    comments: c.text().nullable(),
    tmdb_id: c.text().nullable(),
    recommended_by: c.text().nullable(),
    recommend_comments: c.text().nullable(),
    created_at: c.integer().notNull(),
  },
});

export type Movie = TableRow<typeof movies>;

export const viewings = table({
  name: "viewings",
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    movie_id: c
      .integer()
      .notNull()
      .references("movies", "viewings_movie_id_fk")
      .onDelete("restrict"),
    date: c.integer().notNull(),
    notes: c.text().nullable(),
    created_at: c.integer().notNull(),
  },
});

export type Viewing = TableRow<typeof viewings>;
