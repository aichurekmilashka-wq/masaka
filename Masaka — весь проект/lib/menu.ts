import type { ConveyorDish, SushiConveyorMenuLabels } from "@/components/ui/sushi-conveyor-menu";

export type MenuCategory = "Суши" | "Роллы" | "Закуски" | "Десерты";
export interface MenuDish extends ConveyorDish { amount: number; category: MenuCategory }

// Demonstration content adapted from the supplied component demo.
// Replace names, prices, ingredients and images with the restaurant's approved menu.
export const MENU: MenuDish[] = [
  { id: "salmon-nigiri", name: "Нигири с лососем", amount: 420, price: "420 сом", tier: 2, category: "Суши",
    description: "Лосось на рисе с лёгкой рисовой заправкой. Подаётся с маринованным имбирём.",
    details: ["2 штуки", "Рыба"],
    image: "https://cdn.21st.dev/assets/mirror/e2/e2e31360457e8c31fe830c89bb3e618ef982a6a04ba3f988b074abefad47ab4d.webp" },
  { id: "tuna-nigiri", name: "Нигири с тунцом", amount: 680, price: "680 сом", tier: 4, category: "Суши",
    description: "Красный тунец на рисе. Чистый вкус в лаконичной подаче.", details: ["2 штуки", "Рыба"],
    image: "https://cdn.21st.dev/assets/mirror/dc/dc231956590214c669df43d2a95134c610bc01c4c8d5d245393fd48febc7b85d.webp" },
  { id: "ebi-nigiri", name: "Нигири с креветкой", amount: 420, price: "420 сом", tier: 2, category: "Суши",
    description: "Нежная креветка, рис и ничего лишнего.", details: ["2 штуки", "Ракообразные"],
    image: "https://cdn.21st.dev/assets/mirror/ed/ed19038aa3d0ffb2b16e8daa4b21968e16038e1638446a55c90551e1e16b6b9f.webp" },
  { id: "california-roll", name: "Калифорния", amount: 540, price: "540 сом", tier: 3, category: "Роллы",
    description: "Краб, авокадо и огурец под яркой икрой тобико.", details: ["4 штуки", "Ракообразные", "Икра рыбы"],
    image: "https://cdn.21st.dev/assets/mirror/7a/7a57f85603a9a61497066e45bf6fbfb10dbf7b9369f83469221eb0e9ee9fd899.webp" },
  { id: "dragon-roll", name: "Зелёный дракон", amount: 850, price: "850 сом", tier: 5, category: "Роллы",
    description: "Креветка темпура под лепестками авокадо и соусом унаги.", details: ["4 штуки", "Ракообразные", "Пшеница"],
    image: "https://cdn.21st.dev/assets/mirror/81/816eddcbedeb62d59f7102783e13afd81ce1207e8180a9a83cde396a2d95f5f7.webp" },
  { id: "tamago", name: "Тамаго", amount: 320, price: "320 сом", tier: 1, category: "Суши",
    description: "Сладковатый японский омлет на рисе с тонкой лентой нори.", details: ["2 штуки", "Яйцо"],
    image: "https://cdn.21st.dev/assets/mirror/2f/2fb834a44e170a6b2919da6441a7d8239b68a5f96782a3d032a031f78b96adb4.webp" },
  { id: "edamame", name: "Эдамаме с солью", amount: 320, price: "320 сом", tier: 1, category: "Закуски",
    description: "Соевые бобы на пару с хлопьями морской соли.", details: ["1 порция", "Соя", "Растительное блюдо"],
    image: "https://cdn.21st.dev/assets/mirror/12/1251847fad8f7d9288ff7f91954c54db0ef314f53dde2245bfc39497ee16fb42.webp" },
  { id: "mochi", name: "Моти с мороженым", amount: 540, price: "540 сом", tier: 3, category: "Десерты",
    description: "Рисовый десерт с мороженым: матча и клубника.", details: ["2 штуки", "Молоко"],
    image: "https://cdn.21st.dev/assets/mirror/5c/5cbcce544cf25127b238252e69d6ea879115e85ae61b9a47231ebeb0719c51b5.webp" },
];

export const SUSHI_BELT_LEGEND = { 1: "320 сом", 2: "420 сом", 3: "540 сом", 4: "680 сом", 5: "850 сом" };
export const RU_LABELS: SushiConveyorMenuLabels = {
  add: "В корзину", close: "Закрыть", previous: "Предыдущее блюдо", next: "Следующее блюдо", pause: "Приостановить ленту",
};
export const RESTAURANT_MAP_URL = "https://yandex.ru/maps/-/CXfHRQ9A";
export const RESTAURANT = {
  name: "Masaka", city: "Бишкек", address: "ул. Тоголок Молдо, 22",
  phone: "+996 707 77 77 47", phoneHref: "tel:+996707777747",
};
export const formatPrice = (amount: number) => `${new Intl.NumberFormat("ru-KG", { maximumFractionDigits: 0 }).format(amount)} сом`;
