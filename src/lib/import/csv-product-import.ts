export type CsvProductRow = Record<string, string>;

export function parseCsvProducts(csv: string) {
  const rows = parseCsv(csv.trim());

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());

  return rows.slice(1).map((row) =>
    headers.reduce<CsvProductRow>((record, header, index) => {
      record[header] = row[index]?.trim() ?? "";
      return record;
    }, {}),
  );
}

function parseCsv(input: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current);
  rows.push(row);

  return rows.filter((cells) => cells.some((cell) => cell.trim()));
}
