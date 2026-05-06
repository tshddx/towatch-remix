import { createMigration } from "remix/data-table/migrations";

import { movies, people, viewings } from "../../app/data/schema.ts";

export default createMigration({
  async up({ schema }) {
    await schema.createTable(people);
    await schema.createIndex(people, "tmdb_id", {
      name: "people_tmdb_id_idx",
    });

    await schema.createTable(movies);
    await schema.createIndex(movies, "tmdb_id", {
      name: "movies_tmdb_id_idx",
    });
    await schema.createIndex(movies, "director_id", {
      name: "movies_director_id_idx",
    });

    await schema.createTable(viewings);
    await schema.createIndex(viewings, "movie_id", {
      name: "viewings_movie_id_idx",
    });
    await schema.createIndex(viewings, "date", {
      name: "viewings_date_idx",
    });
  },

  async down({ schema }) {
    await schema.dropTable("viewings");
    await schema.dropTable("movies");
    await schema.dropTable("people");
  },
});
