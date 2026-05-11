import * as assert from "remix/assert";
import { describe, it } from "node:test";
import { jsx } from "remix/ui/jsx-runtime";
import { renderToString } from "remix/ui/server";

import { Table, type Column, type TableCell } from "./table.tsx";

const columns: Column[] = [
  {
    id: "title",
    label: "Title",
    width: 24,
  },
  {
    id: "director",
    label: "Director",
    width: 23,
  },
];

const data: Array<Record<string, TableCell>> = [
  {
    title: {
      href: "/movies/4",
      text: "Sweet Smell of Success",
    },
    director: {
      href: "/people/3",
      text: "Alexander Mackendrick",
    },
  },
  {
    title: {
      href: "/movies/56",
      text: "Sweet and Lowdown",
    },
    director: {
      href: "/people/2",
      text: "Woody Allen",
    },
  },
  {
    title: {
      href: "/movies/43",
      text: "The Brothers Bloom",
    },
    director: {
      href: "/people/23",
      text: "Rian Johnson",
    },
  },
  {
    title: {
      href: "/movies/39",
      text: "The Cable Guy",
    },
    director: {
      href: "/people/20",
      text: "Ben Stiller",
    },
  },
  {
    title: {
      href: "/movies/44",
      text: "The Darjeeling Limited",
    },
    director: {
      href: "/people/1",
      text: "Wes Anderson",
    },
  },
  {
    title: {
      href: "/movies/35",
      text: "The End of Summer",
    },
    director: {
      href: "/people/16",
      text: "Yasujirô Ozu",
    },
  },
  {
    title: {
      href: "/movies/37",
      text: "The Fog of War: Eleven Lessons from the Life of Robert S. McNamara",
    },
    director: {
      href: "/people/18",
      text: "Errol Morris",
    },
  },
  {
    title: {
      href: "/movies/97",
      text: "The Ghost Writer",
    },
    director: {
      href: "/people/58",
      text: "Roman Polanski",
    },
  },
  {
    title: {
      href: "/movies/91",
      text: "The Girl Next Door",
    },
    director: {
      href: "/people/52",
      text: "Luke Greenfield",
    },
  },
  {
    title: {
      href: "/movies/38",
      text: "The Girlfriend Experience",
    },
    director: {
      href: "/people/19",
      text: "Steven Soderbergh",
    },
  },
  {
    title: {
      href: "/movies/23",
      text: "The Hangover",
    },
    director: {
      href: "/people/12",
      text: "Todd Phillips",
    },
  },
  {
    title: {
      href: "/movies/63",
      text: "The Hurt Locker",
    },
    director: {
      href: "/people/30",
      text: "Kathryn Bigelow",
    },
  },
  {
    title: {
      href: "/movies/83",
      text: "The Informant!",
    },
    director: {
      href: "/people/19",
      text: "Steven Soderbergh",
    },
  },
  {
    title: {
      href: "/movies/100",
      text: "The Interpreter",
    },
    director: {
      href: "/people/60",
      text: "Sydney Pollack",
    },
  },
  {
    title: {
      href: "/movies/20",
      text: "The Match Factory Girl",
    },
    director: {
      href: "/people/8",
      text: "Aki Kaurismäki",
    },
  },
  {
    title: {
      href: "/movies/21",
      text: "The Nines",
    },
    director: {
      href: "/people/11",
      text: "John August",
    },
  },
  {
    title: {
      href: "/movies/22",
      text: "The Purple Rose of Cairo",
    },
    director: {
      href: "/people/2",
      text: "Woody Allen",
    },
  },
  {
    title: {
      href: "/movies/8",
      text: "The Royal Tenenbaums",
    },
    director: {
      href: "/people/1",
      text: "Wes Anderson",
    },
  },
  {
    title: {
      href: "/movies/46",
      text: "The Seventh Seal",
    },
    director: {
      href: "/people/13",
      text: "Ingmar Bergman",
    },
  },
  {
    title: {
      href: "/movies/104",
      text: "The Social Network",
    },
    director: {
      href: "/people/64",
      text: "David Fincher",
    },
  },
];

void describe("Table monospace layout", () => {
  void it("pads and truncates linked movie rows to the computed column widths", async () => {
    let html = await renderToString(jsx(Table, { columns, data }));
    let tableText = getRenderedTableText(html);

    assert.equal(
      tableText,
      [
        `Title${"\u00A0".repeat(22)}`,
        "Director",
        "Sweet Smell of Success.....",
        "Alexander Mackendrick",
        "Sweet and Lowdown..........",
        "Woody Allen",
        "The Brothers Bloom.........",
        "Rian Johnson",
        "The Cable Guy..............",
        "Ben Stiller",
        "The Darjeeling Limited.....",
        "Wes Anderson",
        "The End of Summer..........",
        "Yasujirô Ozu",
        "The Fog of War: Eleven Le….",
        "Errol Morris",
        "The Ghost Writer...........",
        "Roman Polanski",
        "The Girl Next Door.........",
        "Luke Greenfield",
        "The Girlfriend Experience..",
        "Steven Soderbergh",
        "The Hangover...............",
        "Todd Phillips",
        "The Hurt Locker............",
        "Kathryn Bigelow",
        "The Informant!.............",
        "Steven Soderbergh",
        "The Interpreter............",
        "Sydney Pollack",
        "The Match Factory Girl.....",
        "Aki Kaurismäki",
        "The Nines..................",
        "John August",
        "The Purple Rose of Cairo...",
        "Woody Allen",
        "The Royal Tenenbaums.......",
        "Wes Anderson",
        "The Seventh Seal...........",
        "Ingmar Bergman",
        "The Social Network.........",
        "David Fincher",
      ].join(""),
    );

    assert.deepEqual(
      [...html.matchAll(/<a href="([^"]+)"/g)].map((match) => match[1]),
      data.flatMap((row) => [
        (row.title as { href: string }).href,
        (row.director as { href: string }).href,
      ]),
    );
  });
});

function getRenderedTableText(html: string): string {
  let tableStart = html.indexOf("-->") + "-->".length;
  let tableEnd = html.indexOf("<!-- /rmx:h -->");
  return html.slice(tableStart, tableEnd).replace(/<[^>]*>/g, "");
}
