export function Accordion({
  items,
}: {
  items: Array<{
    title: string;
    body: React.ReactNode;
  }>;
}) {
  return (
    <div className="divide-y divide-black/10 rounded-lg border border-black/10 bg-white">
      {items.map((item) => (
        <details key={item.title} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
            {item.title}
            <span className="text-xl leading-none text-black/40 group-open:rotate-45">+</span>
          </summary>
          <div className="mt-3 text-sm leading-6 text-black/62">{item.body}</div>
        </details>
      ))}
    </div>
  );
}

