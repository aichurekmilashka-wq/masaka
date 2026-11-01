"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy, MapPin, Minus, Phone, Plus, ShoppingBag, X } from "lucide-react";
import SushiConveyorMenu from "@/components/ui/sushi-conveyor-menu";
import type { ConveyorDish } from "@/components/ui/sushi-conveyor-menu";
import { MENU, RU_LABELS, SUSHI_BELT_LEGEND, RESTAURANT, RESTAURANT_MAP_URL, formatPrice, type MenuCategory } from "@/lib/menu";
import { addDish, changeQuantity, orderSummary, restoreCart } from "@/lib/cart.mjs";

type CartRow = { id: string; quantity: number };
const CATEGORIES: (MenuCategory | "Всё меню")[] = ["Всё меню", "Суши", "Роллы", "Закуски", "Десерты"];
const STORAGE_KEY = "masaka-demo-cart-v1";

function FoodPhoto({ src, name, lazy = true }: { src: string; name: string; lazy?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="food-fallback"><ShoppingBag aria-hidden="true" /><span>{name}</span></div>
    : <img src={src} alt={name} loading={lazy ? "lazy" : "eager"} decoding="async" onError={() => setFailed(true)} />;
}

function Wordmark() {
  return <span className="wordmark">masaka<span aria-hidden="true">.</span></span>;
}

export default function App() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Всё меню");
  const [cart, setCart] = useState<CartRow[]>(() => {
    try { return restoreCart(localStorage.getItem(STORAGE_KEY), MENU); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef(0);
  const { count, total } = orderSummary(cart, MENU);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* Cart still works when storage is disabled. */ }
  }, [cart]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const add = (dish: ConveyorDish) => {
    setCart((old) => addDish(old, dish.id));
    setToast(`${dish.name} — в корзине`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <>
      <a className="skip-link" href="#menu">Перейти к меню</a>
      <header className="site-header wrap">
        <a href="#home" aria-label="Masaka — на главную" className="brand"><Wordmark /><span>японская кухня</span></a>
        <nav aria-label="Основная навигация"><a href="#menu">Меню</a><a href="#about">О Masaka</a><a href="#contacts">Контакты</a></nav>
        <button type="button" className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Открыть корзину. Блюд: ${count}`}>
          <ShoppingBag size={17} aria-hidden="true" /><span>Мой заказ</span><b>{count}</b>
        </button>
      </header>

      <main id="home">
        <section className="hero wrap" aria-labelledby="hero-heading">
          <div className="hero-meta"><span><i /> Бишкек · Тоголок Молдо, 22</span><span className="hero-japanese" lang="ja" aria-hidden="true">いただきます</span></div>
          <div className="hero-intro">
            <div className="hero-title"><p className="eyebrow">Знакомое место. Новые вкусы.</p><h1 id="hero-heading">Маленькая Япония.<br /><em>Большой вкус.</em></h1></div>
            <div className="hero-aside"><p>Немного риса. Немного моря.<br />И ещё один повод<br />собраться вместе.</p><a href="#menu" className="text-link">Выбрать любимое <ArrowDown size={16} aria-hidden="true" /></a></div>
          </div>
          <div className="hero-rule"><span>Суши / Роллы / Ещё кое-что вкусное</span><span>Листайте. Пробуйте. Влюбляйтесь.</span></div>
        </section>

        <section className="conveyor-wrap" aria-label="Интерактивное меню">
          <SushiConveyorMenu className="masaka-conveyor" items={MENU} labels={RU_LABELS} legend={SUSHI_BELT_LEGEND}
            eyebrow="Кайтэн · Вкус в движении" heading="Ваше блюдо уже на ленте."
            caption="Остановите ленту наведением или перетащите её. Нажмите на тарелку, чтобы узнать состав."
            speed={22} autoplay interval={4200} onAdd={add}
            action={<a href="#menu" className="button button-red">Открыть всё меню <ArrowUpRight size={16} aria-hidden="true" /></a>} />
          <div className="belt-note wrap"><span><span className="tiny-circle" /> Выберите свою тарелку</span><span>Можно крутить пальцем или мышью <span aria-hidden="true">↔</span></span></div>
        </section>

        <section id="menu" className="menu-section wrap" aria-labelledby="menu-heading">
          <div className="section-heading"><div><p className="eyebrow">Каждому — своё любимое</p><h2 id="menu-heading">Что вам <em>по вкусу?</em></h2></div><span className="section-number" aria-hidden="true">01 / Меню</span></div>
          <div className="demo-notice"><span className="tiny-circle" />Пример меню: блюда, состав и цены показаны для демонстрации. Актуальное меню уточняйте в Masaka.</div>
          <div className="category-list" role="group" aria-label="Категории меню">{CATEGORIES.map((tab) => <button key={tab} type="button" aria-pressed={category === tab} onClick={() => setCategory(tab)}>{tab}{tab === "Всё меню" && <span>{MENU.length.toString().padStart(2, "0")}</span>}</button>)}</div>
          <div className="dish-grid">{MENU.filter((dish) => category === "Всё меню" || dish.category === category).map((dish) => {
            const quantity = cart.find((row) => row.id === dish.id)?.quantity ?? 0;
            return <article key={dish.id} className="dish-card">
              <div className="dish-photo"><span className="dish-category">{dish.category}</span><FoodPhoto src={dish.image} name={dish.name} /></div>
              <div className="dish-content"><div className="dish-title-row"><h3>{dish.name}</h3><span>{dish.details?.[0]}</span></div><p>{dish.description}</p>
                <div className="dish-bottom"><strong>{dish.price}</strong>{quantity ? <div className="quantity-control">
                  <button type="button" aria-label={`Убрать одну порцию: ${dish.name}`} onClick={() => setCart((old) => changeQuantity(old, dish.id, -1))}><Minus size={14} aria-hidden="true" /></button>
                  <span aria-label={`Порций: ${quantity}`}>{quantity}</span><button type="button" aria-label={`Добавить порцию: ${dish.name}`} disabled={quantity >= 99} onClick={() => add(dish)}><Plus size={14} aria-hidden="true" /></button>
                </div> : <button type="button" className="dish-add" onClick={() => add(dish)} aria-label={`В корзину: ${dish.name}`}><Plus size={17} aria-hidden="true" /></button>}</div>
              </div>
            </article>;
          })}</div>
        </section>

        <section id="about" className="about-section" aria-labelledby="about-heading"><div className="wrap about-grid">
          <div><p className="eyebrow">Masaka / Бишкек</p><h2 id="about-heading">За одним столом<br /><em>вкуснее.</em></h2><p className="about-copy">Встреча с друзьями, пауза среди рабочего дня или вечер вдвоём. Для любимой японской кухни не нужен особый повод — только хорошая компания.</p><a href={RESTAURANT_MAP_URL} target="_blank" rel="noreferrer" className="text-link">Встретимся в Masaka <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          <div className="about-art"><span className="about-art-caption">Маленькие радости / 大きな喜び</span><div className="about-sun" aria-hidden="true" /><FoodPhoto src={MENU[4].image} name="Роллы с авокадо — пример подачи" /><span className="about-art-bottom">rice. fish. love.</span></div>
        </div></section>

        <section id="contacts" className="contacts-section wrap" aria-labelledby="contacts-heading"><div className="section-heading"><div><p className="eyebrow">Ваш столик — здесь</p><h2 id="contacts-heading">Загляните <em>к нам.</em></h2></div><span className="section-number" aria-hidden="true">02 / Контакты</span></div>
          <div className="contact-grid"><a className="location-card" href={RESTAURANT_MAP_URL} target="_blank" rel="noreferrer"><div className="location-art" aria-hidden="true"><div className="map-street s1" /><div className="map-street s2" /><div className="map-street s3" /><div className="map-block b1" /><div className="map-block b2" /><div className="map-block b3" /><div className="map-pin"><MapPin size={22} /></div><span className="map-city">БИШКЕК</span></div><div className="location-info"><div><span>Masaka · Суши-бар</span><h3>{RESTAURANT.address}</h3><p>{RESTAURANT.city}</p></div><ArrowUpRight size={24} aria-hidden="true" /></div><span className="map-caption">Построить маршрут в Яндекс Картах</span></a>
            <div className="contact-details"><p className="eyebrow">Давайте созвонимся</p><a className="phone-link" href={RESTAURANT.phoneHref}>{RESTAURANT.phone}</a><p>Уточнить меню, часы работы<br />и возможность бронирования.</p><a className="button button-red" href={RESTAURANT.phoneHref}><Phone size={16} aria-hidden="true" /> Позвонить в Masaka</a><div className="contact-footnote"><span className="tiny-circle" /><span>Бишкек, ул. Тоголок Молдо, 22</span></div></div>
          </div>
        </section>
      </main>

      <footer className="site-footer wrap"><a href="#home" aria-label="Masaka — наверх"><Wordmark /></a><span>Маленькая Япония. Большой вкус.</span><a href={RESTAURANT_MAP_URL} target="_blank" rel="noreferrer">Мы на карте <ArrowUpRight size={14} aria-hidden="true" /></a></footer>
      <div className={`toast ${toast ? "toast-visible" : ""}`} role="status" aria-live="polite">{toast && <><Check size={16} aria-hidden="true" />{toast}</>}</div>
      {count > 0 && <button className="mobile-cart" type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} aria-hidden="true" /><span>Мой заказ · {count}</span><strong>{formatPrice(total)}</strong><ArrowUpRight size={16} aria-hidden="true" /></button>}
      <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onChange={(id, delta) => setCart((old) => changeQuantity(old, id, delta))} />
    </>
  );
}

function CartDialog({ open, onClose, cart, onChange }: { open: boolean; onClose: () => void; cart: CartRow[]; onChange: (id: string, delta: number) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const { count, total } = orderSummary(cart, MENU);
  const text = `Masaka — список блюд (демонстрационное меню)\n${cart.map((row) => {
    const dish = MENU.find((item) => item.id === row.id)!;
    return `${dish.name} × ${row.quantity} — ${formatPrice(dish.amount * row.quantity)}`;
  }).join("\n")}\nВсего: ${formatPrice(total)}\nНаличие и цены нужно уточнить в ресторане.`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);
  useEffect(() => { setCopyState("idle"); }, [cart, open]);
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopyState("copied"); }
    catch { setCopyState("manual"); }
  };
  return <dialog ref={dialogRef} className="cart-dialog" aria-labelledby="cart-heading" onCancel={onClose} onClose={onClose} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <div className="cart-heading"><div><p className="eyebrow">Masaka / Ваш выбор</p><h2 id="cart-heading">Мой заказ <span>{count.toString().padStart(2, "0")}</span></h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Закрыть корзину" autoFocus><X size={20} aria-hidden="true" /></button></div>
    {cart.length ? <><div className="cart-rows">{cart.map((row) => { const dish = MENU.find((item) => item.id === row.id)!; return <div className="cart-row" key={row.id}><div className="cart-thumb"><FoodPhoto src={dish.image} name={dish.name} /></div><div><h3>{dish.name}</h3><p>{formatPrice(dish.amount)}</p><div className="quantity-control"><button type="button" onClick={() => onChange(row.id, -1)} aria-label={`Убрать порцию: ${dish.name}`}><Minus size={14} aria-hidden="true" /></button><span>{row.quantity}</span><button type="button" onClick={() => onChange(row.id, 1)} disabled={row.quantity >= 99} aria-label={`Добавить порцию: ${dish.name}`}><Plus size={14} aria-hidden="true" /></button></div></div><strong>{formatPrice(dish.amount * row.quantity)}</strong></div>; })}</div><div className="cart-total"><span>Предварительно</span><strong>{formatPrice(total)}</strong></div><p className="cart-note">Демонстрационное меню. Список сохраняется только у вас; заказ в ресторан не отправляется. Уточните наличие и цены по телефону.</p><button type="button" className="button button-outline cart-copy" onClick={copy}>{copyState === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copyState === "copied" ? "Список скопирован" : "Скопировать список блюд"}</button><div role="status">{copyState === "manual" && <><p className="cart-note">Выделите и скопируйте список:</p><textarea className="manual-copy" value={text} readOnly aria-label="Список блюд для копирования" onFocus={(event) => event.target.select()} /></>}</div><a className="button button-red cart-call" href={RESTAURANT.phoneHref}><Phone size={16} aria-hidden="true" />Уточнить заказ по телефону</a></>
      : <div className="cart-empty"><ShoppingBag size={38} strokeWidth={1.1} aria-hidden="true" /><h3>Здесь будет что-то вкусное.</h3><p>Выберите блюдо на ленте<br />или загляните в меню.</p><button type="button" className="button button-red" onClick={onClose}>Вернуться к меню <ArrowUpRight size={16} aria-hidden="true" /></button></div>}
  </dialog>;
}
