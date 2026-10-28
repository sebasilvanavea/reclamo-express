import { CopyButton } from "./CopyButton";

export function Carta({ asunto, carta, sello = "Borrador", children }: { asunto: string; carta: string; sello?: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col gap-3">
      <h3 className="label">La carta</h3>
      <div className="grid grid-cols-[minmax(0,1fr),auto] items-center gap-2">
        <code className="min-w-0 break-words rounded-md bg-marfil px-3 py-2 font-mono text-xs">{asunto}</code>
        <CopyButton text={asunto} label="Copiar asunto" />
      </div>
      <div className="relative pt-3">
        {/* El sello cuelga del borde superior, como un timbre real, y así no tapa la fecha en pantallas angostas */}
        <span className="pointer-events-none absolute right-3 top-0 z-10 rotate-[-6deg] rounded border-[1.5px] border-sello bg-paper/90 px-2 py-1 font-mono text-[10px] tracking-[.14em] text-sello/90">{sello.toUpperCase()}</span>
        <pre className="paper">{carta}</pre>
      </div>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={carta} label="Copiar carta" className="btn btn-sm" />
        {children}
      </div>
    </div>
  );
}
