// Product catalog served from GET /api/products.
//
// This mirrors the storefront's bundled fallback catalog (UAH prices,
// multilingual names/descriptions for mats, seats, folding mats and sleeping
// bags). Move this into a database table for production so the catalog can be
// edited without redeploying.

export interface Product {
  id: string
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
}

export const products: Product[] = [
  {
    id: "army-l0",
    name: "Army L0 Tourist Mat with Fixing Rubber Bands (Black 1800mm*550mm*10mm)",
    nameUa: "Килимок туристичний Army L0 з комплектом гумок фіксуючих (чорний 1800мм*550мм*10мм)",
    nameRu: "Коврик туристический Army L0 с комплектом резинок фиксирующих (черный 1800мм*550мм*10мм)",
    price: 450,
    originalPrice: 550,
    category: "roll-mats",
    categoryUa: "Каремати рулонні Army",
    categoryRu: "Карематы рулонные Army",
    description:
      "Tourist mat made of foamed polyethylene, which has a high level of thermal insulation and does not absorb moisture at all. The increased density of the main material prevents shrinkage under prolonged load on its surface. Additional rubber fasteners allow you to quickly and conveniently fix the product in a rolled form.",
    descriptionUa:
      "Килимок туристичний виготовлений із спіненого поліетилену, завдяки чому має високий рівень теплоізоляційної властивості та повністю не поглинає вологу. Збільшена щільність основного матеріалу перешкоджає усадці при довготривалому навантаженні. Додаткові гумові кріплення дозволяють швидко фіксувати виріб у згорнутому вигляді.",
    descriptionRu:
      "Коврик туристический изготовлен из вспененного полиэтилена, благодаря чему имеет высокий уровень теплоизоляционных свойств и полностью не впитывает влагу. Увеличенная плотность материала препятствует усадке при длительной нагрузке. Дополнительные резиновые крепления позволяют быстро фиксировать изделие в свернутом виде.",
    specifications: {
      Density: "30-35 kg/m³",
      "Geometric Size": "1800×550×10mm (±10%)",
      Color: "Black",
      Material: "Foamed Polyethylene",
      "Water Absorption": "0%",
      "Product Weight with Fasteners": "350 grams",
    },
    specificationsUa: {
      "Щільність": "30-35 кг/м³",
      "Геометричний розмір": "1800×550×10мм (±10%)",
      "Колір": "Чорний",
      "Матеріал": "Спінений поліетилен",
      "Водопоглинання": "0%",
      "Вага виробу з кріпленням": "350 грам",
    },
    specificationsRu: {
      "Плотность": "30-35 кг/м³",
      "Геометрический размер": "1800×550×10мм (±10%)",
      "Цвет": "Черный",
      "Материал": "Вспененный полиэтилен",
      "Водопоглощение": "0%",
      "Вес изделия с креплением": "350 грамм",
    },
    images: [
      "/images/products/army-l0-roll.webp",
      "/images/products/army-l0-stand.webp",
      "/images/products/army-l0-detail.jpg",
      "/images/products/army-l0-outdoor.jpg",
    ],
    isNew: true,
    inStock: true,
  },
  {
    id: "army-l1",
    name: "Army L1 Tourist Mat (Olive 1900mm*600mm*12mm)",
    nameUa: "Килимок туристичний Army L1 (олива 1900мм*600мм*12мм)",
    nameRu: "Коврик туристический Army L1 (олива 1900мм*600мм*12мм)",
    price: 520,
    category: "roll-mats",
    categoryUa: "Каремати рулонні Army",
    categoryRu: "Карематы рулонные Army",
    description:
      "Enhanced tourist mat with improved cushioning. Made of foamed polyethylene with increased density for extended field operations.",
    descriptionUa:
      "Покращений туристичний килимок з підвищеною амортизацією. Виготовлений із спіненого поліетилену зі збільшеною щільністю для тривалих польових операцій.",
    descriptionRu:
      "Улучшенный туристический коврик с повышенной амортизацией. Изготовлен из вспененного полиэтилена с увеличенной плотностью для длительных полевых операций.",
    specifications: {
      Density: "35-40 kg/m³",
      "Geometric Size": "1900×600×12mm",
      Material: "Foamed Polyethylene",
      Weight: "420 grams",
    },
    specificationsUa: {
      "Щільність": "35-40 кг/м³",
      "Геометричний розмір": "1900×600×12мм",
      "Матеріал": "Спінений поліетилен",
      "Вага": "420 грам",
    },
    specificationsRu: {
      "Плотность": "35-40 кг/м³",
      "Геометрический размер": "1900×600×12мм",
      "Материал": "Вспененный полиэтилен",
      "Вес": "420 грамм",
    },
    images: ["/images/products/army-l1-roll.webp", "/images/products/army-l1-stand.webp"],
    isNew: true,
    inStock: true,
  },
  {
    id: "field-seat-01",
    name: "Field Seat FS-01 Insulating",
    nameUa: "Сидіння польове ізоляційне FS-01",
    nameRu: "Сиденье полевое изоляционное FS-01",
    price: 180,
    category: "field-seats",
    categoryUa: "Сидіння польові ізоляційні Army",
    categoryRu: "Сиденья полевые изоляционные Army",
    description:
      "Compact field seat for tactical operations. Foldable design with quick deployment. Provides thermal insulation from cold surfaces.",
    descriptionUa:
      "Компактне польове сидіння для тактичних операцій. Складна конструкція зі швидким розгортанням. Забезпечує теплоізоляцію від холодних поверхонь.",
    descriptionRu:
      "Компактное полевое сиденье для тактических операций. Складная конструкция с быстрым развертыванием. Обеспечивает теплоизоляцию от холодных поверхностей.",
    specifications: {
      Density: "40 kg/m³",
      "Geometric Size": "400×300×20mm",
      Material: "EVA foam",
      Weight: "120 grams",
    },
    specificationsUa: {
      "Щільність": "40 кг/м³",
      "Геометричний розмір": "400×300×20мм",
      "Матеріал": "EVA пінка",
      "Вага": "120 грам",
    },
    specificationsRu: {
      "Плотность": "40 кг/м³",
      "Геометрический размер": "400×300×20мм",
      "Материал": "EVA пена",
      "Вес": "120 грамм",
    },
    images: [
      "/images/categories/sidinnia-polovi.jpg",
      "/images/products/army-l0-outdoor.jpg",
      "/images/products/army-l0-detail.jpg",
      "/images/hero-outdoor.jpg",
    ],
    inStock: true,
  },
  {
    id: "folding-mat-01",
    name: "Folding Mat FM-01",
    nameUa: "Каремат розкладний FM-01",
    nameRu: "Каремат раскладной FM-01",
    price: 680,
    category: "folding-mats",
    categoryUa: "Каремати та матраци розкладні Army",
    categoryRu: "Карематы и матрацы раскладные Army",
    description:
      "Premium folding mattress for maximum comfort. Multi-layer construction for superior insulation. Perfect for camping and outdoor activities.",
    descriptionUa:
      "Преміальний розкладний матрац для максимального комфорту. Багатошарова конструкція для чудової ізоляції. Ідеально підходить для кемпінгу та активного відпочинку.",
    descriptionRu:
      "Премиальный раскладной матрац для максимального комфорта. Многослойная конструкция для превосходной изоляции. Идеально подходит для кемпинга и активного отдыха.",
    specifications: {
      Density: "45-50 kg/m³",
      "Geometric Size": "2000×650×25mm (folded: 650×500×100mm)",
      Material: "Multi-layer foam composite",
      Weight: "850 grams",
    },
    specificationsUa: {
      "Щільність": "45-50 кг/м³",
      "Геометричний розмір": "2000×650×25мм (складений: 650×500×100мм)",
      "Матеріал": "Багатошаровий пінний композит",
      "Вага": "850 грам",
    },
    specificationsRu: {
      "Плотность": "45-50 кг/м³",
      "Геометрический размер": "2000×650×25мм (сложенный: 650×500×100мм)",
      "Материал": "Многослойный пенный композит",
      "Вес": "850 грамм",
    },
    images: [
      "/images/categories/karematy-rozkladni.jpg",
      "/images/products/army-l0-outdoor.jpg",
      "/images/hero-outdoor.jpg",
      "/images/products/army-l0-unrolled.jpg",
    ],
    inStock: true,
  },
  {
    id: "sleeping-bag-01",
    name: "Tactical Sleeping Bag TSB-01",
    nameUa: "Тактичний спальний мішок TSB-01",
    nameRu: "Тактический спальный мешок TSB-01",
    price: 1200,
    originalPrice: 1450,
    category: "sleeping-bags",
    categoryUa: "Спальні мішки Army",
    categoryRu: "Спальные мешки Army",
    description:
      "Military-grade sleeping bag rated for extreme conditions. Temperature range: -20°C to +10°C. Compact and lightweight for field use.",
    descriptionUa:
      "Військовий спальний мішок для екстремальних умов. Температурний діапазон: -20°C до +10°C. Компактний та легкий для польового використання.",
    descriptionRu:
      "Военный спальный мешок для экстремальных условий. Температурный диапазон: -20°C до +10°C. Компактный и легкий для полевого использования.",
    specifications: {
      "Temperature Range": "-20°C to +10°C",
      "Geometric Size": "2200×800mm (compressed: 400×200mm)",
      Material: "Ripstop nylon, synthetic insulation",
      Weight: "1.8 kg",
    },
    specificationsUa: {
      "Температурний діапазон": "-20°C до +10°C",
      "Геометричний розмір": "2200×800мм (стиснутий: 400×200мм)",
      "Матеріал": "Ріпстоп нейлон, синтетичний утеплювач",
      "Вага": "1,8 кг",
    },
    specificationsRu: {
      "Температурный диапазон": "-20°C до +10°C",
      "Геометрический размер": "2200×800мм (сжатый: 400×200мм)",
      "Материал": "Рипстоп нейлон, синтетический утеплитель",
      "Вес": "1,8 кг",
    },
    images: ["/images/categories/spalni-mishky.jpg", "/images/nature-atmosphere.jpg"],
    isNew: true,
    inStock: true,
  },
  {
    id: "sleeping-bag-02",
    name: "Patrol Sleeping Bag PSB-02",
    nameUa: "Патрульний спальний мішок PSB-02",
    nameRu: "Патрульный спальный мешок PSB-02",
    price: 890,
    category: "sleeping-bags",
    categoryUa: "Спальні мішки Army",
    categoryRu: "Спальные мешки Army",
    description:
      "Lightweight patrol sleeping bag for mild conditions. Quick-dry fabric with compact storage.",
    descriptionUa:
      "Легкий патрульний спальний мішок для м'яких умов. Швидковисихаюча тканина з компактним зберіганням.",
    descriptionRu:
      "Легкий патрульный спальный мешок для мягких условий. Быстросохнущая ткань с компактным хранением.",
    specifications: {
      "Temperature Range": "-5°C to +15°C",
      "Geometric Size": "2100×750mm (compressed: 300×150mm)",
      Material: "Polyester, hollow fiber",
      Weight: "1.2 kg",
    },
    specificationsUa: {
      "Температурний діапазон": "-5°C до +15°C",
      "Геометричний розмір": "2100×750мм (стиснутий: 300×150мм)",
      "Матеріал": "Поліестер, порожнисте волокно",
      "Вага": "1,2 кг",
    },
    specificationsRu: {
      "Температурный диапазон": "-5°C до +15°C",
      "Геометрический размер": "2100×750мм (сжатый: 300×150мм)",
      "Материал": "Полиэстер, полое волокно",
      "Вес": "1,2 кг",
    },
    images: [
      "/images/categories/spalni-mishky.jpg",
      "/images/nature-atmosphere.jpg",
      "/images/hero-outdoor.jpg",
      "/images/products/army-l0-outdoor.jpg",
    ],
    inStock: true,
  },
]
