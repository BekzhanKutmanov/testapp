// Словари локализации. Ключи у ru и ky обязаны совпадать (ky типизирован через Dict).
// Тосты, мелкие опции селектов и формулы намеренно не переводятся.

export type Lang = 'ru' | 'ky'

export const LANGS: Lang[] = ['ru', 'ky']
export const DEFAULT_LANG: Lang = 'ru'
export const LANG_COOKIE = 'lang'

const ruPlural = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few

  return many
}

export const ru = {
  langName: 'Русский',
  langShort: 'РУ',

  common: {
    create: 'Создать',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    change: 'Изменить',
    update: 'Обновить',
    copy: 'Копировать',
    move: 'Переместить',
    back: 'Назад',
    close: 'Закрыть',
    add: 'Добавить',
    login: 'Войти',
    logout: 'Выйти',
    search: 'Поиск',
    select: 'Выберите',
    selectAll: 'Выбрать все',
    all: 'Все',
    total: 'Всего',
    of: 'из',
    title: 'Название',
    action: 'Действие',
    subject: 'Предмет',
    subjects: 'Предметы',
    test: 'Тест',
    tests: 'Тесты',
    students: 'Студенты',
    teacher: 'Преподаватель',
    group: 'Группа',
    createdAt: 'Дата создания',
    nothingFound: 'Ничего не найдено',
    noData: 'Данных нет',
    tryLater: 'Повторите позже',
    language: 'Язык'
  },

  app: {
    name: 'Система тестирования ОшГУ',
    university: 'ОшГУ',
    system: 'Система тестирования'
  },

  menu: {
    dashboard: 'Панель управления',
    planning: 'Планирование',
    newSubject: 'Новый предмет',
    updateSubject: 'Обновить предмет',
    confirmDelete: 'Вы точно хотите удалить?'
  },

  login: {
    welcome: 'Добро пожаловать в Test App!👋🏻',
    loginLabel: 'AVN логин',
    password: 'Пароль',
    loginRequired: 'Логин обязателен',
    passwordRequired: 'Пароль обязателен',
    unsafeChars: 'Используются недопустимые символы'
  },

  teacherHome: {
    hint: 'Пожалуйста, выберите предмет из списка слева, чтобы увидеть доступные тесты или создать новые.'
  },

  tests: {
    createTitle: 'Создание теста',
    testName: 'Название теста',
    importReady: 'Импортировать готовый тест',
    empty: 'Тестов пока нет. Нажмите кнопку выше, чтобы создать первый тест.',
    editTitle: 'Редактирование теста',
    moveOrCopy: 'Переместить или копировать в другой предмет',
    deleteTitle: 'Подтверждение удаления',
    deleteText: 'Вы уверены, что хотите удалить этот тест? Это действие нельзя будет отменить.',
    createTest: 'Создать тест',
    dragHint: 'Перетащите тест на нужный предмет',
    copyNote: 'Будут скопированы все вопросы, настройки и структура теста. Оригинальный тест останется без изменений.',
    currentSubject: 'Текущий предмет:',
    moveNote:
      'Данный тест будет перемещен в выбранный предмет. Он не будет доступен в текущем предмете. Редактируйте с осторожностью.'
  },

  createTest: {
    pageTitle: 'Создание нового теста',
    mainInfo: 'Основная информация',
    titlePlaceholder: 'Например: Итоговый тест по математике',
    description: 'Описание (необязательно)',
    descriptionPlaceholder: 'О чём этот тест, сколько времени займёт...',
    questionPlaceholder: 'Ваш вопрос',
    singleAnswer: 'Один ответ',
    multipleAnswers: 'Несколько ответов',
    textAnswer: 'Текстовый ответ',
    textAnswerPlaceholder: 'Текстовый ответ будет введен пользователем',
    option: 'Вариант',
    markCorrect: 'Отметить как правильный',
    unmarkCorrect: 'Удалить из правильных',
    addOption: 'Добавить вариант ответа',
    duplicate: 'Сделать копию',
    deleteQuestion: 'Удалить вопрос',
    addNextQuestion: 'Добавить следующий вопрос',
    saveAll: 'Сохранить весь тест'
  },

  questionNav: {
    title: 'Навигация по вопросам',
    show: 'Показать навигацию по вопросам',
    hide: 'Скрыть навигацию по вопросам',
    questions: 'Вопросы',
    question: 'Вопрос',
    filled: 'Заполнено',
    incomplete: 'Незаполненные',
    grid: 'Сетка',
    list: 'Список',
    showGrid: 'Показать сеткой',
    showList: 'Показать списком',
    allFilled: 'Все вопросы заполнены',
    canSave: 'Можно сохранять тест',
    noText: 'Без текста',
    filledOne: 'Заполнен',
    notFilled: 'Не заполнен',
    current: 'Текущий',
    toTop: 'В начало',
    newQuestion: 'Новый вопрос',
    hasAnswer: 'есть ответ',
    noAnswer: 'нет ответа',
    showQuestionList: 'Показать список вопросов',
    hideQuestionList: 'Скрыть список вопросов'
  },

  studentTest: {
    answered: 'Отвечено',
    timeLeft: 'Оставшееся время',
    allAnswered: 'Вы ответили на все вопросы',
    unanswered: 'Без ответа',
    noChangeAfterSubmit: 'После отправки изменить ответы будет нельзя.',
    submit: 'Отправить тест',
    submitConfirm: 'Отправить тест?',
    unansweredCount: 'Вопросов без ответа',
    submitDialogText:
      'После отправки вернуться к ним не получится. Если вернётесь, мы подсветим пропущенные и перейдём к первому из них.',
    backToQuestions: 'Вернуться к вопросам',
    submitAnyway: 'Всё равно отправить',
    timeUp: 'Время вышло. Отправляем ваши ответы…',
    sending: 'Отправляем ваши ответы…',
    sendError: 'Не удалось отправить тест. Проверьте соединение и попробуйте ещё раз.',
    hintRadio: 'Выберите один вариант',
    hintCheckbox: 'Выберите все подходящие варианты',
    hintText: 'Введите ответ своими словами',
    notAnswered: 'Вы не ответили на этот вопрос',
    yourAnswer: 'Ваш ответ'
  },

  proctor: {
    stepModels: 'Загрузка модулей распознавания',
    stepCamera: 'Доступ к камере',
    stepCameraHint: 'Разрешите доступ в окне браузера',
    stepWarmup: 'Проверка распознавания лица',
    prepTitle: 'Подготовка к тесту',
    prepText: 'Включаем прокторинг. Время теста пойдёт только после готовности.',
    slowNet: 'При медленном интернете это может занять до минуты. Не закрывайте страницу.',
    failTitle: 'Не удалось запустить прокторинг',
    lockHint:
      'Нажмите на значок замка 🔒 слева от адреса сайта → «Камера» → «Разрешить», затем нажмите «Попробовать снова».',
    retry: 'Попробовать снова',
    startWithout: 'Начать тест без прокторинга'
  },

  results: {
    loading: 'Отчёт прокторинга загружается…',
    honesty: 'Честность прохождения',
    violations: (n: number) =>
      `Отмечено ${n} ${ruPlural(n, 'момент', 'момента', 'моментов')}. Это не влияет на баллы за тест.`,
    noViolations: 'Нарушений не зафиксировано.',
    lookedAway: 'Отворачивался',
    leftFrame: 'Пропадал из кадра',
    strangers: 'Посторонние в кадре',
    eventPeriodic: 'Плановый снимок',
    eventLookingAway: 'Отвернулся',
    eventNoFace: 'Нет лица',
    eventMultipleFaces: 'Чужое лицо',
    shots: 'Снимки',
    noShots: 'Снимков нет',
    title: 'Результаты теста',
    groupFinished: (group: string, date: string) => `Группа ${group} · завершён ${date}`,
    outOf: (max: number) => `из ${max} баллов`,
    correct: 'Правильно',
    incorrect: 'Неправильно',
    skipped: 'Пропущено',
    correctOf: (correct: number, total: number) =>
      `Верно отвечено на ${correct} из ${total} ${ruPlural(total, 'вопроса', 'вопросов', 'вопросов')}`,
    viewAnswers: 'Посмотреть ответы'
  },

  planning: {
    theme: 'Тема',
    teacher: 'Преподаватель',
    questionCount: 'Количество вопросов',
    newPlan: 'Новое планирование',
    questionsShort: 'вопр.',
    minutesShort: 'мин.',
    camera: 'Камера',
    copyLink: 'Копировать ссылку',
    searchByName: 'Поиск по ФИО',
    colTitle: 'Название',
    colGroup: 'Группа',
    colType: 'Тип',
    colCount: 'Кол-во',
    colDuration: 'Время',
    colDate: 'Дата',
    deletePlanTitle: 'Удаление планирования',
    deletePlanText: (id: number | string) => `(#${id}) будет удалено. Это действие нельзя отменить.`,
    type: 'Тип',
    questionCountAndTime: 'Количество вопросов и время',
    start: 'Начало',
    end: 'Конец',
    extraParams: 'Дополнительные параметры',
    studentsSeeQuestions: 'Студенты могут видеть вопросы теста',
    noShuffle: 'Вопросы не перемешиваются',
    phoneAllowed: 'Можно входить с телефона',
    endAfterStart: 'Конец должен быть позже начала',
    // Добавление студентов
    addNew: 'Добавление',
    academicYear: 'Учебный год',
    faculty: 'Факультет',
    facultyPlaceholder: 'Выберите факультет',
    specialty: 'Специальность',
    studyForm: 'Форма обучения',
    semester: 'Семестр',
    semesterPlaceholder: 'Выберите семестр',
    admission: 'Приём',
    stream: 'Поток',
    subject: 'Предмет',
    selectPlaceholder: 'Выберите',
    statement: 'Ведомость',
    studentsList: 'Список студентов',
    chooseStreamHint: 'Выберите поток, студенты появятся здесь',
    selected: 'Выбрано',
    // Привязка потока
    chooseStream: 'Выбрать поток',
    noStudents: 'Нет студентов',
    addStreamHint: 'Добавьте с помощью кнопки «Выбрать поток»',
    colFullName: 'ФИО',
    colDiscipline: 'Дисц.',
    colScore: 'Балл',
    colNote: 'Примечание'
  },

  breadcrumbs: {
    allSubjects: 'Все предметы',
    subject: 'Предмет',
    create: 'Создать'
  }
}

export type Dict = typeof ru

export const ky: Dict = {
  langName: 'Кыргызча',
  langShort: 'КЫ',

  common: {
    create: 'Түзүү',
    cancel: 'Жокко чыгаруу',
    save: 'Сактоо',
    delete: 'Өчүрүү',
    edit: 'Түзөтүү',
    change: 'Өзгөртүү',
    update: 'Жаңылоо',
    copy: 'Көчүрүү',
    move: 'Жылдыруу',
    back: 'Артка',
    close: 'Жабуу',
    add: 'Кошуу',
    login: 'Кирүү',
    logout: 'Чыгуу',
    search: 'Издөө',
    select: 'Тандаңыз',
    selectAll: 'Баарын тандоо',
    all: 'Баары',
    total: 'Бардыгы',
    of: '/',
    title: 'Аталышы',
    action: 'Аракет',
    subject: 'Предмет',
    subjects: 'Предметтер',
    test: 'Тест',
    tests: 'Тесттер',
    students: 'Студенттер',
    teacher: 'Окутуучу',
    group: 'Тайпа',
    createdAt: 'Түзүлгөн күнү',
    nothingFound: 'Эч нерсе табылган жок',
    noData: 'Маалымат жок',
    tryLater: 'Кийинчерээк кайталаңыз',
    language: 'Тил'
  },

  app: {
    name: 'ОшМУнун тестирлөө системасы',
    university: 'ОшМУ',
    system: 'Тестирлөө системасы'
  },

  menu: {
    dashboard: 'Башкаруу панели',
    planning: 'Пландоо',
    newSubject: 'Жаңы предмет',
    updateSubject: 'Предметти жаңылоо',
    confirmDelete: 'Чын эле өчүрөсүзбү?'
  },

  login: {
    welcome: 'Test App\'ка кош келиңиз!👋🏻',
    loginLabel: 'AVN логин',
    password: 'Сырсөз',
    loginRequired: 'Логин милдеттүү',
    passwordRequired: 'Сырсөз милдеттүү',
    unsafeChars: 'Жол берилбеген белгилер колдонулду'
  },

  teacherHome: {
    hint: 'Жеткиликтүү тесттерди көрүү же жаңысын түзүү үчүн сол жактагы тизмеден предметти тандаңыз.'
  },

  tests: {
    createTitle: 'Тест түзүү',
    testName: 'Тесттин аталышы',
    importReady: 'Даяр тестти импорттоо',
    empty: 'Азырынча тесттер жок. Биринчи тестти түзүү үчүн жогорудагы баскычты басыңыз.',
    editTitle: 'Тестти түзөтүү',
    moveOrCopy: 'Башка предметке жылдыруу же көчүрүү',
    deleteTitle: 'Өчүрүүнү ырастоо',
    deleteText: 'Бул тестти чын эле өчүргүңүз келеби? Бул аракетти кайтаруу мүмкүн эмес.',
    createTest: 'Тест түзүү',
    dragHint: 'Тестти керектүү предметке сүйрөп барыңыз',
    copyNote: 'Тесттин бардык суроолору, жөндөөлөрү жана түзүмү көчүрүлөт. Түпнуска тест өзгөрүүсүз калат.',
    currentSubject: 'Учурдагы предмет:',
    moveNote:
      'Бул тест тандалган предметке жылдырылат. Ал учурдагы предметте жеткиликсиз болот. Этияттык менен түзөтүңүз.'
  },

  createTest: {
    pageTitle: 'Жаңы тест түзүү',
    mainInfo: 'Негизги маалымат',
    titlePlaceholder: 'Мисалы: Математика боюнча жыйынтыктоочу тест',
    description: 'Сүрөттөмө (милдеттүү эмес)',
    descriptionPlaceholder: 'Тест эмне жөнүндө, канча убакыт алат...',
    questionPlaceholder: 'Сурооңуз',
    singleAnswer: 'Бир жооп',
    multipleAnswers: 'Бир нече жооп',
    textAnswer: 'Тексттик жооп',
    textAnswerPlaceholder: 'Тексттик жоопту колдонуучу өзү киргизет',
    option: 'Вариант',
    markCorrect: 'Туура деп белгилөө',
    unmarkCorrect: 'Туура жооптордон алып салуу',
    addOption: 'Жооп вариантын кошуу',
    duplicate: 'Көчүрмөсүн жасоо',
    deleteQuestion: 'Суроону өчүрүү',
    addNextQuestion: 'Кийинки суроону кошуу',
    saveAll: 'Тестти толугу менен сактоо'
  },

  questionNav: {
    title: 'Суроолор боюнча навигация',
    show: 'Суроолор навигациясын көрсөтүү',
    hide: 'Суроолор навигациясын жашыруу',
    questions: 'Суроолор',
    question: 'Суроо',
    filled: 'Толтурулду:',
    incomplete: 'Толтурулбагандар',
    grid: 'Тор',
    list: 'Тизме',
    showGrid: 'Тор түрүндө көрсөтүү',
    showList: 'Тизме түрүндө көрсөтүү',
    allFilled: 'Бардык суроолор толтурулду',
    canSave: 'Тестти сактасаңыз болот',
    noText: 'Тексти жок',
    filledOne: 'Толтурулган',
    notFilled: 'Толтурулган эмес',
    current: 'Учурдагы',
    toTop: 'Башына',
    newQuestion: 'Жаңы суроо',
    hasAnswer: 'жооп бар',
    noAnswer: 'жооп жок',
    showQuestionList: 'Суроолордун тизмесин көрсөтүү',
    hideQuestionList: 'Суроолордун тизмесин жашыруу'
  },

  studentTest: {
    answered: 'Жооп берилди:',
    timeLeft: 'Калган убакыт',
    allAnswered: 'Бардык суроолорго жооп бердиңиз',
    unanswered: 'Жоопсуз',
    noChangeAfterSubmit: 'Жөнөткөндөн кийин жоопторду өзгөртүүгө болбойт.',
    submit: 'Тестти жөнөтүү',
    submitConfirm: 'Тестти жөнөтөсүзбү?',
    unansweredCount: 'Жоопсуз суроолор',
    submitDialogText:
      'Жөнөткөндөн кийин аларга кайтууга болбойт. Кайтсаңыз, өткөрүлүп кеткендерди белгилеп, биринчисине өтөбүз.',
    backToQuestions: 'Суроолорго кайтуу',
    submitAnyway: 'Баары бир жөнөтүү',
    timeUp: 'Убакыт бүттү. Жоопторуңузду жөнөтүп жатабыз…',
    sending: 'Жоопторуңузду жөнөтүп жатабыз…',
    sendError: 'Тестти жөнөтүү мүмкүн болгон жок. Байланышты текшерип, кайра аракет кылыңыз.',
    hintRadio: 'Бир вариантты тандаңыз',
    hintCheckbox: 'Туура келген бардык варианттарды тандаңыз',
    hintText: 'Жообуңузду өз сөзүңүз менен жазыңыз',
    notAnswered: 'Бул суроого жооп берген жоксуз',
    yourAnswer: 'Сиздин жооп'
  },

  proctor: {
    stepModels: 'Таануу модулдарын жүктөө',
    stepCamera: 'Камерага уруксат',
    stepCameraHint: 'Браузердин терезесинде уруксат бериңиз',
    stepWarmup: 'Жүздү таанууну текшерүү',
    prepTitle: 'Тестке даярдануу',
    prepText: 'Прокторингди иштетип жатабыз. Тесттин убактысы даяр болгондон кийин гана башталат.',
    slowNet: 'Интернет жай болсо, бул бир мүнөткө чейин созулушу мүмкүн. Баракты жаппаңыз.',
    failTitle: 'Прокторингди иштетүү мүмкүн болгон жок',
    lockHint:
      'Сайттын дарегинин сол жагындагы кулпу белгисин 🔒 басыңыз → «Камера» → «Уруксат берүү», андан кийин «Кайра аракет кылуу» баскычын басыңыз.',
    retry: 'Кайра аракет кылуу',
    startWithout: 'Тестти прокторингсиз баштоо'
  },

  results: {
    loading: 'Прокторинг отчёту жүктөлүүдө…',
    honesty: 'Тапшыруунун ак ниеттүүлүгү',
    violations: (n: number) => `${n} учур белгиленди. Бул тесттин баллына таасир этпейт.`,
    noViolations: 'Бузуулар катталган жок.',
    lookedAway: 'Башка жакка карады',
    leftFrame: 'Кадрдан чыгып кетти',
    strangers: 'Кадрда бөтөн адамдар',
    eventPeriodic: 'Пландуу сүрөт',
    eventLookingAway: 'Башка жакка карады',
    eventNoFace: 'Жүз жок',
    eventMultipleFaces: 'Бөтөн жүз',
    shots: 'Сүрөттөр',
    noShots: 'Сүрөттөр жок',
    title: 'Тесттин жыйынтыгы',
    groupFinished: (group: string, date: string) => `Тайпа ${group} · аяктады ${date}`,
    outOf: (max: number) => `${max} баллдан`,
    correct: 'Туура',
    incorrect: 'Туура эмес',
    skipped: 'Өткөрүлдү',
    correctOf: (correct: number, total: number) => `${total} суроонун ${correct} суроосуна туура жооп берилди`,
    viewAnswers: 'Жоопторду көрүү'
  },

  planning: {
    theme: 'Тема',
    teacher: 'Окутуучу',
    questionCount: 'Суроонун саны',
    newPlan: 'Жаңы пландоо',
    questionsShort: 'суроо',
    minutesShort: 'мүн.',
    camera: 'Камера',
    copyLink: 'Ссылканы көчүрүү',
    searchByName: 'ФАА боюнча издөө',
    colTitle: 'Аталышы',
    colGroup: 'Тайпа',
    colType: 'Тиби',
    colCount: 'Саны',
    colDuration: 'Убактысы',
    colDate: 'Күнү',
    deletePlanTitle: 'Пландоону өчүрүү',
    deletePlanText: (id: number | string) => `(#${id}) өчүрүлөт. Бул аракетти кайтаруу мүмкүн эмес.`,
    type: 'Тиби',
    questionCountAndTime: 'Берилүүчү суроонун саны жана убактысы',
    start: 'Башталышы',
    end: 'Аягы',
    extraParams: 'Кошумча параметрлер',
    studentsSeeQuestions: 'Тесттин суроолорун студенттер көрө алат',
    noShuffle: 'Суроолор аралаштырылбайт',
    phoneAllowed: 'Телефондон кире алат',
    endAfterStart: 'Аягы башталышынан кийин болушу керек',
    addNew: 'Жаңы кошуу',
    academicYear: 'Окуу жылы',
    faculty: 'Факультет',
    facultyPlaceholder: 'Факультетти тандаңыз',
    specialty: 'Адистикти тандоо',
    studyForm: 'Окуу формасы',
    semester: 'Семестр',
    semesterPlaceholder: 'Семестрди тандаңыз',
    admission: 'Кабыл алуу',
    stream: 'Агым',
    subject: 'Предмет',
    selectPlaceholder: 'Тандаңыз',
    statement: 'Ведомость',
    studentsList: 'Студенттердин тизмеси',
    chooseStreamHint: 'Агымды тандаңыз, студенттер ушул жерде чыгат',
    selected: 'Тандалды',
    chooseStream: 'Агымды тандоо',
    noStudents: 'Студенттер жок',
    addStreamHint: '«Агымды тандоо» баскычы менен кошуңуз',
    colFullName: 'ФАА',
    colDiscipline: 'Дисц.',
    colScore: 'Балл',
    colNote: 'Эскертүү'
  },

  breadcrumbs: {
    allSubjects: 'Бардык предметтер',
    subject: 'Предмет',
    create: 'Түзүү'
  }
}

export const dictionaries: Record<Lang, Dict> = { ru, ky }

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang)
