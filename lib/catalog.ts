// Server-safe product catalog + category data and helpers.
//
// This module has NO "use client" directive, so it can be imported from both
// Server Components (route metadata, sitemap) and Client Components. It is the
// single source of truth for the bundled fallback catalog and for slugs used
// in product URLs (/product/[slug]).
//
// NOTE: prices are intentionally set to 0 ("price on request") until the
// official price list is provided. Use `formatPrice()` to render them.

export type Language = "ua" | "ru" | "en"

/** A single selectable value inside a variant group (e.g. "15 mm" or "Olive Green"). */
export interface ProductVariantOption {
  /** Stable id used in cart keys and order payloads. Never localized. */
  id: string
  labelUa: string
  labelRu: string
  labelEn: string
}

/** A group of mutually-exclusive options the customer must choose from. */
export interface ProductVariantGroup {
  /** Stable id, e.g. "color" or "thickness". Never localized. */
  id: string
  labelUa: string
  labelRu: string
  labelEn: string
  options: ProductVariantOption[]
}

/**
 * A customer's chosen value for one variant group. Labels are embedded so the
 * cart, checkout, email and order backup can render the selection without
 * re-reading the catalog (robust against future catalog edits).
 */
export interface SelectedVariant {
  groupId: string
  groupLabelUa: string
  groupLabelRu: string
  groupLabelEn: string
  optionId: string
  optionLabelUa: string
  optionLabelRu: string
  optionLabelEn: string
}

export interface Product {
  id: string
  /** URL slug used by /product/[slug]. Stable, human-readable product code. */
  slug: string
  name: string
  nameUa: string
  nameRu: string
  price: number
  originalPrice?: number
  category: string
  categoryUa: string
  categoryRu: string
  description: string
  descriptionUa: string
  descriptionRu: string
  specifications: Record<string, string>
  specificationsUa: Record<string, string>
  specificationsRu: Record<string, string>
  images: string[]
  isNew?: boolean
  inStock: boolean
  /** Optional selectable variants (color, thickness, ...). */
  variants?: ProductVariantGroup[]
  /**
   * Optional per-variant image sets, keyed by a variant OPTION id
   * (e.g. "pixel", "olive-green"). When the customer selects an option whose id
   * appears here, the product gallery switches to that image set. Options
   * without an entry fall back to `images`. Only add an entry when a genuinely
   * matching photo exists — never map an option to an unrelated photo.
   */
  variantImages?: Record<string, string[]>
}

export interface Category {
  id: string
  name: string
  nameUa: string
  nameRu: string
  image: string
}

const CATEGORY_ROLL = {
  category: "roll-mats",
  categoryUa: "Каремати рулонні Army",
  categoryRu: "Карематы рулонные Army",
}
const CATEGORY_FOLDING = {
  category: "folding-mats",
  categoryUa: "Каремати та матраци розкладні Army",
  categoryRu: "Карематы и матрацы раскладные Army",
}
const CATEGORY_SEATS = {
  category: "field-seats",
  categoryUa: "Сидіння польові Army",
  categoryRu: "Сиденья полевые Army",
}

// Fallback images (used only for products that don't yet have real photos uploaded).
const SEAT_IMAGES = ["/images/categories/sidinnia-polovi.jpg", "/images/products/army-l0-outdoor.jpg"]

/* ----------------------------- Real product photos ----------------------------- */
// Real photos live under public/images/products-real/<folder>/ as main.webp +
// gallery-N.webp. Each folder maps to a specific product model. `main.webp` is the
// primary preview; gallery images follow.
const REAL = (folder: string, galleryCount: number): string[] => {
  const base = `/images/products-real/${folder}`
  const imgs = [`${base}/main.webp`]
  for (let i = 1; i <= galleryCount; i++) imgs.push(`${base}/gallery-${i}.webp`)
  return imgs
}

// Optimized preview/main image that takes priority as the first (preview) image.
// The original main.webp + gallery follow it, so galleries stay intact.
const REAL_WITH_PREVIEW = (folder: string, previewFile: string, galleryCount: number): string[] => [
  `/images/products-real/${folder}/${previewFile}`,
  ...REAL(folder, galleryCount),
]

const REAL_ARMY_L0_TOURIST = REAL_WITH_PREVIEW("army-l0-tourist", "preview-00131.webp", 4)
const REAL_ARMY_L1_STANDARD = REAL_WITH_PREVIEW("army-l1-standard", "preview-00114.webp", 4)
const REAL_ARMY_L1_TACTICAL = REAL_WITH_PREVIEW("army-l1-tactical", "preview-00042.webp", 4)
const REAL_ARMY_L1_COVER = REAL_WITH_PREVIEW("army-l1-cover", "preview-00084.webp", 4)
const REAL_GYM_MAT_L0 = REAL("gym-mat-l0", 4)
const REAL_FOLDING_MAT_COVER = REAL("folding-mat-cover", 3)
const REAL_FIELD_FOLDING_MATTRESS = REAL("field-folding-mattress", 4)
const REAL_FIELD_SEAT_2X = REAL("field-seat-2x-folding", 4)
const REAL_FIELD_SEAT_MOLLE = REAL("field-seat-molle", 2)

/* ------------------------ Per-variant photo galleries ------------------------ */
// Dedicated, color/cover-specific photo sets for the "Каремати рулонні Army"
// roll mats. These are real studio/field photos sorted by the actual colorway
// (Black / Olive Green) or cover (Multicam / Pixel) shown in each shot, so the
// product gallery shows ONLY the photos that match the selected variant.
const VG = (folder: string, group: string, files: string[]): string[] =>
  files.map((f) => `/images/products-real/${folder}/variant-galleries/${group}/${f}`)

// Army L1, standard attachment — Black vs Olive Green
const VG_L1_STD_BLACK = VG("army-l1-standard", "black", ["photo-00019.jpg", "photo-00102.jpg"])
const VG_L1_STD_OLIVE = VG("army-l1-standard", "olive-green", ["photo-00108.jpg", "photo-00109.jpg"])
// Army L1, tactical attachment — Black vs Olive Green
const VG_L1_TAC_BLACK = VG("army-l1-tactical", "black", ["photo-00118.jpg"])
const VG_L1_TAC_OLIVE = VG("army-l1-tactical", "olive-green", [
  "photo-00035.jpg",
  "photo-00121.jpg",
  "photo-00122.jpg",
])
// Army L1 in baul cover — Multicam vs Pixel
const VG_L1_COVER_MULTICAM = VG("army-l1-cover", "multicam", ["photo-00081.jpg", "photo-00082.jpg"])
const VG_L1_COVER_PIXEL = VG("army-l1-cover", "pixel", ["photo-00148.jpg", "photo-00150.jpg"])
// Tourist Army L0 — single Black colorway gallery (appended after preview/main).
const VG_L0_TOURIST_BLACK = VG("army-l0-tourist", "black", [
  "photo-00045.jpg",
  "photo-00128.jpg",
  "photo-00130.jpg",
  "photo-00133.jpg",
])

/* --------------------------- Variant definitions --------------------------- */
// Reusable variant groups shared by several products. Option ids are stable and
// language-independent so they can be safely persisted in cart/orders.

const VARIANT_COLOR_BLACK_OLIVE: ProductVariantGroup = {
  id: "color",
  labelUa: "Колір",
  labelRu: "Цвет",
  labelEn: "Color",
  options: [
    { id: "black", labelUa: "Чорний", labelRu: "Чёрный", labelEn: "Black" },
    { id: "olive-green", labelUa: "Olive Green", labelRu: "Olive Green", labelEn: "Olive Green" },
  ],
}

const VARIANT_THICKNESS_12_15: ProductVariantGroup = {
  id: "thickness",
  labelUa: "Товщина",
  labelRu: "Толщина",
  labelEn: "Thickness",
  options: [
    { id: "12mm", labelUa: "12 мм", labelRu: "12 мм", labelEn: "12 mm" },
    { id: "15mm", labelUa: "15 мм", labelRu: "15 мм", labelEn: "15 mm" },
  ],
}

// Rug color choice specific to the baul-cover product (thickness is fixed at 15 mm there).
const VARIANT_RUG_COLOR_BLACK_OLIVE: ProductVariantGroup = {
  id: "rug-color",
  labelUa: "Колір килима",
  labelRu: "Цвет коврика",
  labelEn: "Mat color",
  options: [
    { id: "black", labelUa: "Чорний", labelRu: "Чёрный", labelEn: "Black" },
    { id: "olive-green", labelUa: "Olive Green", labelRu: "Olive Green", labelEn: "Olive Green" },
  ],
}

// Cover (chohol) choice for the baul-cover product.
const VARIANT_COVER_MULTICAM_PIXEL: ProductVariantGroup = {
  id: "cover",
  labelUa: "Чохол",
  labelRu: "Чехол",
  labelEn: "Cover",
  options: [
    { id: "multicam", labelUa: "Мультикам", labelRu: "Мультикам", labelEn: "Multicam" },
    { id: "pixel", labelUa: "Піксель", labelRu: "Пиксель", labelEn: "Pixel" },
  ],
}

// Cover (chohol) choice for field seats. Option order follows the seat product
// names ("Піксель, Мультикам"), so Pixel is listed first here.
const VARIANT_COVER_PIXEL_MULTICAM: ProductVariantGroup = {
  id: "cover",
  labelUa: "Чохол",
  labelRu: "Чехол",
  labelEn: "Cover",
  options: [
    { id: "pixel", labelUa: "Піксель", labelRu: "Пиксель", labelEn: "Pixel" },
    { id: "multicam", labelUa: "Мультикам", labelRu: "Мультикам", labelEn: "Multicam" },
  ],
}

const VARIANT_GYM_COLOR: ProductVariantGroup = {
  id: "color",
  labelUa: "Колір",
  labelRu: "Цвет",
  labelEn: "Color",
  options: [
    { id: "yellow-blue", labelUa: "Жовто-синій", labelRu: "Жёлто-синий", labelEn: "Yellow-Blue" },
    { id: "yellow-red", labelUa: "Жовто-червоний", labelRu: "Жёлто-красный", labelEn: "Yellow-Red" },
    { id: "red-green", labelUa: "Червоно-зелений", labelRu: "Красно-зелёный", labelEn: "Red-Green" },
  ],
}

export const products: Product[] = [
  // 1 — Folding mat in cover (folding-mats)
  {
    id: "mat-folding-cover",
    slug: "mat-folding-cover",
    ...CATEGORY_FOLDING,
    name: "Folding Mat in Cover, Dark Green 2000×550×12 mm (15 mm)",
    nameUa: "Килим розкладний в чохлі темно-зелений 2000×550×12 мм (15 мм)",
    nameRu: "Раскладной коврик в чехле тёмно-зелёный 2000×550×12 мм (15 мм)",
    price: 0,
    description:
      "The product is designed to improve comfort during long stays in field conditions. Thanks to its characteristics, it creates reliable thermal and moisture insulation, as well as additional cushioning protection from hard and uneven ground surfaces.\n\nThe mat consists of 10 sections, allowing adjustment of insulation thickness by changing its length. For example, you can create a comfortable headrest by shortening the overall length.\n\nThe mat features a convenient quick-roll and fixation system. It can also be attached to a backpack using the MOLLE system. The fixing straps also serve as comfortable carrying handles.\n\nThe outer cover is made of durable waterproof fabric, so even on wet ground a person feels only dryness and warmth. The MONOISOL filling is completely waterproof and has excellent cushioning properties, allowing the product to maintain its thickness for a long time.\n\nThe product is available in two thickness options: 12 mm and 15 mm. Each has its own advantages. The 15 mm version provides a softer surface and better thermal insulation. The 12 mm version is lighter and more compact, which is especially important for long hikes over rough terrain.",
    descriptionUa:
      "Виріб призначений для підвищення комфорту при тривалому перебуванні в польових умовах. Завдяки своїм характеристикам він створює надійний теплоізоляційний та вологозахисний бар'єр, а також додатковий амортиз��ційний захист від твердої та нерівної поверхні землі.\n\nКилим складається з 10 секцій, що дозволяє регулювати товщину ізоляції шляхом зміни довжини. Наприклад, можна зробити зручну підкладку під голову, зменшивши загальну довжину.\n\nКилим оснащений зручною системою шв��дкого згортання та фіксації. Також є можливість кріплення до рюкзака за допомогою системи MOLLE. Лямки-фіксатори одночасно служать зручними ручками для перенесення.\n\nЗовнішній чохол виготовлений з міцної водонепроникної тканини, завдяки чому навіть на вологій землі людина відчуває сухість і тепло. Наповнювач MONOISOL повністю водонепроникний і має високі амортизаційні властивості, тому виріб довго зберігає свою товщину.\n\nАсортимент представлений у двох варіантах товщини: 12 мм та 15 мм. Кожен має свої переваги. Модель 15 мм забезпечує м'якішу поверхню та кращу теплоізоляцію, а 12 мм — меншу вагу та компактність, що важливо при тривалих переходах.",
    descriptionRu:
      "Изделие предназначено для повышения комфорта при длительном пребывании в полевых условиях. Благодаря своим характеристикам оно создаёт надёжную тепло- и влагоизоляцию, а также дополнительную амортизационную защиту от твёрдой и неровной поверхности земли.\n\nКоврик состоит из 10 секций, что позволяет регулировать толщину изоляции за счёт изменения длины. Например, можно сделать удобную подушку под голову, уменьшив общую длину изделия.\n\nКоврик оснащён удобной системой быстрого сворачивания и фиксации. Также предусмотрена возможность крепления к рюкзаку с помощью системы MOLLE. Лямки-фиксаторы одновременно выполняют функцию удобных ручек для переноски.\n\nВнешний чехол изготовлен из прочной водонепроницаемой ткани, благодаря чему даже на влажной земле человек ощущает сухость и тепло. Наполнитель MONOISOL полностью водонепроницаем и обладает хорошими амортизирующими свойствами, поэтому изделие долго сохраняет свою толщину.\n\nАссортимент представлен в двух вариантах толщины: 12 мм и 15 мм. Каждый вариант имеет свои преимущества. Модель 15 мм обеспечивает более мягкую поверхность и лучшую теплоизоляцию. Версия 12 мм легче и компактнее, что особенно важно при длительных переходах по пересечённой местности.",
    specifications: {
      "Size": "2000×550×12 mm (15 mm)",
      "Color": "Dark green",
      "Sections": "10",
      "Filling": "MONOISOL (waterproof)",
      "Attachment": "MOLLE system",
      "Cover material": "Durable waterproof fabric",
    },
    specificationsUa: {
      "Розмір": "2000×550×12 мм (15 мм)",
      "Колір": "Темно-зелений",
      "Кількість секцій": "10",
      "Наповнювач": "MONOISOL (водонепроникний)",
      "Кріплення": "Система MOLLE",
      "Матеріал чохла": "Міцна водонепроникна тканина",
    },
    specificationsRu: {
      "Размер": "2000×550×12 мм (15 мм)",
      "Цвет": "Тёмно-зелёный",
      "Количество секций": "10",
      "Наполнитель": "MONOISOL (водонепроницаемый)",
      "Крепление": "Система MOLLE",
      "Материал чехла": "Прочная водонепроницаемая ткань",
    },
    images: REAL_FOLDING_MAT_COVER,
    isNew: true,
    inStock: true,
    // Name lists two thickness options: "12 мм (15 мм)" → selectable thickness.
    variants: [VARIANT_THICKNESS_12_15],
  },

  // 2 — Army L1 sleeping mat, standard attachment (roll-mats)
  {
    id: "army-l1-standard",
    slug: "army-l1-standard",
    ...CATEGORY_ROLL,
    name: "Field Insulated Sleeping Mat Army L1, Standard Attachment (1900×600×12/15 mm, Black / Olive Green)",
    nameUa: "Килим спальний польовий ізоляційний Army L1 з стандартним кріпленням (1900×600×12/15 мм, Чорний / Olive Green)",
    nameRu: "Спальный коврик полевой изоляционный Army L1 со стандартным ��ре��лением (1900×600×12/15 мм, Чёрный / Olive Green)",
    price: 0,
    description:
      "The product range of Army L1 field insulated sleeping mats offers a wide variety in color, thickness, and attachment type. All products in this line feature a protective laminated surface, which significantly improves their performance characteristics.\n\nThe mats are available in two colors: Black and Olive Green. The increased thickness can be 12 mm or 15 mm. The attachment system is also available in two variants: standard military attachment (two strong polypropylene straps with quick tightening) and improved attachment with an additional handle for convenient carrying or attachment to a backpack.\n\nAlthough these mats have larger dimensions and weight compared to compact models, they significantly increase comfort during long stays in field conditions.",
    descriptionUa:
      "Товарний асортимент спальних польових ізоляційних килимів Army L1 має широку варіацію за кольором, товщиною та видом кріплення. Усі вироби цього асортименту мають захисну ламіновану поверхню, що значно підвищує їх експлуатаційні властивості.\n\nВироби представлені у двох кольорах: чорному та Olive Green. Збільшена товщина килимів може бути 12 або 15 мм. Кріплення також доступне у двох варіантах: стандартне армійське кріплення (дві міцні поліпропіленові стрічки з швидким затягуванням) та покращене кріплення з додатковою ручкою для зручного перенесення або кріплення до рюкзака.\n\nНезважаючи на більші габарити та вагу порівняно з компактними моделями, ці килими значно підвищують комфорт при тривалому перебуванні людини в польових умовах.",
    descriptionRu:
      "Товарный ассортимент спальных полевых изоляционных к��вриков Army L1 отличается широким выбором по цвету, толщине и типу крепления. Все изделия данной линейки имеют защитную ламинированную поверхность, что существенно повышает их эксплуатационные свойства.\n\nИзделия представлены в двух цветах: чёрном и Olive Green. Увеличенная толщина ковриков может быть 12 или 15 мм. Крепление также доступно в двух вариантах: стандартное армейское (две прочные полипропиленовые ленты с быстрым затягиванием) и улучшенное крепление с дополнительной ручкой для удобного переноса или крепления к рюкзаку.\n\nНесмотря на большие габариты и вес по сравнению с компактными моделями, эти коврики значительно повышают комфорт при длительном пребывании человека в полевых условиях.",
    specifications: {
      "Size": "1900×600×12/15 mm",
      "Color": "Black / Olive Green",
      "Surface": "Laminated",
      "Strap": "Polypropylene, dark green, 25 mm, thickness 2.5 mm, density 13.2 g/m",
      "Buckle": "3-slot, polypropylene/polyamide, 25 mm",
    },
    specificationsUa: {
      "Розмір": "1900×600×12/15 мм",
      "Колір": "Чорний / Olive Green",
      "Поверхня": "Ламінована",
      "Стрічка": "Поліпропіленова, темно-зелена, 25 мм, товщина 2,5 мм, щільність 13,2 г/м.п.",
      "Пряжка": "3-х щілова, поліпропілен/поліамід, 25 мм",
    },
    specificationsRu: {
      "Размер": "1900×600×12/15 мм",
      "Цвет": "Чёрный / Olive Green",
      "Поверхность": "Ламинированная",
      "Лента": "Полипропиленовая, тёмно-зелёная, 25 мм, толщина 2,5 мм, плотность 13,2 г/м.п.",
      "Пряжка": "3-х щелевая, полипропилен/полиамид, 25 мм",
    },
    images: REAL_ARMY_L1_STANDARD,
    isNew: true,
    inStock: true,
    variants: [VARIANT_COLOR_BLACK_OLIVE, VARIANT_THICKNESS_12_15],
    // Dedicated colorway galleries: selecting "Чорний" shows only the black
    // photos, "Olive Green" shows only the olive-green photos. The main image
    // and thumbnails switch (and reset to the first photo) on variant change.
    variantImages: {
      black: VG_L1_STD_BLACK,
      "olive-green": VG_L1_STD_OLIVE,
    },
  },

  // 3 — Army L1 sleeping mat, tactical attachment (roll-mats)
  {
    id: "army-l1-tactical",
    slug: "army-l1-tactical",
    ...CATEGORY_ROLL,
    name: "Field Insulated Sleeping Mat Army L1, Tactical Attachment (1900×600×12/15 mm, Black / Olive Green)",
    nameUa: "Килим спальний польовий ізоляційний Army L1 з тактичним кріпленням (1900×600×12/15 мм, Чорний / Olive Green)",
    nameRu: "Спальный коврик полевой изоляционный Army L1 с тактическим крепление�� (1900×600×12/15 мм, Чёрный / Olive Green)",
    price: 0,
    description:
      "The product range of Army L1 field insulated sleeping mats offers a wide variety in color, thickness, and attachment type. All products in this line feature a protective laminated surface, which significantly improves their performance.\n\nThe mats are available in two colors: Black and Olive Green. The increased thickness can be 12 mm or 15 mm. The attachment system is also available in two variants: standard military attachment and improved tactical attachment with an additional handle for convenient carrying or attachment to a backpack or body.\n\nDespite their larger dimensions and weight, these mats significantly increase comfort during long stays in field conditions.",
    descriptionUa:
      "Товарний асортимент спальних польових ізоляційних килимів Army L1 має широку варіацію за кольором, товщиною та видом кріплення. Усі вироби цього асортименту мають захисну ламіновану поверхню, що суттєво підвищує їх експлуатаційні властивості.\n\nВироби представлені у двох кольорах: Чорному та Olive Green. Збільшена товщина килимів може бути 12 або 15 мм. Кріплення також доступне у двох варіантах: стандартне армійське та покращене тактичне кріплення з додатковою ручкою для зручного перенесення або кріплення до рюкзака чи тулуба.\n\nНезважаючи на більші габарити та вагу, ці килими значно покращують комфорт при тривалому перебуванні людини в польових умовах.",
    descriptionRu:
      "Товарный ассортимент спальных полевых изоляционных ко��риков Army L1 отличается широким выбором по цвету, толщине и типу крепления. Все изделия данной линейки имеют защитную ламинированную поверхность, что существенно повышает их эксплуатационные свойства.\n\nИзделия представлены в двух цветах: чёрном и Olive Green. Увеличенная толщина ковриков может быть 12 или 15 мм. Крепление также доступно в двух вариантах: стандартное армейское и улучшенное тактическое крепление с дополнительной ручкой для удобного переноса или крепления к рюкзаку или телу.\n\nНесмотря на большие габариты и вес, эти коврики значительно повышают комфорт при д��ительном пребывании человека в полевых условиях.",
    specifications: {
      "Size": "1900×600×12/15 mm",
      "Color": "Black / Olive Green",
      "Surface": "Laminated",
      "Strap": "Polypropylene, dark green, 25 mm and 20 mm, thickness 2.5 mm, density 13.2 and 10.5 g/m",
      "Fastex": "20 mm, dark green",
      "Buckle": "3-slot and 2-slot, dark green",
    },
    specificationsUa: {
      "Розмір": "1900×600×12/15 мм",
      "Колір": "Чорний / Olive Green",
      "Поверхня": "Ламінована",
      "Стрічка": "Поліпропіленова, темно-зелена, 25 мм та 20 мм, товщина 2,5 мм, щільність 13,2 та 10,5 г/м.п.",
      "Фастекс": "20 мм, темно-зелений",
      "Пряжки": "3-х та 2-х щілові, темно-зелені",
    },
    specificationsRu: {
      "Размер": "1900×600×12/15 мм",
      "Цвет": "Чёрный / Olive Green",
      "Поверхность": "Ламинированная",
      "Лента": "Полипропиленовая, тёмно-зелёная, 25 мм и 20 мм, толщина 2,5 мм, плотность 13,2 и 10,5 г/м.п.",
      "Фастекс": "20 мм, тёмно-зелёный",
      "Пряжки": "3-х и 2-х щелевые, тёмно-зелёные",
    },
    images: REAL_ARMY_L1_TACTICAL,
    inStock: true,
    variants: [VARIANT_COLOR_BLACK_OLIVE, VARIANT_THICKNESS_12_15],
    // Dedicated colorway galleries: selecting "Чорний" shows only the black
    // photos, "Olive Green" shows only the olive-green photos. The main image
    // and thumbnails switch (and reset to the first photo) on variant change.
    variantImages: {
      black: VG_L1_TAC_BLACK,
      "olive-green": VG_L1_TAC_OLIVE,
    },
  },

  // 4 — Army L1 sleeping mat in Multicam / Pixel baul cover (roll-mats)
  {
    id: "army-l1-baul-cover",
    slug: "army-l1-baul-cover",
    ...CATEGORY_ROLL,
    name: "Field Insulated Sleeping Mat Army L1 (1900×600×15 mm, Black or Olive Green) in Multicam / Pixel Cover",
    nameUa: "Килим спальний польовий ізоляційний Army L1 (1900×600×15 мм, Чорний або Olive Green) в чохлі Мультикам, Піксель",
    nameRu: "Спальный коврик полевой изоляционный Army L1 (1900×600×15 мм, Чёрный или Olive Green) в чехле Мультикам, Пиксель",
    price: 0,
    description:
      "Only 15 mm thick mats, single-side laminated, in Black or Olive Green colors come with baul covers. Instead of traditional straps, a multifunctional baul cover is used.\n\nThis cover can be used not only for transporting the mat, but also as a convenient and reliable tourist bag. It has a cylindrical shape, MOLLE system, and several comfortable carrying handles. The top closes with a waterproof zipper, and the upper part forms an additional protective flap secured with a three-slot buckle. The cover is made of durable, high-wear-resistance fabric. Available colors: Pixel camouflage, Multicam camouflage, or solid dark green.",
    descriptionUa:
      "Чохлами-баулами комплектуються лише килими товщиною 15 мм, ламіновані з однієї сторони, у кольорах Чорний або Olive Green. Замість традиційного кріплення використовується багатофункціональний чохол-баул.\n\nТакий чохол можна використовувати не тільки для транспортування килима, але й як зручну та надійну туристичну сумку. Він має циліндричну форму, систему MOLLE, декілька зручних транспортувальних ручок. Зверху застібається водостійкою блискавкою, а верх утворює додатковий захисний клапан, який фіксується на трищілинну пряжку. Чохол виготовлений з міцної тканини з підвищеною зносостійкістю. Доступні кольори: камуфляж Піксель, камуфляж Мультикам або однотонний темно-зелений.",
    descriptionRu:
      "Чехлами-баулами комплектуются только коврики толщиной 15 мм, ламинированные с одн��й стороны, в цветах Чёрный или Olive Green. Вместо традиционного крепления используется многофункциональный чехол-баул.\n\nТакой чехол можно использовать не только для транспортировки коврика, но и как удобную и надёжную туристическую сумку. Он имеет цилиндрическую форму, систему MOLLE и несколько удобных транспортных ручек. Сверху закрывается влагостойкой молнией, а верхняя часть образует дополнительный защитный клапан, который фиксируется на трёхщелевую пряжку. Чехол выполнен из прочной ткани с повышенной износостойкостью. Доступные цвета: камуфляж Пиксель, камуфляж Мультикам или однотонный тёмно-зелёный.",
    specifications: {
      "Mat size": "1900×600×15 mm",
      "Color": "Black / Olive Green",
      "Surface": "Single-side laminated",
      "Cover material": "100% Polyester",
      "Cover max volume": "35 L",
      "Cover colors": "Pixel, Multicam, dark green",
      "Strap": "Polypropylene, 20 mm",
      "Fastex": "30 mm",
      "Buckles": "3-slot and 2-slot",
      "Zipper": "Waterproof, type T7",
    },
    specificationsUa: {
      "Розмір килима": "1900×600×15 мм",
      "Колір": "Чорний / Olive Green",
      "Поверхня": "Ламінована з одні��ї сторони",
      "Матеріал чохла": "100% поліестер",
      "Макс. об'єм чохла": "35 л",
      "Кольори чохла": "Піксель, Мультикам, темно-зелений",
      "Стрічка": "Поліпропіленова, 20 мм",
      "Фастекс": "30 мм",
      "Пряжки": "3-х та 2-х щілові",
      "Блискавка": "Водонепроникна, тип T7",
    },
    specificationsRu: {
      "Размер коврика": "1900×600×15 мм",
      "Цвет": "Чёрный / Olive Green",
      "Поверхность": "Ламинированная с одной стороны",
      "Материал чехла": "100% полиэстер",
      "Макс. объём чехла": "35 л",
      "Цвета чехла": "Пиксель, Мультикам, тёмно-зелёный",
      "Лента": "Полипропиленовая, 20 мм",
      "Фастекс": "30 мм",
      "Пряжки": "3-х и 2-х щелевые",
      "Молния": "Влагостойкая, тип T7",
    },
    images: REAL_ARMY_L1_COVER,
    inStock: true,
    variants: [VARIANT_RUG_COLOR_BLACK_OLIVE, VARIANT_COVER_MULTICAM_PIXEL],
    // Gallery switches by the chosen cover: "Мультикам" shows only the multicam
    // photos, "Піксель" shows only the pixel photos — never both at once. The
    // rug-color option has no dedicated photos, so it leaves the cover gallery
    // (or the default images) in place.
    variantImages: {
      multicam: VG_L1_COVER_MULTICAM,
      pixel: VG_L1_COVER_PIXEL,
    },
  },

  // 5 — Gymnastic mat L0 (roll-mats)
  {
    id: "gymnastic-l0",
    slug: "gymnastic-l0",
    ...CATEGORY_ROLL,
    name: "Gymnastic Mat L0 Army (1800×550×12 mm, Two-color)",
    nameUa: "Килимок гімнастичний L0 Army (1800×550×12 мм, двокольоровий)",
    nameRu: "Гимнастический коврик L0 Army (1800×550×12 мм, двухцветный)",
    price: 0,
    description:
      "The product is designed for sports training at home or fitness exercises in gyms. The mat consists of two layers of high-density colored foam polyethylene. The set includes two colorful fixing elastic bands that conveniently secure the mat in the rolled state.\n\nThe ArmY gymnastic mat will be an excellent helper for both children and adults during amateur workouts or active recreation.",
    descriptionUa:
      "Виріб призначений для використання на спортивних тренуваннях вдома або при виконанні фітнес-вправ у спортивних залах. Килимок складається з двох різнокольорових шарів спіненого поліетилену підвищеної щільності. У комплекті є дві фіксуючі гумки барвистого кольору, які зручно фіксують виріб у згорнутому стані.\n\nСпортивний килимок ArmY стане у нагоді як дітям, так і дорослим під час аматорських тренувань або активного відпочинку.",
    descriptionRu:
      "Изделие предназначено для использования на спортивных тренировках дома или при выполнении фитнес-упражнений в спортивных залах. Коврик состоит из двух разноцветных слоёв вспененного полиэтилена повышенной плотности. В комплекте имеются две цветные фиксирующие резинки, которые удобно фиксируют издели�� в свернутом состоянии.\n\nСпортивный коврик ArmY станет отличным помощником как для детей, так и для взрослых при любительских тренировках или активном отдыхе.",
    specifications: {
      "Size": "1800×550×12 mm",
      "Color": "Yellow / Red (two-color)",
      "Material": "High-density foam polyethylene",
      "Strap": "Elastic polyester, 30 mm, thickness 1.2 mm, density 25 g/m",
      "Elasticity": "22 parallel silicone bands",
    },
    specificationsUa: {
      "Розмір": "1800×550×12 мм",
      "Колір": "Жовтий / Червоний (двокольоровий)",
      "Матеріал": "Спінений поліетилен підвищеної щільності",
      "Стрічка": "Еластична поліефірна, 30 мм, товщина 1,2 мм, щільність 25 г/м.п.",
      "Пружність": "22 паралельні силіконові гумки",
    },
    specificationsRu: {
      "Размер": "1800×550×12 мм",
      "Цвет": "Жёлтый / Красный (двухцветный)",
      "Материал": "Вспененный полиэтилен повышенной плотности",
      "Лента": "Эластичная полиэфирная, 30 мм, толщина 1,2 мм, плотность 25 г/м.п.",
      "Пружинность": "22 параллельные силиконовые резинки",
    },
    images: REAL_GYM_MAT_L0,
    inStock: true,
    variants: [VARIANT_GYM_COLOR],
  },

  // 6 — Tourist mat Army L0 (roll-mats)
  {
    id: "army-l0",
    slug: "army-l0",
    ...CATEGORY_ROLL,
    name: "Tourist Mat Army L0 with Set of Fixing Elastic Bands (Black 1800×550×10 mm)",
    nameUa: "Килимок туристичний Army L0 з комплектом гумок фіксуючих (чорний 1800×550×10 мм)",
    nameRu: "Туристический коврик Army L0 с комплектом фиксирующих резинок (чёрный 1800×550×10 мм)",
    price: 0,
    description:
      "The tourist mat is made of foam polyethylene, which provides a high level of thermal insulation properties and does not absorb moisture at all. The increased density of the main material prevents shrinkage under prolonged load. Additional rubber fasteners allow quick and convenient fixation of the product in the rolled state. The mat is designed for use in any field conditions: recreation, fishing, training, etc.",
    descriptionUa:
      "Килимок туристичний виготовлений зі спіненого поліетилену, завдяки чому має високий рівень теплоізоляційних властивостей та повністю не поглинає вологу. Збільшена щільність основного матеріалу перешкоджає усадці при довготривалому навантаженні. Додаткові гумові кріплення дозволяють швидко та зручно фіксувати виріб у згорнутому вигляді. Килимок призначений для використання в будь-яких польових умовах: відпочинок, рибальство, тренування тощо.",
    descriptionRu:
      "Туристический коврик изготовлен из вспененного полиэтилена, благодаря чему обладает высоким уровнем теплоизоляционных свойств и полностью не впитывает влагу. Повышенная плотность основного материала предотвращает усадку при длительной нагрузке. Дополнительные резиновые крепления позволяют быстро и удобно фиксировать изделие в свёрнутом вид��. Коврик предназначен для использования в любых полевых условиях: отдых, рыбалка, тренировки и т.д.",
    specifications: {
      "Size": "1800×550×10 mm",
      "Color": "Black",
      "Material": "Foam polyethylene",
      "Water absorption": "0%",
      "Strap": "Elastic polyester, black, 25 mm, thickness 1.8–2 mm, density 22 g/m",
      "Elasticity": "25 parallel silicone bands",
    },
    specificationsUa: {
      "Розмір": "1800×550×10 мм",
      "Колір": "Чорний",
      "Матеріал": "Спінений поліетилен",
      "Водопоглинання": "0%",
      "Стрічка": "Еластична поліефірна, чорна, 25 мм, товщина 1,8–2 мм, щільність 22 г/м.п.",
      "Пружність": "25 паралельних силіконових гумок",
    },
    specificationsRu: {
      "Размер": "1800×550×10 мм",
      "Цвет": "Чёрный",
      "Материал": "Вспененный полиэтилен",
      "Водопоглощение": "0%",
      "Лента": "Эластичная полиэфирная, чёрная, 25 мм, толщина 1,8–2 мм, плотность 22 г/м.п.",
      "Пружинность": "25 параллельных силиконовых резинок",
    },
    // Default preview/main (preview-00131 + main + gallery) stays first and
    // unchanged; the dedicated Black colorway photos are appended as extra
    // gallery thumbnails. Single color, so no variant switching is needed.
    images: [...REAL_ARMY_L0_TOURIST, ...VG_L0_TOURIST_BLACK],
    inStock: true,
  },

  // 7 — Field folding mattress (folding-mats)
  {
    id: "field-mattress",
    slug: "field-mattress",
    ...CATEGORY_FOLDING,
    name: "Field Folding Mattress Army (2000×600×50 mm, Green Khaki, Waterproof)",
    nameUa: "Матрац польовий розкладний Army (2000×600×50 мм, Зелений хакі, водонепроникний)",
    nameRu: "Матрас полевой раскладной Army (2000×600×50 мм, Зелёный хаки, водонепроницаемый)",
    price: 0,
    description:
      "The field folding mattress is designed for stationary long-term use in field conditions — for sleeping in tents, on camping beds, or directly on the ground; it can also be used during field shooting or even as a floating device. Thanks to its waterproof properties it can be placed on any wet surface while keeping the body dry, and it dries quickly since moisture does not penetrate inside. The mattress has three main sections, one with two additional sections for forming a pillow; all sections have waterproof zippers so the filling can be replaced or the cover washed. It is equipped with carrying handles and a fixation system for quick rolling. The Monoisol HD filling gives it high density, thermal insulation and elasticity, allowing it to be used as flooring in sleeping tents.",
    descriptionUa:
      "Матрац польовий розкладний призначений для стаціонарного тривалого перебування в польових умовах — для відпочинку в наметах, на похідних ліжках або просто на землі; також може застосовуватися під час польових стрільб або навіть як плавучий засіб. З��вдяки водонепроникним властивостям матрац можна класти на будь-яку вологу поверхню, при цьому тіло залишається на сухій поверхні, а виріб швидко висихає, оскільки волога не проникає всередину. Матрац складається з трьох основних секцій, одна з яких має дві додаткові секції для формування подушки; усі секції оснащені водозахисними блискавками, що дозволяє замінити наповнювач або випрати чохол. Обладнаний переносними ручками та системою кріплень для швидкого фіксування. Наповнювач Monoisol HD надає підвищену щільність, теплоізоляцію та пружність, зав��яки чому матрац можна використовувати для облаштування підлоги в спальних наметах.",
    descriptionRu:
      "Полевой раскладной матрас предназначен для стационарного длительного пребывания в полевых условиях — для отдыха в палатках, на походных кроватях или прямо на земле; также может применяться во время полевых стрельб или даже в качестве плавсредства. Благодаря водонепроницаемым свойствам матрас можно класть на любую влажную поверхность, при этом тело остаётся на сухой поверхности, а изделие быстро сохнет, так как влага не проникает внутрь. Матрас состоит из трёх основных секций, одна из которых имеет две дополнительные секции для формирования подушки; все секции оснащены влагозащитными молниями, что позволяет заменить наполнитель или постирать чехол. Оборудован переносными ручками и системой креплений для быстрой фиксации. Наполнитель Monoisol HD придаёт повышенную плотность, теплоизоляцию и упругость, благодаря чему матрас можно использовать для обустройства пола в спальных палатках.",
    specifications: {
      "Size": "2000×600×50 mm",
      "Color": "Green khaki",
      "Filling": "Monoisol HD",
      "Sections": "3 (one with 2 additional sections for a pillow)",
      "Zippers": "Waterproof",
      "Waterproof": "Yes",
    },
    specificationsUa: {
      "Розмір": "2000×600×50 мм",
      "Колір": "Зелений хакі",
      "Наповнювач": "Monoisol HD",
      "Секції": "3 (одна з 2 додатковими для подушки)",
      "Блискавки": "Водозахисні",
      "Водонепроникність": "Так",
    },
    specificationsRu: {
      "Размер": "2000×600×50 мм",
      "Цвет": "Зелёный хаки",
      "Наполнитель": "Monoisol HD",
      "Секции": "3 (одна с 2 дополнительными для подушки)",
      "Молнии": "Влагозащитные",
      "Водонепроницаемость": "Да",
    },
    images: REAL_FIELD_FOLDING_MATTRESS,
    isNew: true,
    inStock: true,
  },

  // 8 — Field seat 2-section folding (field-seats)
  {
    id: "seat-2section",
    slug: "seat-2section",
    ...CATEGORY_SEATS,
    name: "Field Seat Army in Cover, 2-Section Folding (300×400×12 mm x2, Pixel, Multicam)",
    nameUa: "Сидіння польове Army в чохлі 2х розкладне (300×400×12 мм х2, Піксель, Мультикам)",
    nameRu: "Сиденье полевое Army в чехле 2-х секционное (300×400×12 мм х2, Пиксель, Мультикам)",
    price: 0,
    description:
      "Designed for professionals, this seat meets high quality standards and offers wide functionality. It consists of two sections which, when unfolded, form a comfortable small rectangular mat, isolating a much larger body area from cold and moisture. It is attached using straps and buttons to a tactical belt or any MOLLE-compatible belt; fastex buckles allow quick attachment and removal, and the height is adjustable. The set includes a universal strap with two loop tapes for quick fixation on any side. The cover is made of durable, wear-resistant fabric. Each section is 12 mm thick, so joined together the total thickness is 24 mm. The filling has enhanced density and thermal insulation and is completely non-absorbent.",
    descriptionUa:
      "Виріб призначений для професіоналів, відповідає високим стандартам якості та забезпечує широкий функціонал використання. Сидіння складається з двох секцій, які при розгортанні утворюють зручний невеликий килимок прямокутної форми, що дозволяє ізолювати значно більшу площу тіла від холоду та вологи. Кріплення здій��нюється за допомогою строп і кнопок на тактичний пояс або будь-який ремінь з системою MOLLE; фастекси дозволяють швидко пристібати та знімати сидіння, висота кріплення регулюється. У комплекті є універсальний ремінь з двома стрічками-петельками для швидкої фіксації на будь-якій стороні. Чохол виготовлений з міцної тканини, стійкої до зносу. Кожна секція має товщину 12 мм, тому при з'єднан��і двох секцій загальна товщина становить 24 мм. Наповнювач має підвищені характеристики щільності та теплоізоляції, а також повністю не вбирає вологу.",
    descriptionRu:
      "Изделие предназначено для профессионалов, соответствует высоким стандартам качества и обеспечивает широкий функционал использования. Сиденье состоит из двух секций, которые при разворачивании образуют удобный небольшой коврик прямоугольной формы, что позволяет изолировать значительно большую площадь тела от холода и влаги. Крепление осуществляется с помощью строп и кнопок на т��ктический пояс или любой ремень с системой MOLLE; фастексы позволяют быстро пристёгивать и снимать сиденье, высота креп��ения регулируется. В комплекте имеется универсальный ремень с двумя петельками для быстрой фиксации на любой стороне. Чехол изго��овлен из прочной ткани, устойчивой к износу. Каждая секция имеет толщину 12 мм, поэтому при соединении двух секций общая толщина составляет 24 мм. Наполнитель обладает повышенными характеристиками плотности и теплоизоляции, а также полностью не впитывает влагу.",
    specifications: {
      "Size": "300×400×12 mm x2 (total 24 mm)",
      "Cover material": "100% Polyester",
      "Color": "Multicam, Pixel",
      "Strap": "Polypropylene, 25 mm",
      "Fastex": "30 mm",
      "Frame": "Polypropylene/polyamide, 25 mm",
      "Attachment": "MOLLE system",
    },
    specificationsUa: {
      "Розмір": "300×400×12 мм х2 (загалом 24 мм)",
      "Матеріал чохла": "100% поліестер",
      "Колір": "��ультикам, Піксель",
      "Стрічка": "Поліпропіленова, 25 мм",
      "Фастекс": "30 мм",
      "Рамка": "Поліпропілен/поліамід, 25 мм",
      "Кріплення": "Система MOLLE",
    },
    specificationsRu: {
      "Размер": "300×400×12 мм х2 (всего 24 мм)",
      "Материал чехла": "100% полиэстер",
      "Цвет": "Мультикам, Пиксель",
      "Лента": "Полипропиленовая, 25 мм",
      "Фастекс": "30 мм",
      "Рамка": "Полипропилен/полиамид, 25 мм",
      "Крепление": "Система MOLLE",
    },
    images: REAL_FIELD_SEAT_2X,
    isNew: true,
    inStock: true,
    // Name lists cover options "Піксель, Мультикам" → selectable cover.
    variants: [VARIANT_COVER_PIXEL_MULTICAM],
  },

  // 9 — Field seat MOLLE attachment (field-seats)
  {
    id: "seat-molle",
    slug: "seat-molle",
    ...CATEGORY_SEATS,
    name: "Field Seat Army in Cover with MOLLE Attachment System (300×400×20 mm, Pixel, Multicam)",
    nameUa: "Сидіння польове Army в чохлі з кріпленням на систему MOLLE (300×400×20 мм, Піксель, Мультикам)",
    nameRu: "Сиденье полевое Army в чехле с креплением на систему MOLLE (300×400×20 мм, Пиксель, Мультикам)",
    price: 0,
    description:
      "Designed for professionals, this seat meets high quality standards and is actively used by police special units and military personnel. It has increased thickness and consists of one rectangular section, attached using adjustable loops and strong fastex buckles for quick attachment and removal, with easily adjustable height. The cover is made of durable, wear-resistant fabric and has a convenient flap for replacing the filling or washing. The Monoisol HD filling provides enhanced density and thermal insulation and is completely non-absorbent.",
    descriptionUa:
      "Виріб призначений для професіоналів, відповідає високим стандартам якості та забезпечує широкий функціонал. Таку модель сидіння активно використовують спецпідрозділи поліції та військові. Сидіння має збільшену товщину та складається з однієї секції прямокутної форми, кріпиться за допомогою регулюючих петельок та міцних застібок системи фастекс для швидкого пристібання та знімання, висота кріплення легко регулюється. Чохол виготовлений з міцної тканини, стійкої до зн��су, ��а обладнаний зручним клапаном для заміни наповнювача або прання. Наповнювач Monoisol HD має підвищені характеристики щільності, теплоізоляції та повністю не вбирає вологу.",
    descriptionRu:
      "Изделие предназначено для профессионалов, соответствует высоким стандартам ка��е��тва и обеспечивает широкий функционал. Такую модель сиденья используют спецподразделения полиции и военные. Сиденье имеет увеличенную толщину и состоит из одной прямоугольной секции, крепится с помощью регулируемых петель и прочных застёжек системы фастекс для быстрого пристёгивания и снятия, высота крепления легко регулируется. Чехол изготовлен из прочной ткани, устойчивой к износу, и оснащён удобным клапаном для замены наполнителя или стирки. Наполнитель Monoisol HD обладает повышенными характеристиками плотности и теплоизоляции и полностью не впитывает влагу.",
    specifications: {
      "Size": "300×400×20 mm",
      "Filling": "Monoisol HD",
      "Cover material": "100% Polyester",
      "Color": "Multicam, Pixel",
      "Strap": "Polypropylene, 25 mm",
      "Fastex": "30 mm, dark green",
      "Attachment": "MOLLE system",
    },
    specificationsUa: {
      "Розмір": "300×400×20 мм",
      "Наповнювач": "Monoisol HD",
      "Матер��ал чохла": "100% поліестер",
      "Колір": "Мультикам, Піксель",
      "Стрічка": "Поліпропіленова, 25 мм",
      "Фастекс": "30 мм, темно-зелений",
      "Кріплення": "Система MOLLE",
    },
    specificationsRu: {
      "Размер": "300×400×20 мм",
      "Наполнитель": "Monoisol HD",
      "Материал чехла": "100% полиэстер",
      "Цвет": "Мультикам, Пиксель",
      "Лента": "Полипропиленовая, 25 мм",
      "Фастекс": "30 мм, тёмно-зелёный",
      "Крепление": "Система MOLLE",
    },
    images: REAL_FIELD_SEAT_MOLLE,
    inStock: true,
    // Name lists cover options "Піксель, Мультикам" → selectable cover.
    variants: [VARIANT_COVER_PIXEL_MULTICAM],
  },

  // 10 — Field seat standard (field-seats)
  {
    id: "seat-standard",
    slug: "seat-standard",
    ...CATEGORY_SEATS,
    name: "Field Seat Army in Standard Cover (300×400×12 mm, Pixel, Multicam)",
    nameUa: "Сидіння польове Army в чохлі стандартне (300×400×12 мм, Піксель, Мультикам)",
    nameRu: "Сиденье полевое Army в чехле стандартное (300×400×12 мм, Пиксель, Мультикам)",
    price: 0,
    description:
      "The standard covered field seat has high thermal insulation properties and, thanks to the durable cover, will serve for many years. The cover fabric is available in three colors: Multicam, Pixel or dark green, and is equipped with a flap that allows replacing the filling or washing the cover. The product also has stronger elastic fixing straps and a reliable fastex buckle. If the filling wears out, you can order a new one or cut it yourself from 12 mm foam polyethylene.",
    descriptionUa:
      "Сидіння польове в чохлі стандартне має високі теплоізоляційні показники, а завдяки міцному чохлу прослужить вам не один рік. Тканина чохла може бути у трьох кольорах: Мультикам, Піксель або темно-зелений, та обладнана клапаном, що дозволяє замінити наповнювач або випрати чохол. Додатково виріб оснащений більш міцними еластичними стрічками-фіксато��ами та надійною застібкою фастекс. У разі зносу наповнювача можна замовити новий або вирізати самостійно зі спіненого поліетилену товщиною 12 мм.",
    descriptionRu:
      "Полевое сиденье в чехле стандартное обладает высокими теплоизоляционными показателями, а благодаря прочному чехлу прослужит вам не один год. Ткань чехла может быть трёх цветов: Мультикам, Пиксель или тёмно-зелён��й, и оснащена клапаном, позволяющим заменить наполнитель или постирать чехол. Дополнительно изделие оснащено более прочными эластичными лентами-фиксаторами и надёжной застёжкой фастекс. В случае износа наполнителя можно заказать новый или вырезать самостоятельно из вспененного полиэтилена толщиной 12 мм.",
    specifications: {
      "Size": "300×400×12 mm",
      "Cover material": "100% Polyester",
      "Color": "Multicam, Pixel, dark green",
      "Strap": "Elastic polyamide, dark green, 25 mm",
      "Fastex": "30 mm, dark green",
      "Hook-and-loop tape": "25 mm, black",
    },
    specificationsUa: {
      "Розмір": "300×400×12 мм",
      "Матеріал чохла": "100% поліестер",
      "Колір": "Мультикам, Піксель, темно-зелений",
      "Стрічка": "Еластична поліамідна, темно-зелена, 25 мм",
      "Фастекс": "30 мм, темно-з��лений",
      "Липка стрічка": "25 мм, чорна",
    },
    specificationsRu: {
      "Размер": "300×400×12 мм",
      "Материал чехла": "100% полиэстер",
      "Цвет": "Мультикам, Пиксель, тёмно-зелёный",
      "Лента": "Эластичная полиамидная, тёмно-зелёная, 25 мм",
      "Фастекс": "30 мм, тёмно-зелёный",
      "Липкая лента": "25 мм, чёрная",
    },
    images: SEAT_IMAGES,
    inStock: true,
    // Name lists cover options "Піксель, Мультикам" → selectable cover.
    variants: [VARIANT_COVER_PIXEL_MULTICAM],
  },

  // 11 — Field seat standard+ (field-seats)
  {
    id: "seat-standard-plus",
    slug: "seat-standard-plus",
    ...CATEGORY_SEATS,
    name: "Field Seat Army in Standard+ Cover (300×400×12 mm, Pixel, Multicam)",
    nameUa: "Сидіння польове Army в чохлі стандартне+ (300×400×12 мм, Піксель, Мультикам)",
    nameRu: "Сиденье полевое Army в чехле стандартное+ (300×400×12 мм, Пиксель, Мультикам)",
    price: 0,
    description:
      "Unlike the standard covered field seat, this model has improved features that increase comfort during use. The seat has two additional attachment points to the belt, and the fixing straps have a special shape that allows more comfortable wrapping around the body. The cover fabric is available in three colors: Multicam, Pixel or dark green, and is equipped with a flap for replacing the filling or washing the cover.",
    descriptionUa:
      "Виріб, на відміну від станд��ртного сидіння польового в чохлі, має покращені властивості, які збільшують зручність при використанні. Сидіння має дві додаткові точки кріплення до ременя, а фіксуючі стрічки мають особливу форму, яка дозволяє більш зручно обгортати тулуб людини. Тканина чохла може бути у трьох кольорах: Мультикам, Піксель або темно-зелений, та обладнана клапаном для заміни наповнювача або прання чохла.",
    descriptionRu:
      "Изделие, в отличие от стандартного полевого сиденья в чехле, имеет улучшенные свойства, которые повышают удобство использования. Сиденье имеет две дополнительные точки крепления к ремню, а фиксирующие ленты обладают особой формой, позволяющей более удобно обхватывать тело человека. Ткань чехла может быть трёх цветов: Мультикам, Пиксель или тёмно-зелёный, и оснащена клапаном для замены наполнителя или стирки чехла.",
    specifications: {
      "Size": "300×400×12 mm",
      "Cover material": "100% Polyester",
      "Color": "Multicam, Pixel, dark green",
      "Strap": "Elastic, dark green, 25 mm",
      "Fastex": "30 mm, dark green",
      "Frame": "Polypropylene/polyamide, 25 mm, dark green",
      "Attachment points": "2 additional",
    },
    specificationsUa: {
      "Розмір": "300×400×12 мм",
      "Матеріал чохла": "100% поліестер",
      "Колір": "Мультикам, Піксель, темно-зелений",
      "Стрічка": "Еластична, темно-зелена, 25 мм",
      "Фастекс": "30 мм, темно-зелений",
      "Рамка": "Поліпропілен/поліамід, 25 мм, темно-зелена",
      "Точки кріплення": "2 додаткові",
    },
    specificationsRu: {
      "Размер": "300×400×12 мм",
      "Материал чехла": "100% полиэстер",
      "Цвет": "Мультикам, Пиксель, тёмно-зелёный",
      "Лента": "Эластичная, тёмно-зелёная, 25 мм",
      "Фастекс": "30 мм, тёмно-зелёный",
      "Рамка": "Полипропилен/полиамид, 25 ��м, тёмно-зелёная",
      "Точки крепления": "2 дополнительные",
    },
    images: SEAT_IMAGES,
    inStock: true,
    // Name lists cover options "Піксель, Мультикам" → selectable cover.
    variants: [VARIANT_COVER_PIXEL_MULTICAM],
  },

  // 12 — Insulated field seat (field-seats)
  {
    id: "seat-insulated",
    slug: "seat-insulated",
    ...CATEGORY_SEATS,
    name: "Field Insulated Seat Army (300×400×12 mm, Olive Green)",
    nameUa: "Сидіння польове ізоляційне Army (300×400×12 мм, Olive Green)",
    nameRu: "Сиденье полевое изоляционное Army (300×400×12 мм, Olive Green)",
    price: 0,
    description:
      "This product is an improved version of the standard field seat due to increased thickness, larger coverage area, higher density and a reinforced attachment system. The seat has protective lamination layers on both sides, which significantly enhances its performance. It is a great helper during long stays in field conditions on hiking trips or when performing professional tasks in the open air.",
    descriptionUa:
      "Даний виріб є покращеною моделлю стандартного польового сидіння завдяки збільшеній товщині, більшій площі покриття, вищій щільності та посиленій системі кріплення. Сидіння має захисні шари ламінації з двох сторін, що значно підвищує його експлуатаційні властивості. Такий виріб стане у пригоді при тривалому перебуванні в польових умовах туристичного походу або при виконанні професійних з��вдань просто неба.",
    descriptionRu:
      "Данное изделие является улучшенной моделью стандартного полевого сиденья за счёт увеличенной толщины, большей площади покрытия, повышенной плотности и усиленной системы крепления. Сиденье имеет защитные слои ламинации с двух сторон, что значительно повышает его эксплуатационные свойства. Такое изделие станет отличным помощником при длительном пребывании в полевых условиях туристического похода или при выполнении профессиональных задач под открытым небом.",
    specifications: {
      "Size": "300×400×12 mm",
      "Color": "Olive Green",
      "Surface": "Laminated on both sides",
      "Strap": "Elastic polyamide, dark green, 25 mm, thickness 1.8–2 mm, density 22 g/m",
      "Elasticity": "25 parallel silicone bands",
      "Fastex": "20–30 mm, dark green",
    },
    specificationsUa: {
      "Розмір": "300×400×12 мм",
      "Колір": "Olive Green",
      "Поверхня": "Ламінована з двох сторін",
      "Стрічка": "Еластична поліамідна, темно-зелена, 25 мм, товщина 1,8–2 мм, щільність 22 г/м.п.",
      "Пружність": "25 паралельних силіконових гумок",
      "Фастекс": "20–30 мм, темно-зелений",
    },
    specificationsRu: {
      "Размер": "300×400×12 мм",
      "Цвет": "Olive Green",
      "Поверхность": "Ламинированная с двух сторон",
      "Лента": "Эластична�� полиамидная, тёмно-зелёная, 25 мм, толщина 1,8–2 мм, плотность 22 г/м.п.",
      "Пружинность": "25 параллельных силиконовых резинок",
      "Фастекс": "20–30 мм, тёмно-зелёный",
    },
    images: SEAT_IMAGES,
    inStock: true,
  },

  // 13 — Insulated field seat L1 (field-seats)
  {
    id: "seat-insulated-l1",
    slug: "seat-insulated-l1",
    ...CATEGORY_SEATS,
    name: "Field Insulated Seat Army L1 (350×270×10 mm, Black)",
    nameUa: "Сидіння польове ізоляційне Army L1 (350×270×10 мм, чорне)",
    nameRu: "Сиденье полевое изоляционное Army L1 (350×270×10 мм, чёрное)",
    price: 0,
    description:
      "The seat is made of foam polyethylene, additionally laminated with a protective layer on the outer side. The material has a high level of thermal insulation and is completely waterproof, providing reliable protection from contact with cold or wet surfaces. It is equipped with a convenient fastex attachment system to the body; the elastic attachment straps allow secure fixation on people of different builds. Thanks to its very low weight, it can be carried over long distances. The seat is designed for use on short hiking trips, outdoor recreation, etc.",
    descriptionUa:
      "Сидіння виготовлено зі спіненого поліетилену та додатково ламіноване захисним шаром з зовнішньої сторони. Матеріал сидіння має високий рівень теплоізоляційних властивостей та є повністю вологонепроникним, завдяки чому створюється надійний захист від контак��у з холодною або вологою поверхнею. Виріб оснащений зручною системою кріплення фастекс до тулуба людини; стрічки кріплення виготовлені з еластичного матеріалу, що дозволяє міцно фіксувати сидіння на людях різної статури. Завдяки дуже малій вазі сидіння зручно носити з собою на великі відстані. Сидіння призначене для використання в нетривалих туристичних походах, відпочинку на природі тощо.",
    descriptionRu:
      "Сиденье изготовлено из вспененного полиэтилена и дополнительно ламинировано защитным слоем с внешней стороны. Материал сиденья обладает высоким уровнем теплоизоляционных свойств и полностью влагонепроницаем, благодаря чему создаётся надёжная защита от контакта с холодной или влажной поверхностью. Изделие оснащено удобной системой крепления фастекс к телу человека; крепёжные ленты изготовлены из эластичного материала, что позволяет надёжно фиксировать сиденье на людях разной комплекции. Благодаря очень малому весу сиденье удобно носить с собой на большие расстояния. Сиденье предна��начено для использования в непродолжительных туристических походах, отдыхе на природе и т.д.",
    specifications: {
      "Size": "350×270×10 mm",
      "Color": "Black",
      "Material": "Foam polyethylene, externally laminated",
      "Strap": "Elastic polyester, black, 25 mm, thickness 1.8–2 mm, density 22 g/m",
      "Elasticity": "25 parallel silicone bands",
      "Fastex": "20–30 mm, black",
    },
    specificationsUa: {
      "Розмір": "350×270×10 мм",
      "Колір": "Чорний",
      "Матеріал": "Спінений поліетилен, ламінований зовні",
      "Стрічка": "Еластична поліефірна, чорна, 25 мм, товщина 1,8–2 мм, щільність 22 г/м.п.",
      "Пружність": "25 паралельних силіконових гумок",
      "Фастекс": "20–30 мм, чорний",
    },
    specificationsRu: {
      "Размер": "350×270×10 мм",
      "Цвет": "Чёрный",
      "Материал": "Вспененный полиэтилен, ламинированный снаружи",
      "Лента": "Эластичная полиэфирная, чёрная, 25 мм, толщина 1,8–2 мм, плотность 22 г/м.п.",
      "Пружинность": "25 параллельных силиконовых резинок",
      "Фастекс": "20–30 мм, чёрный",
    },
    images: SEAT_IMAGES,
    inStock: true,
  },

  // 14 — Insulated field seat L2 (field-seats)
  {
    id: "seat-insulated-l2",
    slug: "seat-insulated-l2",
    ...CATEGORY_SEATS,
    name: "Field Insulated Seat L2 Army (260×340×20 mm, Olive Green)",
    nameUa: "Сидіння польове ізоляційне L2 Army (260×340×20 мм, Olive Green)",
    nameRu: "Сиденье полевое изоляционное L2 Army (260×340×20 мм, Olive Green)",
    price: 0,
    description:
      "This product is an improved version of the standard field seat due to increased thickness, a more ergonomic shape and a reinforced attachment system. The seat has enhanced protective lamination layers on both sides. The attachment uses a 30 mm wide polyamide elastic strap, which increases elasticity and adherence to the body. The corners are rounded to prevent snagging, and the increased thickness of 20–25 mm reliably protects the body from uneven and hard surfaces. A great helper during long stays in field conditions on hiking trips or when performing professional tasks outdoors.",
    descriptionUa:
      "Виріб є покращеною моделлю стандартного польового сидіння завдяки збільшеній товщині, більш зручній формі та посиленій системі кріплення. Сидіння має збільшені захисні шари ламінації з двох сторін. У кріпленні використовується поліамідна еластична стрічка шириною 30 мм, завдяки чому збільшується пружність та сила прилягання виробу до тулуба людини. Кути виробу зроблені більш округлими, щоб не чіплятися за інші предмети, а збільшена товщина до 20–25 мм надійно захищає тіло від будь-якої нерівної та жорсткої поверхні. Такий виріб стане у пригоді при тривалому перебуванні в польових умовах туристичного походу або при виконанні професійних завдань просто неба.",
    descriptionRu:
      "Изделие является улучшенной моделью стандартного полевого сиденья за счёт увеличенной толщины, более удобной формы и усиленной системы крепления. Сиденье имеет увеличенные защитные слои ламинации с двух сторон. В креплении используется полиамидная эластичная лента шириной 30 мм, благодаря чему увеличивается упругость и сила прилегания изделия к телу человека. Углы изделия сделаны более округлыми, чтобы не цеплялись за другие предметы, а увеличенная толщина до 20–25 мм надёжно защищает тело от любой неровной и жёсткой поверхности. Такое изделие станет отличным помощником при длительном пребывании в полевых условиях туристического похода или при выполнении профессиональных задач под открытым небом.",
    specifications: {
      "Size": "260×340×20 mm (up to 25 mm)",
      "Color": "Olive Green",
      "Surface": "Enhanced lamination on both sides",
      "Strap": "Elastic polyamide, dark green, 30 mm, thickness 1.9 mm, density 38 g/m",
      "Elasticity": "24 parallel silicone bands",
      "Fastex": "30 mm, dark green",
    },
    specificationsUa: {
      "Розмір": "260×340×20 мм (до 25 мм)",
      "Колір": "Olive Green",
      "Поверхня": "Збільшена ламінація з двох сторін",
      "Стрічка": "Ел��стична поліамідна, темно-зелена, 30 мм, товщина 1,9 мм, щільність 38 г/м.п.",
      "Пружність": "24 паралельні силіконові гумки",
      "Фастекс": "30 мм, темно-зелений",
    },
    specificationsRu: {
      "Размер": "260×340×20 мм (до 25 мм)",
      "Цвет": "Olive Green",
      "Поверхность": "Увеличенная ламинация с двух с��ор��н",
      "Лента": "Эластичная полиамидная, тёмно-зелёная, 30 мм, толщина 1,9 мм, плотность 38 г/м.п.",
      "Пружинность": "24 параллельные силиконовые резинки",
      "Фастекс": "30 мм, тёмно-зелёный",
    },
    images: SEAT_IMAGES,
    inStock: true,
  },
]

export const categories: Category[] = [
  {
    id: "roll-mats",
    name: "Roll Mats Army",
    nameUa: "Каремати рулонні Army",
    nameRu: "Карематы рулонные Army",
    image: "/images/categories/karematy-rulonni.jpg",
  },
  {
    id: "folding-mats",
    name: "Folding Mats & Mattresses Army",
    nameUa: "Каремати та матраци розкладні Army",
    nameRu: "Карематы и матрацы раскладные Army",
    image: "/images/categories/karematy-rozkladni.jpg",
  },
  {
    id: "field-seats",
    name: "Field Seats Army",
    nameUa: "Сидіння польові Army",
    nameRu: "Сиденья полевые Army",
    image: "/images/categories/sidinnia-polovi.jpg",
  },
]

/* ------------------------------- Lookups ------------------------------- */

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId)
}

/* --------------------------- Localized labels --------------------------- */

export function productName(product: Product, language: Language): string {
  if (language === "ua") return product.nameUa
  if (language === "ru") return product.nameRu
  return product.name
}

export function productDescription(product: Product, language: Language): string {
  if (language === "ua") return product.descriptionUa
  if (language === "ru") return product.descriptionRu
  return product.description
}

export function productSpecifications(product: Product, language: Language): Record<string, string> {
  if (language === "ua") return product.specificationsUa
  if (language === "ru") return product.specificationsRu
  return product.specifications
}

export function productCategoryName(product: Product, language: Language): string {
  if (language === "ua") return product.categoryUa
  if (language === "ru") return product.categoryRu
  return product.category
}

export function categoryName(category: Category, language: Language): string {
  if (language === "ua") return category.nameUa
  if (language === "ru") return category.nameRu
  return category.name
}

/* ----------------------------- Price format ----------------------------- */

/**
 * Formats a product price. While the official price list is pending, products
 * have price 0, which renders as a localized "price on request" label.
 */
export function formatPrice(price: number, language: Language): string {
  if (!price || price <= 0) {
    if (language === "ua") return "Ціна за запитом"
    if (language === "ru") return "Цена по запросу"
    return "Price on request"
  }
  return `${price} грн`
}

/**
 * Formats an order-level amount (subtotal / total / spent). While prices are
 * pending, these resolve to 0 and must render as "to be confirmed by manager"
 * instead of "0 грн".
 */
export function formatOrderTotal(value: number, language: Language): string {
  if (!value || value <= 0) {
    if (language === "ua") return "уточнюється менеджером"
    if (language === "ru") return "уточняется менеджером"
    return "to be confirmed by manager"
  }
  return `${value} грн`
}

/* ------------------------------- Variants -------------------------------- */

/** Localized group label, e.g. "Колір" / "Цвет" / "Color". */
export function variantGroupLabel(v: SelectedVariant, language: Language): string {
  if (language === "ru") return v.groupLabelRu
  if (language === "en") return v.groupLabelEn
  return v.groupLabelUa
}

/** Localized option label, e.g. "Olive Green" / "15 мм". */
export function variantOptionLabel(v: SelectedVariant, language: Language): string {
  if (language === "ru") return v.optionLabelRu
  if (language === "en") return v.optionLabelEn
  return v.optionLabelUa
}

/**
 * Stable cart-line key: product id plus the chosen option ids. Two cart lines
 * with different variants must NOT merge, while identical selections do.
 */
export function cartItemKey(productId: string, variants?: SelectedVariant[]): string {
  if (!variants || variants.length === 0) return productId
  const suffix = variants
    .map((v) => `${v.groupId}:${v.optionId}`)
    .sort()
    .join("|")
  return `${productId}__${suffix}`
}

/** Builds a SelectedVariant from a catalog group + the chosen option id. */
export function makeSelectedVariant(
  group: ProductVariantGroup,
  optionId: string,
): SelectedVariant | null {
  const option = group.options.find((o) => o.id === optionId)
  if (!option) return null
  return {
    groupId: group.id,
    groupLabelUa: group.labelUa,
    groupLabelRu: group.labelRu,
    groupLabelEn: group.labelEn,
    optionId: option.id,
    optionLabelUa: option.labelUa,
    optionLabelRu: option.labelRu,
    optionLabelEn: option.labelEn,
  }
}

/** Compact, language-independent variant summary for order payloads/email. */
export function variantSummary(variants: SelectedVariant[] | undefined, language: Language): string {
  if (!variants || variants.length === 0) return ""
  return variants
    .map((v) => `${variantGroupLabel(v, language)}: ${variantOptionLabel(v, language)}`)
    .join(", ")
}

/**
 * Resolves which image set to show for the currently selected options.
 *
 * Looks up `product.variantImages` by each chosen option id and returns the
 * first matching, non-empty set. Falls back to the product's default `images`
 * when no selected option has a dedicated photo set. Always returns a non-empty
 * array as long as the product has at least one base image.
 */
export function resolveVariantImages(
  product: Product,
  selectedOptionIds: string[],
): string[] {
  const map = product.variantImages
  if (map) {
    for (const optionId of selectedOptionIds) {
      const set = map[optionId]
      if (set && set.length > 0) return set
    }
  }
  return product.images
}
