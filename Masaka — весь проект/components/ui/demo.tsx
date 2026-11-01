"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import SushiConveyorMenu from "@/components/ui/sushi-conveyor-menu";
import { MENU, SUSHI_BELT_LEGEND, RU_LABELS } from "@/lib/menu";

export const SUSHI_BELT_DISHES = MENU;
export { SUSHI_BELT_LEGEND };

/** Standalone Russian demo; the restaurant page connects onAdd to its full cart. */
export default function SushiConveyorMenuDemo({ autoplay = true }: { autoplay?: boolean }) {
  const [count, setCount] = React.useState(0);
  const [flash, setFlash] = React.useState(false);
  const timer = React.useRef(0);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const add = () => {
    setCount((n) => n + 1); setFlash(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(false), 2400);
  };
  return (
    <div data-sushi-demo className="relative flex min-h-svh w-full items-center justify-center bg-background text-foreground">
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <span aria-live="polite" className={`rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium text-background ${flash ? "opacity-100" : "opacity-0"}`}>{flash ? "Добавлено" : ""}</span>
        <span data-order-count aria-label={`Блюд в заказе: ${count}`} className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium">
          <ShoppingBag aria-hidden="true" className="size-4" /><span data-order-total>{count}</span>
        </span>
      </div>
      <SushiConveyorMenu items={SUSHI_BELT_DISHES} legend={SUSHI_BELT_LEGEND} labels={RU_LABELS}
        eyebrow="Masaka · Кайтэн-меню" heading="Ваше блюдо уже на ленте."
        caption="Наведите курсор, чтобы остановить ленту. Выберите тарелку, чтобы узнать состав."
        autoplay={autoplay} onAdd={add} />
    </div>
  );
}
