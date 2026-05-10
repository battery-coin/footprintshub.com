export function Timeline({
  items,
}: {
  items: Array<{
    title: string;
    detail: string;
  }>;
}) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li key={item.title} className="grid grid-cols-[28px_1fr] gap-3">
          <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
            {index + 1}
          </span>
          <span>
            <span className="block font-medium">{item.title}</span>
            <span className="mt-1 block text-sm leading-6 text-black/60">{item.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

