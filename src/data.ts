import { Article, Chapter, Achievement, PracticeImpact } from "./types";

export const ARTICLES: Article[] = [
  {
    id: "magiya_dvizheniya",
    title: "Магия движения",
    subtitle: "Простой способ возвращаться к себе",
    content: "Прогулка — это, пожалуй, самый доступный способ начать возвращаться к себе. Замечали, как на ходу дыхание становится ровнее, а мысли перестают скакать? Ритмичное движение помогает снизить уровень стресса, поддерживает сердце и улучшает кровообращение.\n\nВ отличие от интенсивных тренировок, ходьба не перегружает организм. Она доступна почти в любом состоянии — даже когда совсем нет сил. Прогулки повышают выносливость, стабилизируют давление, снижают фоновое напряжение и улучшают сон.\n\nНо главное — они создают пространство. С друзьями — это живое общение. В одиночестве — медитация в движении. Слышать свои шаги, чувствовать воздух, замечать, как внутри становится тише.\n\nХодьба — это не просто движение. Это способ вернуть внимание. Спокойствие и ясность без всяких усилий.",
    imageQuery: "nature_walking"
  },
  {
    id: "vnimaniye",
    title: "Внимание",
    subtitle: "Твой главный ресурс",
    content: "Внимание — это единственное, что у тебя по-настоящему есть. Куда оно направлено — туда течёт твоя энергия. Там формируется твоё состояние.\n\nПроблема в том, что мы редко выбираем, куда смотреть. Чаще — реагируем. Телефон мигнул — рука тянется. Мысль пришла тревожная — и вот ты уже прокручиваешь её десять минут. Внимание рассеивается, энергия утекает.\n\nНейробиологи доказали: мозг не умеет удерживать фокус на нескольких вещах одновременно. Когнитивное переключение требует огромных ресурсов префронтальной коры.\n\nКогда ты тренируешься возвращать внимание — через дыхание, движение или паузу — ты укрепляешь те самые нейронные цепи, которые отвечают за самоконтроль.",
    imageQuery: "zen_focus"
  },
  {
    id: "vazhnost_sna",
    title: "Важность сна",
    subtitle: "Восстановление начинается ночью",
    content: "Сон — не пауза. Это активный процесс, в котором тело и мозг возвращают себе ресурсы. Длительность и качество сна влияют на всё: от энергии утром до спокойствия вечером.\n\nПока ты спишь, снижается тревога, улучшаются память и фокус, регулируются гормоны и крепнет иммунитет. Хронический недосып подрывает здоровье, даже если сразу это незаметно.\n\nДля идеального сна:\n• Ложись и вставай в одно время.\n• Избегай экранов за час до сна.\n• Держи спальню прохладной и тёмной.\n• Сократи кофеин во второй половине дня.",
    imageQuery: "deep_sleep"
  },
  {
    id: "polza_dykhaniya",
    title: "Польза дыхания",
    subtitle: "Самый доступный способ управлять состоянием",
    content: "Мы дышим всё время и не замечаем этого. Но если обратить на него внимание, становится видно, как сильно оно связано с состоянием. Когда ты спокоен, дыхание ровное и мягкое. Когда зажат — оно быстрое и поверхностное.\n\nВнутри нас есть парасимпатическая нервная система, которая отвечает за покой. Медленное дыхание даёт сигнал: всё в порядке, ты в безопасности. Замедляются сердцебиение, уходит напряжение, восстанавливается ясность мыслей.",
    imageQuery: "breath_waves"
  },
  {
    id: "stress_i_pauza",
    title: "Стресс и искусство паузы",
    subtitle: "Как работает стресс, чем он отличается от нагрузки",
    content: "Стресс редко выглядит как одно состояние. Чаще это смесь напряжения, ускоренных мыслей и усталости. Нагрузка сама по себе не разрушает. Систематические тренировки делают нас сильнее. Хронический стресс — это нагрузка без конца и без восстановления.\n\nПервое, что теряется при стрессе — это паузы. Небольшие остановки внутри дня, буквально на три-четыре минуты, способны помочь системе начать снижать градус кипения.\n\nДыхательные практики и заземление возвращают сознание из будущего хаоса в спокойный настоящий момент.",
    imageQuery: "peaceful_pause"
  },
  {
    id: "serdtse_i_telo",
    title: "Сердце и состояние тела",
    subtitle: "О чём говорит вариабельность сердечного ритма",
    content: "Вариабельность сердечного ритма (ВСР) — это не средний пульс, а микроскопические изменения интервалов между ударами сердца. Чем организм устойчивее, тем он гибче: он умеет ускоряться при нагрузке и мгновенно замедляться в покое. Эта гибкость и отражается в ВСР.\n\nСнижение ВСР сопровождает недовысыпания, перегрузки работой или стресс. Рост ВСР связан с хорошим сном, регулярным движением и паузами.\n\nВ Ritual ВСР — это один из главных показателей, который питает твоё «Сияние». Умное кольцо Ritual Core делает эти измерения точными и автоматическими.",
    imageQuery: "heart_rhythm"
  },
  {
    id: "fokus_vnimaniya",
    title: "Фокус внимания",
    subtitle: "Как работает Pomodoro в Ritual",
    content: "Ты садишься за важную задачу. Через пару минут проверяешь телефон. Это не лень — это любовь мозга к дешевому дофамину. Техника Pomodoro очень простая: выбираешь одну задачу, ставишь таймер и работаешь не отвлекаясь.\n\nВ Ritual «Фокус внимания» — это не просто таймер, а якорь концентрации. Ты честно кликаешь «Я отвлёкся» каждый раз, когда теряешь связь с задачей. Цель — уменьшить количество отвлечений от сессии к сессии.",
    imageQuery: "crystal_magnifier"
  },
  {
    id: "zvukovye_chastoty",
    title: "Как работают звуковые частоты",
    subtitle: "Почему определённые звуки помогают уснуть или сосредоточиться",
    content: "Мозг восприимчив к ритму. В практиках Ritual звуковые ландшафты используют три типа воздействия:\n\n1. Бинауральные биения (синхронизация через наушники): в левое и правое ухо подаются слегка разные частоты. Разницу улавливает мозг и подстраивает волны к тета-диапазону.\n2. Изохронные тоны (через любые динамики): ритмичные пульсации помогают войти в альфа-состояние спокойного бодрствования.\n3. Низкочастотный гул (стимуляция блуждающего нерва): звуки частотой 30–50 Гц физически ощущаются телом, снижая уровень кортизола.",
    imageQuery: "sound_waves"
  }
];

export const CHAPTERS: Chapter[] = [
  {
    id: "shina_source",
    title: "Исток: Рождение Света",
    metaphor: "В рассеянном внимании загорается первая искра. Шаг за шагом она становится кристаллом — твоей внутренней опорой.",
    result: "Ты соберёшь внимание в точку, увидишь свои уровни, выберешь состояние, растворишь тени и создашь утренний ритуал. Кристалл засияет целостным светом.",
    color: "#E6B85C",
    levels: [
      { id: "istok_1", number: 1, title: "Искра в тумане", metaphor: "Среди хаоса — крошечная светящаяся точка.", result: "Рассеянные мысли собираются в фокус. Тепло в груди становится внутренним центром.", durationText: "5 мин", isPremium: false },
      { id: "istok_2", number: 2, title: "Три уровня тебя", metaphor: "Свет проходит сквозь тело, эмоции и мысли.", result: "Ты осознаешь себя Наблюдателем — тем, кто видит всё, но не равен ничему.", durationText: "5 мин", isPremium: false },
      { id: "istok_3", number: 3, title: "Выкачка сияния (Выбор сияния)", metaphor: "Нейтральный свет обретает твой оттенок.", result: "Ты сам выбираешь состояние, а не ждёшь его прихода. Обретаешь спокойствие.", durationText: "6 мин", isPremium: false },
      { id: "istok_4", number: 4, title: "Преображение теней", metaphor: "Тени на гранях становятся светом.", result: "Старые обиды и утомление растворяются изнутри. Приходит невероятная лёгкость.", durationText: "6 мин", isPremium: false },
      { id: "istok_5", number: 5, title: "Луч намерения", metaphor: "Свет собирается в луч, идущий к цели.", result: "Появляется ясный внутренний вектор. Ты знаешь, куда направить силу.", durationText: "5 мин", isPremium: false },
      { id: "istok_6", number: 6, title: "Первое сияние", metaphor: "Кристалл излучает ровный, целостный свет.", result: "Утренний ритуал собран. Внимание, состояние и намерение слились воедино.", durationText: "5 мин", isPremium: false }
    ]
  },
  {
    id: "shina_silence",
    title: "Тишина: Глубина Озера",
    metaphor: "Кристалл, рождённый в Истоке, погружается в глубину безмолвного озера. Вода прозрачна и спокойна.",
    result: "Ты найдёшь глубинную тишину внутри себя, успокоишь тело дыханием, отпустишь мысли как отражения и создашь ценный вечерний ритуал.",
    color: "#7A9BBA",
    levels: [
      { id: "silence_1", number: 1, title: "Глубина озера", metaphor: "Ты погружаешься к кристаллу сквозь тёплую и тихую воду.", result: "Внутренний шум стихает до нуля. Достигаешь места абсолютного покоя.", durationText: "6 мин", isPremium: true },
      { id: "silence_2", number: 2, title: "Ритм воды", metaphor: "Дыхание выравнивает водную гладь вокруг кристалла.", result: "Напряжение уходит через созвучность с расслабленным дыханием тела.", durationText: "6 мин", isPremium: true },
      { id: "silence_3", number: 3, title: "Отражения на поверхности", metaphor: "Мысли и эмоции — лишь рябь на воде.", result: "Они уплывают мимо, а кристалл остаётся кристально чистым.", durationText: "7 мин", isPremium: true },
      { id: "silence_4", number: 4, title: "Закат на воде", metaphor: "Кристалл наполняется золотыми лучами прожитого дня.", result: "Сбор тепла, завершение дня благодарностью и освобождающим отпусканием в ночь.", durationText: "6 мин", isPremium: true },
      { id: "silence_5", number: 5, title: "Свечение в глубине", metaphor: "Дыхание, отражения и благодарность сливаются в вечерний ритуал.", result: "Глубокое ночное восстановление и умиротворённая завершённость.", durationText: "6 мин", isPremium: true }
    ]
  },
  {
    id: "shina_energy",
    title: "Энергия: Внутренний Огонь",
    metaphor: "Кристалл, напитанный глубиной, открывает в себе тепло. Твоя искра начинает согревать, превращаясь в чистую силу.",
    result: "Ты пробудишь тепло, проведёшь его по телу, разожжёшь в устойчивый жар и направишь на свои цели. Утренний ритуал запустит день с ясностью.",
    color: "#E67E22",
    levels: [
      { id: "energy_1", number: 1, title: "Пробуждение огня", metaphor: "Ладони рождают тепло и направляют его в центр Кристалла.", result: "Возбуждение внутренней искры. Ощущение управляемого физического тепла.", durationText: "6 мин", isPremium: true },
      { id: "energy_2", number: 2, title: "Поток тепла", metaphor: "Тепло плавно течёт вдоль позвоночного столба вверх и вниз.", result: "Снятие глубоких зажимов в спине, свободный поток лимфы и энергии.", durationText: "5 мин", isPremium: true },
      { id: "energy_3", number: 3, title: "Внутренний жар", metaphor: "Дыхание «Туммо» раскаляет грани до солнечного оранжевого света.", result: "Разогрев тела до устойчивого жара. Огромный внутренний ресурс энергии.", durationText: "9 мин", isPremium: true },
      { id: "energy_4", number: 4, title: "Луч воли", metaphor: "Пламя фокусируется в тонкий режущий луч ко лбу или рукам.", result: "Волевой фокус силы. Энергия направляется на твою главную еженедельную задачу.", durationText: "6.5 мин", isPremium: true },
      { id: "energy_5", number: 5, title: "Рассвет внутри", metaphor: "Тепло, поток, жар и луч объединяются под сильным утренним солнцем.", result: "Твой идеальный, мощный утренний запуск. Полная готовность духа.", durationText: "6.5 мин", isPremium: true }
    ]
  },
  {
    id: "shina_clarity",
    title: "Ясность: Зеркальная Призма",
    metaphor: "Кристалл, прошедший свет, глубину и огонь, обретает способность видеть реальность без искажений.",
    result: "Ты наведёшь безупречный порядок в планах, уберёшь шумы, найдёшь точки силы, отпустишь контроль.",
    color: "#A8D5E5",
    levels: [
      { id: "clarity_1", number: 1, title: "Рассеивая туман", metaphor: "Дымка неопределённости тает. Грань алмаза очищается.", result: "Хаос задач оборачивается чистым, ясным списком приоритетов.",
        durationText: "4 мин", isPremium: true },
      { id: "clarity_2", number: 2, "title": "Устранение шума", metaphor: "Чужие ожидания и мелкие отвлечения растворяются.", result: "Устранение фонового шума. Внимание кристаллизуется на подлинном.", durationText: "5 мин", isPremium: true },
      { id: "clarity_3", number: 3, title: "Точки силы", metaphor: "Кристалл нащупывает лазерную точку через тепло в груди.", result: "Ты находишь то единственное действие, которое экспоненциально выстроит день.", durationText: "5 мин", isPremium: true },
      { id: "clarity_4", number: 4, title: "Парадоксальная ясность", metaphor: "Внимание откладывает контроль, освобождая место для инсайта.", result: "Озарения приходят сами во время управляемой паузы и прогулки.", durationText: "6 мин", isPremium: true },
      { id: "clarity_5", number: 5, title: "Кристальная проекция", metaphor: "Все четыре грани сливаются в мощный координированный луч.",
        result: "Принятие решения на основе глубинного телесного отклика. Путь начат.", durationText: "7 мин", isPremium: true }
    ]
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_spark",
    title: "Первая искра",
    description: "Выполни первый уровень в главе «Исток» и зажги кристалл.",
    icon: "insights",
    unlockedCondition: "Завершите 1-й уровень Истока"
  },
  {
    id: "first_week",
    title: "Первая неделя",
    description: "Выполнить 7 любых ритуалов.",
    icon: "looks_one",
    unlockedCondition: "7 выполненных ритуалов"
  },
  {
    id: "practices_30",
    title: "30 практик",
    description: "Выполнить 30 любых ритуалов.",
    icon: "grain",
    unlockedCondition: "30 выполненных ритуалов"
  },
  {
    id: "days_7_streak",
    title: "7 дней подряд",
    description: "Практиковать 7 дней подряд без единого пропуска.",
    icon: "auto_awesome",
    unlockedCondition: "Серия практики из 7 дней"
  },
  {
    id: "days_30_streak",
    title: "30 дней подряд",
    description: "Практиковать 30 дней подряд без пропусков.",
    icon: "workspace_premium",
    unlockedCondition: "Серия практики из 30 дней"
  },
  {
    id: "running_first",
    title: "Первый марафон",
    description: "Пройти 42 км в ритуале «Осознанное движение».",
    icon: "directions_run",
    unlockedCondition: "Пройдите 42 км суммарно"
  },
  {
    id: "light",
    title: "Свет покоя",
    description: "Выполнить 100 любых ритуалов.",
    icon: "wb_sunny",
    unlockedCondition: "100 выполненных ритуалов"
  },
  {
    id: "constellation",
    title: "Созвездие",
    description: "Выполнить 500 ритуалов.",
    icon: "star_rate",
    unlockedCondition: "500 выполненных ритуалов"
  },
  {
    id: "focus_master",
    title: "Мастер фокуса",
    description: "Накопить 50 часов в ритуале «Фокус внимания».",
    icon: "adjust",
    unlockedCondition: "50 часов концентрации"
  },
  {
    id: "heart_harmony",
    title: "В ритме сердца",
    description: "Провести неделю в зеленой зоне «Сияния» (80–100).",
    icon: "favorite",
    unlockedCondition: "7 дней высокого сияния"
  }
];

export type VisualType = "breathing" | "spectrogram" | "journal" | "focus";

export const RITUALS_DATA: Record<string, { id: string; title: string; duration: string; category: string; description: string; isFree: boolean; visualType: VisualType }[]> = {
  "Исток": [
    { id: "5-4-3-2-1", title: "5-4-3-2-1: Нейро-сброс", duration: "5:30", category: "Снятие стресса", description: "Экстренный сброс ума через сенсорные сигналы", isFree: true, visualType: "breathing" },
    { id: "sigh", title: "Физиологический вздох", duration: "4:30", category: "Снятие стресса", description: "Двойной вдох Хубермана для мгновенного покоя", isFree: true, visualType: "breathing" },
    { id: "square_breath", title: "Квадратное дыхание", duration: "5:15", category: "Фокус", description: "Бокс-бризинг спецслужб для синхронизации мозга", isFree: true, visualType: "breathing" },
    { id: "body_scan", title: "Сканирование тела", duration: "7:00", category: "Микродвижение", description: "MBSR-практика снятия скрытого панциря зажимов", isFree: false, visualType: "spectrogram" },
    { id: "grounding", title: "Заземление через стопы", duration: "5:00", category: "Ресурс", description: "Возвращение устойчивости и опоры Питера Левина", isFree: false, visualType: "spectrogram" },
    { id: "point", title: "Точка спокойствия", duration: "3:00", category: "Перегруз", description: "Снижение тревоги через акупрессуру точки PC6", isFree: false, visualType: "breathing" },
    { id: "orient", title: "Ориентировка глаз", duration: "3:00", category: "Сброс", description: "Билатеральный сброс паники EMDR", isFree: false, visualType: "spectrogram" },
    { id: "face_massage", title: "Нейро-массаж лица", duration: "4:00", category: "Расслабление", description: "Снятие кортизолового щита с челюсти и лба", isFree: false, visualType: "spectrogram" },
    { id: "micro_moments", title: "Микро-моменты", duration: "5:25", category: "Сбор", description: "Позитивная нейропластичность Рика Хансона", isFree: false, visualType: "spectrogram" }
  ],
  "Тишина": [
    { id: "night_journal", title: "Ночной дневник", duration: "7:30", category: "Вечер", description: "Когнитивное закрытие дня через 3 вопроса", isFree: true, visualType: "journal" },
    { id: "night_scan", title: "Сканирование отпускания", duration: "7:00", category: "Сон", description: "Снятие мышечных «доспехов» дня перед сном", isFree: true, visualType: "spectrogram" },
    { id: "compassion", title: "Самосострадание", duration: "7:00", category: "Эмоции", description: "Снижение самокритики и окситоциновый прилив", isFree: true, visualType: "spectrogram" },
    { id: "mental_clean", title: "Уборка ментального пространства", duration: "7:00", category: "Сон", description: "Выключение внутреннего монолога на ночь", isFree: false, visualType: "spectrogram" },
    { id: "control_release", title: "Отпускание контроля", duration: "6:00", category: "Лёгкость", description: "Разжатие ментальных кулаков в реке времени", isFree: false, visualType: "spectrogram" },
    { id: "dissolve", title: "Растворение напряжения", duration: "6:00", category: "Сброс", description: "Соматическая текучесть от головы до стоп", isFree: false, visualType: "spectrogram" },
    { id: "resource_day", title: "Ресурс дня", duration: "6:00", category: "Смысл", description: "Сбор золотых лучей и благодарность дню", isFree: false, visualType: "spectrogram" },
    { id: "tomorrow", title: "Завтрашний день", duration: "6:00", category: "Будущее", description: "Очистка тревоги и вздор с горизонта ожидания", isFree: false, visualType: "spectrogram" },
    { id: "zero_point", title: "Нулевая точка", duration: "15:00", category: "Покой", description: "Глубинная тета-медитация полной тишины", isFree: false, visualType: "spectrogram" }
  ],
  "Энергия": [
    { id: "day_code", title: "Код дня", duration: "5:20", category: "Утро", description: "Утренняя физическая активация и якорь намерения", isFree: true, visualType: "breathing" },
    { id: "fire_breath", title: "Огненное дыхание", duration: "5:05", category: "Бодрость", description: "Сдувание пепла апатии и запуск диафрагмы", isFree: true, visualType: "breathing" },
    { id: "internal_sun", title: "Внутренний жар", duration: "9:20", category: "Сила", description: "Тибетское Туммо для терморелировок организма", isFree: true, visualType: "breathing" },
    { id: "energy_release", title: "Освобождение энергии", duration: "4:10", category: "Разрядка", description: "Сброс зажатости тела через встряску и вздохи", isFree: false, visualType: "breathing" },
    { id: "morning_awake", title: "Утреннее пробуждение", duration: "9:30", category: "Утро", description: "Гормональная гимнастика биологически активных зон", isFree: false, visualType: "breathing" },
    { id: "power_flow", title: "Поток силы", duration: "7:00", category: "Фокус", description: "Проведение энергии от позвоночника к макушке", isFree: false, visualType: "breathing" }
  ],
  "Ясность": [
    { id: "goals_map", title: "Карта целей", duration: "15:00", category: "Прогресс", description: "Пошаговое выделение еженедельных намерений", isFree: true, visualType: "focus" },
    { id: "morning_affirmation", title: "Утреннее намерение", duration: "4:00", category: "Фокус", description: "Аффирмация дня и фокусировка внимания", isFree: true, visualType: "focus" },
    { id: "priorities", title: "Расстановка приоритетов", duration: "5:00", category: "Очистка", description: "Освобождение ума от хаоса многозадачности", isFree: true, visualType: "focus" },
    { id: "planning_safely", title: "Планирование без тревоги", duration: "6:00", category: "Структура", description: "Проектирование дня с легким переносом дел", isFree: false, visualType: "focus" },
    { id: "evening_reflection", title: "Вечерняя рефлексия", duration: "5:00", category: "Вечер", description: "Сбор трех лучей света на сон грядущий", isFree: false, visualType: "journal" }
  ]
};

// --- НОВЫЕ БЛОКИ ДАННЫХ ДЛЯ ПЕРЕКОМПОНОВКИ ---

export interface ScenarioItem {
  id: string;
  label: string;
  query: string;
}

export const SCENARIOS: ScenarioItem[] = [
  { id: 'morning', label: '☀️ Начать день', query: 'код' },
  { id: 'important', label: '🎤 Перед важным моментом', query: 'вздох' },
  { id: 'calm', label: '😰 Успокоиться', query: 'сброс' },
  { id: 'focus_mind', label: '🧠 Сосредоточиться', query: 'фокус' },
  { id: 'recover', label: '😴 Восстановиться', query: 'сканирование' },
  { id: 'evening', label: '🌙 Закончить день', query: 'дневник' }
];

export const CHAPTER_CARDS = [
  {
    id: 'istok',
    title: 'Глава 1: Исток: Рождение Света',
    desc: 'В рассеянном внимании загорается первая искра. Она становится твоим внутренним Кристаллом.',
    progress: 'Уровень 1 из 6',
    level: 1,
    unlocked: true,
  },
  {
    id: 'silence',
    title: 'Глава 2: Тишина: Глубина Озера',
    desc: 'Кристалл погружается в глубину безмолвного озера. Нахождение покоя и полного релакса.',
    progress: 'Заверши Исток для открытия',
    level: 2,
    unlocked: false,
  },
  {
    id: 'energy',
    title: 'Глава 3: Энергия: Внутренний Огонь',
    desc: 'Пробуждение тепла внутри. Искра становится огнем силы и бодрой воли.',
    progress: 'Заблокировано (Plus)',
    level: 3,
    unlocked: false,
  },
  {
    id: 'clarity',
    title: 'Глава 4: Ясность: Зеркальная Призма',
    desc: 'Преломление света сквозь грани. Очищение от ментального шума и выбор пути.',
    progress: 'Заблокировано (Plus)',
    level: 4,
    unlocked: false,
  }
];

export const GROUP_PILLS: { label: string; desc: string }[] = [
  { label: 'Все', desc: 'Все практики библиотеки' },
  { label: 'Исток', desc: 'Опора и сенсорный сброс' },
  { label: 'Тишина', desc: 'Вечер, сон и отпускание' },
  { label: 'Энергия', desc: 'Циркадная бодрость и жар' },
  { label: 'Ясность', desc: 'Фокусировка и разгрузка' }
];

export const MOCK_PRACTICE_IMPACTS: PracticeImpact[] = [
  {
    ritualId: "sigh",
    ritualTitle: "Физиологический вздох",
    group: "Исток",
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    effects: [
      { metric: "hrv", change: 5, label: "+5 мс ВСР" },
      { metric: "stressLevel", change: -8, label: "↓ стресс" },
      { metric: "restingHeartRate", change: -3, label: "-3 уд/мин" },
    ],
  },
  {
    ritualId: "day_code",
    ritualTitle: "Код дня",
    group: "Энергия",
    date: new Date(Date.now() - 5 * 3600000).toISOString(),
    effects: [
      { metric: "energyLevel", change: 12, label: "+12 энергии" },
      { metric: "activitySteps", change: 1500, label: "+1500 шагов" },
    ],
  },
  {
    ritualId: "night_journal",
    ritualTitle: "Ночной дневник",
    group: "Тишина",
    date: new Date(Date.now() - 14 * 3600000).toISOString(),
    effects: [
      { metric: "sleepDuration", change: 0.8, label: "+0.8 ч сна" },
      { metric: "hrv", change: 7, label: "+7 мс ВСР" },
    ],
  },
  {
    ritualId: "goals_map",
    ritualTitle: "Карта целей",
    group: "Ясность",
    date: new Date(Date.now() - 8 * 3600000).toISOString(),
    effects: [
      { metric: "stressLevel", change: -5, label: "↓ стресс" },
      { metric: "energyLevel", change: 4, label: "+4 энергии" },
    ],
  },
];
