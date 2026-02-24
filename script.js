// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация подсветки синтаксиса
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
    
    // Переменные
    const sidebar = document.getElementById('sidebar');
    const topicLinks = document.querySelectorAll('.topics li');
    const topicContent = document.getElementById('topic-content');
    const prevButton = document.getElementById('prev-topic');
    const nextButton = document.getElementById('next-topic');
    const progressIndicator = document.getElementById('progress-indicator');
    const progressText = document.getElementById('progress-text');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    // Язык интерфейса (RU / КЗ)
    var LANG = localStorage.getItem('lang') || 'ru';
    var translations = {
        ru: {
            logoCaption: 'Учебник для начинающих',
            searchPlaceholder: 'Поиск по урокам...',
            searchBtn: 'Поиск',
            simulatorBtn: 'Тренажёр команд',
            simulatorTitle: 'Симулятор терминала',
            simulatorHint: 'Введите команду и нажмите Enter. Доступны команды Django и Python.',
            close: 'Закрыть',
            openMenu: 'Открыть меню',
            pinMenu: 'Закрепить меню (не закрывать при выборе темы)',
            collapseMenu: 'Свернуть меню',
            sidebarTitle: 'Содержание',
            progressTitle: 'Ваш прогресс',
            progressDone: 'завершено',
            prevTopic: '← Предыдущая тема',
            nextTopic: 'Следующая тема →',
            footer: 'Django: Учебник с нуля — теория, примеры, практика и тесты по темам',
            topic: {
                'introduction': 'Введение в Django',
                'installation': 'Установка и настройка',
                'project-creation': 'Создание проекта',
                'models': 'Модели и базы данных',
                'views': 'Представления (Views)',
                'templates': 'Шаблоны (Templates)',
                'urls': 'URL-маршрутизация',
                'forms': 'Формы',
                'admin': 'Административный интерфейс',
                'users': 'Пользователи и авторизация',
                'migrations': 'Миграции',
                'rest-framework': 'Django REST Framework',
                'testing': 'Тестирование',
                'deployment': 'Развертывание',
                'best-practices': 'Лучшие практики'
            }
        },
        kz: {
            logoCaption: 'Жаңадан бастаушыларға арналған оқулық',
            searchPlaceholder: 'Сабақ бойынша іздеу...',
            searchBtn: 'Іздеу',
            simulatorBtn: 'Команда тренажеры',
            simulatorTitle: 'Терминал симуляторы',
            simulatorHint: 'Команданы енгізіп Enter басыңыз. Django және Python командалары қолжетімді.',
            close: 'Жабу',
            openMenu: 'Мәзірді ашу',
            pinMenu: 'Мәзірді бекіту (тақырып таңдағанда жабылмайды)',
            collapseMenu: 'Мәзірді жинау',
            sidebarTitle: 'Мазмұны',
            progressTitle: 'Сіздің прогрессіңіз',
            progressDone: 'аяқталды',
            prevTopic: '← Алдыңғы тақырып',
            nextTopic: 'Келесі тақырып →',
            footer: 'Django: Нөлден оқулық — теория, мысалдар, практика және тақырып бойынша тесттер',
            topic: {
                'introduction': 'Django-ға кіріспе',
                'installation': 'Орнату және баптау',
                'project-creation': 'Жоба құру',
                'models': 'Модельдер және деректер базасы',
                'views': 'Көріністер (Views)',
                'templates': 'Үлгілер (Templates)',
                'urls': 'URL-маршрутизация',
                'forms': 'Формалар',
                'admin': 'Әкімшілік интерфейсі',
                'users': 'Пайдаланушылар және авторизация',
                'migrations': 'Миграциялар',
                'rest-framework': 'Django REST Framework',
                'testing': 'Тестирование',
                'deployment': 'Жайғастыру',
                'best-practices': 'Жақсы тәжірибелер'
            }
        }
    };
    
    function applyLang() {
        var t = translations[LANG] || translations.ru;
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var val = key.indexOf('topic.') === 0 ? (t.topic && t.topic[key.replace('topic.', '')]) : t[key];
            if (val) el.textContent = val;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            var val = t[el.getAttribute('data-i18n-placeholder')];
            if (val) el.placeholder = val;
        });
        document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
            var val = t[el.getAttribute('data-i18n-title')];
            if (val) el.title = val;
        });
        document.documentElement.lang = LANG === 'kz' ? 'kk' : 'ru';
        var titleEl = document.querySelector('title');
        if (titleEl) titleEl.textContent = LANG === 'kz' ? 'Django: Нөлден оқулық' : 'Django: Учебник с нуля — теория, практика, тесты';
        var footerEl = document.querySelector('footer [data-i18n="footer"]');
        if (footerEl) footerEl.textContent = t.footer;
        if (progressText) {
            var pct = (progressText.textContent || '').match(/\d+/);
            if (pct) progressText.textContent = pct[0] + '% ' + t.progressDone;
        }
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === LANG);
        });
    }
    
    // Текущая тема
    let currentTopicIndex = 0;
    const topics = Array.from(topicLinks).map(link => link.getAttribute('data-topic'));
    
    // Названия тем для хлебных крошек и подсказок
    function getTopicTitle(topicId) {
        const li = document.querySelector(`.topics li[data-topic="${topicId}"]`);
        return li ? li.textContent.trim() : topicId;
    }
    
    // Загрузка темы (при КЗ подставляем шаблон -kz, если есть)
    function loadTopic(topicName) {
        var templateId = (LANG === 'kz' && document.getElementById(topicName + '-template-kz')) ? topicName + '-template-kz' : topicName + '-template';
        const template = document.getElementById(templateId);
        if (template) {
            topicContent.innerHTML = template.innerHTML;
            
            // Инициализация подсветки синтаксиса для нового контента
            topicContent.querySelectorAll('pre code').forEach((block) => {
                if (typeof hljs !== 'undefined') hljs.highlightBlock(block);
            });
            
            // Инициализация вкладок
            initTabs();
            
            // Инициализация тестов
            initQuizzes();
            
            // Хлебные крошки
            const breadcrumbCurrent = document.getElementById('breadcrumb-current');
            const breadcrumbHome = document.getElementById('breadcrumb-home');
            if (breadcrumbCurrent) breadcrumbCurrent.textContent = getTopicTitle(topicName);
            if (breadcrumbHome) {
                breadcrumbHome.onclick = function(e) { e.preventDefault(); loadTopic(topics[0]); };
            }
            
            // Навигация по шагам урока (содержание урока)
            buildLessonStepNav();
            
            // Кнопки «Копировать код»
            addCopyCodeButtons();
            
            // Чекбоксы «Выполнено» у заданий
            addTaskCheckboxes(topicName);
            
            // Подсказки у кнопок «Предыдущая / Следующая тема»
            updateNavHints();
            
            // Блок «Что дальше» перед тестом
            injectNextTopicBlock();
            
            // Обновление активной темы в сайдбаре
            topicLinks.forEach(link => {
                if (link.getAttribute('data-topic') === topicName) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            currentTopicIndex = topics.indexOf(topicName);
            updateNavigationButtons();
            updateProgress();
            window.scrollTo(0, 0);
            
            // Сохраняем последнюю открытую тему для восстановления при следующем визите
            try {
                localStorage.setItem('lastTopic', topicName);
                var maxReached = Math.max(currentTopicIndex + 1, parseInt(localStorage.getItem('lastTopicMaxIndex') || '0', 10));
                localStorage.setItem('lastTopicMaxIndex', String(maxReached));
            } catch (e) {}
            
            if (window.innerWidth <= 768 && !sidebar.classList.contains('sidebar-pinned')) {
                sidebar.classList.remove('active');
            }
        }
    }
    
    // Построение навигации по шагам урока (только прямые дети topic-content)
    function buildLessonStepNav() {
        const steps = [];
        const sel = '.learning-goals, section, .practice-block, .chapter-summary, .quiz-container';
        for (const el of topicContent.children) {
            if (!el.matches || !el.matches(sel)) continue;
            const id = 'step-' + steps.length;
            el.id = id;
            let title = '';
            const h2 = el.querySelector('h2');
            const h3 = el.querySelector('h3');
            if (el.classList.contains('learning-goals')) title = 'Цели';
            else if (el.classList.contains('practice-block')) title = 'Практика';
            else if (el.classList.contains('chapter-summary')) title = 'Итоги';
            else if (el.classList.contains('quiz-container')) title = 'Проверка';
            else if (h2) title = h2.textContent.replace(/^\d+\.\s*Теория:\s*/i, '').replace(/^\d+\.\s*/, '').trim().slice(0, 32);
            else if (h3) title = h3.textContent.trim().slice(0, 32);
            if (title) steps.push({ id, title });
        }
        if (steps.length === 0) return;
        const nav = document.createElement('nav');
        nav.className = 'lesson-steps';
        nav.setAttribute('aria-label', 'Содержание урока');
        const ul = document.createElement('ul');
        steps.forEach(function(s) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + s.id;
            a.textContent = s.title;
            a.onclick = function(e) {
                e.preventDefault();
                var target = document.getElementById(s.id);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
            li.appendChild(a);
            ul.appendChild(li);
        });
        nav.appendChild(ul);
        topicContent.insertBefore(nav, topicContent.firstChild);
    }
    
    // Копирование кода в буфер
    function addCopyCodeButtons() {
        topicContent.querySelectorAll('pre').forEach(pre => {
            if (pre.querySelector('.copy-code-btn')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'copy-code-btn';
            btn.title = 'Скопировать код';
            btn.textContent = 'Копировать';
            btn.setAttribute('aria-label', 'Скопировать код');
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            btn.addEventListener('click', function() {
                navigator.clipboard.writeText(text).then(() => {
                    btn.textContent = 'Скопировано!';
                    btn.classList.add('copied');
                    setTimeout(() => { btn.textContent = 'Копировать'; btn.classList.remove('copied'); }, 2000);
                });
            });
            pre.style.position = 'relative';
            pre.appendChild(btn);
        });
    }
    
    // Чекбоксы «Отметить выполненным» у заданий
    function addTaskCheckboxes(topicName) {
        const key = 'taskDone_' + topicName;
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        topicContent.querySelectorAll('.task-card').forEach((card, index) => {
            let wrap = card.querySelector('.task-done-wrap');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'task-done-wrap';
                const label = document.createElement('label');
                label.className = 'task-done-label';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'task-done-cb';
                cb.dataset.index = index;
                label.appendChild(cb);
                label.appendChild(document.createTextNode(' Отметить выполненным'));
                wrap.appendChild(label);
                card.appendChild(wrap);
                cb.checked = saved[index] === true;
                cb.addEventListener('change', function() {
                    saved[index] = this.checked;
                    localStorage.setItem(key, JSON.stringify(saved));
                    card.classList.toggle('task-done', this.checked);
                });
                if (saved[index]) card.classList.add('task-done');
            }
        });
    }
    
    // Подсказки у навигации «Предыдущая / Следующая тема»
    function updateNavHints() {
        const prevHint = document.getElementById('prev-hint');
        const nextHint = document.getElementById('next-hint');
        if (prevHint) prevHint.textContent = currentTopicIndex > 0 ? getTopicTitle(topics[currentTopicIndex - 1]) : '';
        if (nextHint) nextHint.textContent = currentTopicIndex < topics.length - 1 ? getTopicTitle(topics[currentTopicIndex + 1]) : '';
    }
    
    // Блок «Что дальше» перед тестом
    function injectNextTopicBlock() {
        const quizContainer = topicContent.querySelector('.quiz-container');
        if (!quizContainer || currentTopicIndex >= topics.length - 1) return;
        const nextId = topics[currentTopicIndex + 1];
        const nextTitle = getTopicTitle(nextId);
        let block = topicContent.querySelector('.next-topic-block');
        if (block) block.remove();
        block = document.createElement('div');
        block.className = 'next-topic-block';
        block.innerHTML = '<p class="next-topic-label">Что дальше?</p><p><a href="#" class="next-topic-link" data-next-topic="' + nextId + '">' + nextTitle + '</a> — перейти к следующей теме.</p>';
        quizContainer.parentNode.insertBefore(block, quizContainer);
        block.querySelector('.next-topic-link').onclick = function(e) {
            e.preventDefault();
            loadTopic(nextId);
        };
    }
    
    // Обновление кнопок навигации
    function updateNavigationButtons() {
        prevButton.disabled = currentTopicIndex === 0;
        nextButton.disabled = currentTopicIndex === topics.length - 1;
    }
    
    // Обновление прогресса (показываем, до какой темы пользователь максимально дошёл)
    function updateProgress() {
        var maxIndex = parseInt(localStorage.getItem('lastTopicMaxIndex') || '0', 10);
        maxIndex = Math.max(maxIndex, currentTopicIndex + 1);
        localStorage.setItem('lastTopicMaxIndex', String(maxIndex));
        const progress = (maxIndex / topics.length) * 100;
        progressIndicator.style.width = `${progress}%`;
        var t = translations[LANG] || translations.ru;
        progressText.textContent = Math.round(progress) + '% ' + t.progressDone;
    }
    
    // Инициализация вкладок
    function initTabs() {
        const tabHeaders = document.querySelectorAll('.tab-header');
        
        tabHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                const tabContainer = this.closest('.tabs');
                
                // Активация заголовка вкладки
                tabContainer.querySelectorAll('.tab-header').forEach(h => {
                    h.classList.remove('active');
                });
                this.classList.add('active');
                
                // Активация содержимого вкладки
                tabContainer.querySelectorAll('.tab-content').forEach(content => {
                    if (content.getAttribute('data-tab') === tabName) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
    
    // Пояснения к правильным и неправильным ответам (по темам и номерам вопросов)
    const quizExplanations = {
        'introduction': [
            { right: 'Django использует паттерн MTV: Model (данные), Template (разметка), View (логика отображения). В MVC шаблон и логика отображения часто объединены во View.', wrong: 'MVC — у других фреймворков (Rails, Spring). В Django Template ≈ View в MVC, а View ≈ Controller.' },
            { right: 'DRY, KISS и «быстрая разработка» — часть философии Django. «Явное лучше неявного» — принцип Python (Zen), но не специфичный лозунг Django.', wrong: 'Все перечисленные принципы так или иначе связаны с хорошей разработкой; здесь спрашивалось, какой не входит в явную философию Django.' },
            { right: 'Instagram, Pinterest, Dropbox и многие другие используют Django. Facebook (основной продукт) написан в основном на PHP (Hack).', wrong: 'Instagram и другие сервисы действительно работают на Django; Facebook — нет.' },
            { right: 'Template в MTV — это HTML-разметка с переменными {{ }} и тегами {% %}. Логика — во View, структура БД — в Model, маршруты — в urls.', wrong: 'Логика запроса — во View; структура БД — в Model; маршрутизация — в urlconf.' }
        ],
        'installation': [
            { right: 'Команда pip install django ставит последнюю совместимую версию. Для конкретной версии: pip install django==4.2.', wrong: 'pip — установщик пакетов; django-admin и python -m django — для запуска после установки.' },
            { right: 'Встроенный модуль venv создаёт изолированную папку с копией Python и pip. Так зависимости одного проекта не конфликтуют с другими.', wrong: 'virtualenv — внешний пакет; env и pip venv — неверные команды.' },
            { right: 'После установки Django проверяют командой python -m django --version (или django-admin --version).', wrong: 'python --version показывает версию Python, а не Django; django --version не запускается так.' },
            { right: 'Виртуальное окружение изолирует пакеты проекта от глобального Python и от других проектов — у каждого проекта свои версии библиотек.', wrong: 'venv не ускоряет установку и не обновляет Django автоматически; для продакшена его тоже рекомендуют.' }
        ],
        'project-creation': [
            { right: 'Проект создаётся командой django-admin startproject имя. manage.py и папка с настройками появятся в текущей директории.', wrong: 'startproject выполняет именно django-admin, а не python manage.py (manage.py появляется после создания проекта).' },
            { right: 'Приложение создаётся из корня проекта командой python manage.py startapp имя — у вас уже есть manage.py.', wrong: 'django-admin startapp создаёт приложение «снаружи» проекта; внутри проекта используют manage.py startapp.' },
            { right: 'Настройки БД (ENGINE, NAME, USER и т.д.) задаются в settings.py в секции DATABASES.', wrong: 'database.py, config.py, db.py в стандартной структуре Django не используются.' },
            { right: 'runserver запускает встроенный сервер разработки (по умолчанию на порту 8000). Только для разработки; на продакшене используют Gunicorn/uWSGI и Nginx.', wrong: 'БД создаётся через migrate; миграции применяются отдельной командой; приложения создаются через startapp.' }
        ],
        'models': [
            { right: 'Модели наследуются от django.db.models.Model. Каждое поле — экземпляр Field (CharField, IntegerField и т.д.).', wrong: 'BaseModel и DjangoModel — не стандартные классы; Model из models — да.' },
            { right: 'Метод __str__ модели вызывается при отображении объекта в админке, в shell и в шаблонах (например, в списках).', wrong: '__repr__ — для отладки; title() и get_name() — не стандартные методы для отображения в админке.' },
            { right: 'ForeignKey создаёт связь «много к одному». Один автор — много статей: у Article поле author = models.ForeignKey(Author, ...).', wrong: 'OneToOne — один к одному; ManyToMany — многие ко многим. Для «у статьи один автор» нужен ForeignKey.' },
            { right: 'Сначала makemigrations создаёт файлы миграций по изменениям в models.py, затем migrate применяет их к БД. Без этого таблицы и столбцы не появятся.', wrong: 'Только migrate — недостаточно, нужны файлы миграций. Только makemigrations — не обновит БД. Django не применяет изменения к БД автоматически.' }
        ],
        'views': [
            { right: 'View должна вернуть экземпляр HttpResponse (или подкласс). return HttpResponse("Hello") — минимальный вариант.', wrong: 'Строка или dict без обёртки в HttpResponse не подходят; браузер ожидает HTTP-ответ.' },
            { right: 'Первый параметр view-функции — request (экземпляр HttpRequest). В нём передаётся метод, GET/POST, заголовки и т.д.', wrong: 'response и context — не первый аргумент; env — не стандартный параметр Django.' },
            { right: 'redirect() возвращает HttpResponseRedirect и перенаправляет браузер на другой URL. Применяется после POST (например, после сохранения формы).', wrong: 'render() отдаёт страницу по шаблону; HttpResponse и redirect_to так не используются.' }
        ],
        'templates': [
            { right: 'В шаблоне переменные выводятся через {{ variable }}. Фильтры: {{ name|upper }}, теги: {% for %}, {% if %}.', wrong: '{variable} и ${variable} в Django не используются; синтаксис другой.' },
            { right: 'Наследование: в базовом шаблоне {% block content %} ... {% endblock %}, в дочернем {% extends "base.html" %} и {% block content %} ... {% endblock %}.', wrong: 'include подключает фрагмент; inherit и extend — не теги Django.' },
            { right: 'Контекст передаётся третьим аргументом: render(request, "page.html", {"key": value}). В шаблоне доступно {{ key }}.', wrong: 'Первый аргумент render — request, второй — шаблон; контекст — именно словарь третьим аргументом.' }
        ],
        'urls': [
            { right: 'path() принимает маршрут (строка или с конвертерами, например <int:id>), view и опционально name для reverse().', wrong: 'url() — старый стиль; route() и map() так в Django не используются.' },
            { right: 'reverse("name") по имени маршрута возвращает URL. Так не зашивают пути в коде: при смене url путь обновится везде.', wrong: 'resolve и get_url не используются так; redirect() перенаправляет, но не возвращает строку URL.' },
            { right: 'Конвертер int в <int:pk> даёт целое число в pk. str, uuid, slug и т.д. — другие конвертеры.', wrong: 'id и number не являются именами конвертеров; тип задаётся префиксом int:, str: и т.д.' }
        ],
        'forms': [
            { right: 'Form либо наследуется от django.forms.Form, либо для модели — от forms.ModelForm. Поля задаются как атрибуты класса.', wrong: 'BaseForm и DjangoForm — не стандартные имена; ModelForm — да, но не единственный вариант для форм.' },
            { right: 'is_valid() проверяет данные и заполняет cleaned_data. После True можно брать form.cleaned_data["field"].', wrong: 'validate() и check() так не используются; cleaned_data появляется только после успешного is_valid().' },
            { right: 'В шаблоне форма выводится через {{ form }} или по полям {{ form.field }}. Ошибки: {{ form.field.errors }}, {{ form.non_field_errors }}.', wrong: 'form.as_table и form.as_p — способы вывода, но не единственные; синтаксис полей — через точку.' }
        ],
        'admin': [
            { right: 'Команда python manage.py createsuperuser создаёт пользователя с правами суперпользователя, который может входить на /admin/.', wrong: 'addsuperuser и create_admin — не команды Django; adminuser — тоже нет.' },
            { right: 'Регистрация модели в админке: admin.site.register(Article) или декоратор @admin.register(Article) и класс ModelAdmin.', wrong: 'register_model и AdminSite.register — не такой вызов; используется именно admin.site.register(Model).' },
            { right: 'list_display задаёт список полей в таблице списка объектов в админке. Остальные опции — list_filter, search_fields, ordering и т.д.', wrong: 'display_list и table_columns не используются; правильное имя атрибута — list_display.' }
        ],
        'users': [
            { right: 'Декоратор @login_required перенаправляет неаутентифицированного пользователя на страницу входа и возвращает на запрошенный URL после входа.', wrong: 'auth_required и require_login — не стандартные декораторы Django.' },
            { right: 'В представлении текущий пользователь доступен как request.user. AnonymousUser для неавторизованных, иначе экземпляр User.', wrong: 'current_user и user — не атрибуты request в Django; именно request.user.' },
            { right: 'Функция login(request, user) записывает пользователя в сессию после проверки пароля (authenticate даёт user, затем login(request, user)).', wrong: 'authenticate только проверяет учётные данные; set_user и create_session так не используются.' }
        ],
        'migrations': [
            { right: 'makemigrations создаёт файлы миграций по изменениям в models.py. Файлы появляются в приложении в папке migrations/.', wrong: 'migrate применяет миграции; create_migration и migrate --create — не команды.' },
            { right: 'migrate применяет миграции к БД: создаёт и меняет таблицы. Без аргументов — все приложения.', wrong: 'makemigrations только создаёт файлы; apply и sync — не команды manage.py.' },
            { right: 'Откат: python manage.py migrate myapp 0001_initial (или другое имя миграции). База откатывается до этого состояния.', wrong: 'rollback и migrate --back не используются; откат — указанием имени миграции после имени приложения.' }
        ],
        'rest-framework': [
            { right: 'Сериализаторы DRF преобразуют объекты моделей в JSON и обратно, плюс валидация. Обычно наследуют ModelSerializer.', wrong: 'Serializer — базовый класс; JSONField и to_json — не замена сериализаторов DRF.' },
            { right: 'ViewSet объединяет логику списка, создания, деталей и удаления (CRUD). Подключается к маршрутам через routers.', wrong: 'APIView и GenericAPIView — более низкоуровневые; RESTView — не стандартное имя.' },
            { right: 'Права доступа задаются через permission_classes у представления, например IsAuthenticated, AllowAny, IsAdminUser.', wrong: 'access_control и auth_classes так не называются; в DRF именно permission_classes.' }
        ],
        'testing': [
            { right: 'django.test.TestCase создаёт тестовую БД и откатывает транзакции после каждого теста. unittest.TestCase не знает про Django ORM и БД.', wrong: 'TestBase — внутренний класс; DjangoTest — не стандартное имя.' },
            { right: 'Client() из django.test эмулирует HTTP: client.get(url), client.post(url, data). Возвращает response с status_code, content и т.д.', wrong: 'request.get и django.test.get — не так вызываются; используется экземпляр Client().' },
            { right: 'Все тесты проекта запускаются командой python manage.py test. Можно указать приложение или тестовый класс/метод.', wrong: 'runtests и unittest — не команды manage.py; pytest — отдельный запускатель.' }
        ],
        'deployment': [
            { right: 'DEBUG=False отключает отладочную страницу и утечку информации. На продакшене всегда должно быть False.', wrong: 'DEBUG=True опасно на продакшене; остальные опции не заменяют отключение отладки.' },
            { right: 'SECRET_KEY не должен храниться в коде. Его задают через переменную окружения (os.environ.get("SECRET_KEY")) и подставляют в settings.', wrong: 'Хранить ключ в settings в открытом виде и в репозитории — плохая практика.' },
            { right: 'collectstatic собирает все статические файлы из приложений и STATICFILES_DIRS в папку STATIC_ROOT для раздачи веб-сервером.', wrong: 'staticfiles и copy_static так не используются; именно команда collectstatic.' }
        ],
        'best-practices': [
            { right: 'Декоратор @login_required ограничивает доступ к представлению: неавторизованный пользователь перенаправляется на страницу входа.', wrong: 'auth_required и login_only — не стандартные декораторы Django.' },
            { right: 'select_related("author") подтягивает связь по ForeignKey одним запросом (JOIN), уменьшая число запросов к БД при обходе списка.', wrong: 'prefetch_related — для обратных и M2M связей; join и include — не методы QuerySet так.' },
            { right: 'Классы ListView, DetailView, FormView и др. реализуют типовые сценарии и уменьшают дублирование кода (DRY).', wrong: 'View — базовый класс без логики списка/детали; BaseView — не стандартное имя для этого.' }
        ]
    };
    
    // Инициализация тестов
    function initQuizzes() {
        const quizzes = document.querySelectorAll('.quiz');
        
        quizzes.forEach(quiz => {
            const checkButton = quiz.querySelector('.check-answers');
            const resetButton = quiz.querySelector('.quiz-reset');
            const questions = quiz.querySelectorAll('.question');
            const resultsDiv = quiz.querySelector('.quiz-results');
            
            const correctAnswers = {
                'introduction': ['b', 'c', 'c', 'b'],
                'installation': ['c', 'b', 'c', 'b'],
                'project-creation': ['b', 'c', 'b', 'b'],
                'models': ['b', 'b', 'a', 'c'],
                'views': ['b', 'b', 'b'],
                'templates': ['b', 'c', 'b'],
                'urls': ['c', 'a', 'b'],
                'forms': ['b', 'c', 'a'],
                'admin': ['c', 'b', 'a'],
                'users': ['b', 'a', 'c'],
                'migrations': ['a', 'c', 'b'],
                'rest-framework': ['b', 'c', 'a'],
                'testing': ['c', 'b', 'a'],
                'deployment': ['b', 'a', 'c'],
                'best-practices': ['c', 'b', 'a']
            };
            
            function getCorrectLabelText(question, answerValue) {
                const input = question.querySelector('input[type="radio"][value="' + answerValue + '"]');
                return input && input.parentElement ? input.parentElement.textContent.trim() : answerValue;
            }
            
            function clearFeedback() {
                questions.forEach((q) => {
                    q.classList.remove('question--correct', 'question--incorrect');
                    q.querySelectorAll('.options label').forEach((l) => l.classList.remove('option-correct', 'option-incorrect'));
                    const fb = q.querySelector('.feedback');
                    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
                });
                if (resultsDiv) { resultsDiv.textContent = ''; resultsDiv.className = 'quiz-results'; }
            }
            
            if (checkButton) {
                checkButton.addEventListener('click', function() {
                    const topic = quiz.getAttribute('data-topic');
                    const answers = correctAnswers[topic] || [];
                    const explanations = quizExplanations[topic] || [];
                    let correctCount = 0;
                    
                    clearFeedback();
                    
                    questions.forEach((question, index) => {
                        const selectedOption = question.querySelector('input[type="radio"]:checked');
                        const feedback = question.querySelector('.feedback');
                        const correctVal = answers[index];
                        const expl = explanations[index] || { right: '', wrong: '' };
                        const correctLabelText = getCorrectLabelText(question, correctVal);
                        
                        question.querySelectorAll('.options label').forEach((label) => {
                            label.classList.remove('option-correct', 'option-incorrect');
                            if (label.querySelector('input[type="radio"]').value === correctVal) {
                                label.classList.add('option-correct');
                            }
                        });
                        
                        if (!selectedOption) {
                            question.classList.add('question--incorrect');
                            feedback.innerHTML = '<strong>Ошибка:</strong> выберите ответ.';
                            feedback.className = 'feedback incorrect';
                        } else if (selectedOption.value === correctVal) {
                            correctCount++;
                            question.classList.add('question--correct');
                            feedback.innerHTML = '<strong>✓ Правильно.</strong><span class="feedback-detail"> ' + expl.right + '</span>';
                            feedback.className = 'feedback correct';
                        } else {
                            question.classList.add('question--incorrect');
                            const wrongLabel = selectedOption.parentElement;
                            if (wrongLabel) wrongLabel.classList.add('option-incorrect');
                            feedback.innerHTML = '<strong>✗ Неправильно.</strong> Правильный ответ: <strong>(' + correctVal + ')</strong> ' + correctLabelText + '.<span class="feedback-detail"> Пояснение: ' + expl.wrong + '</span>';
                            feedback.className = 'feedback incorrect';
                        }
                    });
                    
                    if (resultsDiv) {
                        resultsDiv.style.display = 'block';
                        if (correctCount === questions.length) {
                            resultsDiv.innerHTML = 'Отлично! Вы ответили правильно на все <strong>' + questions.length + '</strong> вопросов.';
                            resultsDiv.className = 'quiz-results success';
                        } else if (correctCount > 0) {
                            resultsDiv.innerHTML = 'Правильно <strong>' + correctCount + '</strong> из <strong>' + questions.length + '</strong>. Ошибки подсвечены ниже — прочитайте пояснения и попробуйте снова.';
                            resultsDiv.className = 'quiz-results partial';
                            const firstWrong = quiz.querySelector('.question--incorrect');
                            if (firstWrong) {
                                setTimeout(function() { firstWrong.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
                            }
                        } else {
                            resultsDiv.innerHTML = 'Пока ни одного верного ответа. Ниже указаны правильные ответы и пояснения — изучите их и нажмите «Проверить ответы» снова после исправления.';
                            resultsDiv.className = 'quiz-results fail';
                            const firstWrong = quiz.querySelector('.question--incorrect');
                            if (firstWrong) {
                                setTimeout(function() { firstWrong.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
                            }
                        }
                    }
                    
                    saveQuizProgress(topic, correctCount === questions.length);
                });
            }
            
            var resetBtn = resetButton || quiz.querySelector('.quiz-reset');
            if (!resetBtn && checkButton) {
                resetBtn = document.createElement('button');
                resetBtn.type = 'button';
                resetBtn.className = 'quiz-reset';
                resetBtn.textContent = 'Сбросить и попробовать снова';
                checkButton.parentNode.insertBefore(resetBtn, checkButton.nextSibling);
            }
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    clearFeedback();
                    questions.forEach((q) => {
                        const input = q.querySelector('input[type="radio"]:checked');
                        if (input) input.checked = false;
                    });
                });
            }
        });
    }
    
    // Сохранение прогресса тестов
    function saveQuizProgress(topic, completed) {
        const progress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
        progress[topic] = completed;
        localStorage.setItem('quizProgress', JSON.stringify(progress));
        updateProgress();
    }
    
    // Загрузка прогресса тестов
    function loadQuizProgress() {
        return JSON.parse(localStorage.getItem('quizProgress') || '{}');
    }
    
    // Поиск
    function performSearch(query) {
        query = query.toLowerCase();
        const results = [];
        
        // Поиск в шаблонах
        topics.forEach(topic => {
            const template = document.getElementById(`${topic}-template`);
            if (template) {
                const content = template.innerHTML.toLowerCase();
                if (content.includes(query)) {
                    const topicName = document.querySelector(`.topics li[data-topic="${topic}"]`).textContent;
                    results.push({ topic, name: topicName });
                }
            }
        });
        
        // Отображение результатов
        searchResults.innerHTML = '';
        if (results.length > 0) {
            results.forEach(result => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.textContent = result.name;
                item.addEventListener('click', function() {
                    loadTopic(result.topic);
                    searchResults.classList.remove('active');
                });
                searchResults.appendChild(item);
            });
            searchResults.classList.add('active');
        } else {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.textContent = 'Ничего не найдено';
            searchResults.appendChild(item);
            searchResults.classList.add('active');
        }
    }
    
    // Переключение темы
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        themeToggleBtn.textContent = isDarkTheme ? '☀️' : '🌙';
        localStorage.setItem('darkTheme', isDarkTheme);
    }
    
    // Загрузка сохраненной темы
    function loadSavedTheme() {
        const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = '☀️';
        }
    }
    
    // Обработчики событий
    
    // Клик по теме в сайдбаре
    topicLinks.forEach(link => {
        link.addEventListener('click', function() {
            const topicName = this.getAttribute('data-topic');
            loadTopic(topicName);
        });
    });
    
    // Кнопки навигации
    prevButton.addEventListener('click', function() {
        if (currentTopicIndex > 0) {
            loadTopic(topics[currentTopicIndex - 1]);
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentTopicIndex < topics.length - 1) {
            loadTopic(topics[currentTopicIndex + 1]);
        }
    });
    
    // Поиск
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
    
    // Закрытие результатов поиска при клике вне
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput && e.target !== searchButton) {
            searchResults.classList.remove('active');
        }
    });
    
    // Клик по логотипу — переход на первую тему
    const headerLogo = document.getElementById('header-logo');
    if (headerLogo) {
        headerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            loadTopic(topics[0]);
        });
    }
    
    // Переключение темы
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Переключатель языка RU / КЗ
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var lang = btn.getAttribute('data-lang');
            if (lang && lang !== LANG) {
                LANG = lang;
                localStorage.setItem('lang', LANG);
                applyLang();
                var cur = topics[currentTopicIndex];
                if (cur) loadTopic(cur);
            }
        });
    });
    
    // Мобильное меню: бургер в шапке (планшет/телефон) и в сайдбаре — одна и та же логика
    document.querySelectorAll('.mobile-menu-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    });
    
    // Сворачивание / раскрытие меню (десктоп), закрепление, вкладка «Открыть»
    var sidebarCollapseBtn = document.getElementById('sidebar-collapse');
    var sidebarPinBtn = document.getElementById('sidebar-pin');
    var sidebarOpenTab = document.getElementById('sidebar-open-tab');
    
    function applySidebarState() {
        var collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        var pinned = localStorage.getItem('sidebarPinned') === 'true';
        if (pinned) sidebar.classList.add('sidebar-pinned');
        else sidebar.classList.remove('sidebar-pinned');
        if (sidebarPinBtn) sidebarPinBtn.classList.toggle('active', pinned);
        if (window.innerWidth > 768) {
            if (collapsed) {
                sidebar.classList.add('sidebar-collapsed');
                if (sidebarOpenTab) { sidebarOpenTab.classList.add('visible'); sidebarOpenTab.style.display = 'flex'; }
            } else {
                sidebar.classList.remove('sidebar-collapsed');
                if (sidebarOpenTab) { sidebarOpenTab.classList.remove('visible'); sidebarOpenTab.style.display = 'none'; }
            }
        } else {
            sidebar.classList.remove('sidebar-collapsed');
            if (sidebarOpenTab) { sidebarOpenTab.classList.remove('visible'); sidebarOpenTab.style.display = 'none'; }
        }
    }
    
    applySidebarState();
    
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', function() {
            if (window.innerWidth <= 768) return;
            sidebar.classList.toggle('sidebar-collapsed');
            var collapsed = sidebar.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed ? 'true' : 'false');
            if (sidebarOpenTab) {
                if (collapsed) { sidebarOpenTab.classList.add('visible'); sidebarOpenTab.style.display = 'flex'; }
                else { sidebarOpenTab.classList.remove('visible'); sidebarOpenTab.style.display = 'none'; }
            }
        });
    }
    
    if (sidebarOpenTab) {
        sidebarOpenTab.addEventListener('click', function() {
            sidebar.classList.remove('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', 'false');
            sidebarOpenTab.classList.remove('visible');
            sidebarOpenTab.style.display = 'none';
        });
    }
    
    if (sidebarPinBtn) {
        sidebarPinBtn.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-pinned');
            var pinned = sidebar.classList.contains('sidebar-pinned');
            localStorage.setItem('sidebarPinned', pinned ? 'true' : 'false');
            sidebarPinBtn.classList.toggle('active', pinned);
        });
    }
    
    // Адаптация при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            applySidebarState();
        } else {
            sidebar.classList.remove('sidebar-collapsed');
            if (sidebarOpenTab) { sidebarOpenTab.classList.remove('visible'); sidebarOpenTab.style.display = 'none'; }
        }
    });
    
    // Симулятор терминала (виртуальная ФС + все команды из учебника + пояснения)
    var simulatorPanel = document.getElementById('simulator-panel');
    var simulatorToggle = document.getElementById('simulator-toggle');
    var simulatorClose = document.getElementById('simulator-close');
    var simulatorInput = document.getElementById('simulator-input');
    var simulatorOutput = document.getElementById('simulator-output');
    var simulatorPrompt = document.getElementById('simulator-prompt');
    
    var simState = {
        cwd: [],
        projects: {},
        apps: {},
        venvActive: false,
        venvName: ''
    };
    
    function simCwdStr() { return simState.cwd.length ? simState.cwd.join('/') : ''; }
    function simProjectName() { return simState.cwd[0] || ''; }
    
    function simulatorRunCommand(cmd) {
        cmd = cmd.trim();
        if (!cmd) return;
        var lineCmd = document.createElement('div');
        lineCmd.className = 'simulator-line-cmd';
        lineCmd.textContent = (simulatorPrompt.textContent || '$') + ' ' + cmd;
        simulatorOutput.appendChild(lineCmd);
        var out = getSimulatedOutput(cmd);
        if (out.parts && out.parts.length) {
            out.parts.forEach(function(p) {
                var lineOut = document.createElement('div');
                lineOut.className = p.className || 'simulator-line-out';
                lineOut.innerHTML = p.text;
                simulatorOutput.appendChild(lineOut);
            });
        } else {
            if (out.text !== undefined && out.text !== '') {
                var lineOut = document.createElement('div');
                lineOut.className = out.err ? 'simulator-line-err' : (out.success ? 'simulator-line-success' : 'simulator-line-out');
                lineOut.innerHTML = out.text;
                simulatorOutput.appendChild(lineOut);
            }
        }
        if (simulatorPrompt) {
            simulatorPrompt.textContent = simCwdStr() ? simCwdStr() + ' $ ' : '$ ';
        }
        simulatorOutput.scrollTop = simulatorOutput.scrollHeight;
    }
    
    function part(cls, text) { return { className: cls, text: text }; }
    
    function getSimulatedOutput(cmd) {
        var raw = cmd.replace(/\s+/g, ' ').trim();
        var c = raw.toLowerCase();
        var parts = [];
        
        if (c === 'clear' || c === 'cls') return { text: '', success: false };
        
        if (c === 'help' || c === '?') {
            return { text: 'Окружение:\n  python --version, python3 --version  — версия Python\n  python -m venv &lt;имя&gt;  — создать venv (папка с изолированными пакетами)\n  pip install django, pip list  — установка и список пакетов\n  python -m django --version  — версия Django\n\nПроект и приложения:\n  django-admin startproject &lt;имя&gt;  — корень проекта, manage.py, настройки\n  python manage.py startapp &lt;имя&gt;  — приложение (models, views, urls)\n\nСервер и БД:\n  python manage.py runserver [порт]  — запуск на 127.0.0.1\n  python manage.py migrate [app]  — применить миграции к БД\n  python manage.py makemigrations [app]  — создать файлы миграций\n  python manage.py showmigrations [app]  — список миграций\n  python manage.py sqlmigrate &lt;app&gt; &lt;номер&gt;  — показать SQL миграции\n\nПользователи и админка:\n  python manage.py createsuperuser  — суперпользователь для /admin/\n\nПрочее:\n  python manage.py shell  — интерактивная консоль с моделями\n  python manage.py test [app]  — запуск тестов\n  python manage.py collectstatic  — собрать статику в одну папку\n\nНавигация (симуляция):\n  cd &lt;папка&gt;, cd ..  — перейти; dir / ls  — список файлов\n  clear / cls  — очистить экран', success: false };
        }
        
        if (c === 'python --version' || c === 'python3 --version') {
            parts.push(part('simulator-line-success', 'Python 3.11.6'));
            parts.push(part('simulator-line-info', '→ Наличие 3.8+ обязательно для Django. На Windows при установке отметьте «Add Python to PATH».'));
            return { parts: parts };
        }
        
        if (c === 'python -m django --version') {
            parts.push(part('simulator-line-success', '5.0'));
            parts.push(part('simulator-line-info', '→ Версия установленного Django. Выполняйте после pip install django.'));
            return { parts: parts };
        }
        
        if (c === 'pip install django' || /^pip install django(\s|==|$)/.test(c)) {
            parts.push(part('simulator-line-out', 'Collecting django\n  Downloading Django-5.0.1-py3-none-any.whl\nInstalling collected packages: django\nSuccessfully installed django-5.0.1'));
            parts.push(part('simulator-line-info', '→ Django установлен в текущее окружение (система или venv). Дальше: django-admin startproject.'));
            return { parts: parts };
        }
        if (c === 'pip install djangorestframework') {
            parts.push(part('simulator-line-out', 'Successfully installed djangorestframework-3.14.0'));
            parts.push(part('simulator-line-info', '→ DRF для REST API. Добавьте \'rest_framework\' в INSTALLED_APPS.'));
            return { parts: parts };
        }
        if (c === 'pip install pillow') {
            parts.push(part('simulator-line-out', 'Successfully installed Pillow-10.1.0'));
            parts.push(part('simulator-line-info', '→ Для ImageField в моделях (загрузка изображений).'));
            return { parts: parts };
        }
        if (c === 'pip install django-debug-toolbar' || c === 'pip install django-extensions') {
            parts.push(part('simulator-line-out', 'Successfully installed ' + (c.indexOf('toolbar') !== -1 ? 'django-debug-toolbar' : 'django-extensions')));
            parts.push(part('simulator-line-info', '→ Подключите в settings и urls (см. документацию пакета).'));
            return { parts: parts };
        }
        if (c === 'pip install psycopg2') {
            parts.push(part('simulator-line-out', 'Successfully installed psycopg2-binary'));
            parts.push(part('simulator-line-info', '→ Драйвер PostgreSQL для БД. В settings: ENGINE \'django.db.backends.postgresql\'.'));
            return { parts: parts };
        }
        if (c === 'pip list' || c.startsWith('pip list')) {
            parts.push(part('simulator-line-out', 'django\t5.0.1\npip\t23.3.1\nsetuptools\t68.0.0'));
            return { parts: parts };
        }
        
        if (/^python -m venv\s+\w+/.test(c) || c === 'python -m venv venv' || c === 'python3 -m venv venv') {
            var venvName = (raw.match(/venv\s+(\w+)/i) || [])[1] || 'venv';
            parts.push(part('simulator-line-success', ''));
            parts.push(part('simulator-line-info', '→ Создана папка ' + venvName + '/ с Python и pip. Активация: ' + venvName + '\\Scripts\\activate (Windows) или source ' + venvName + '/bin/activate (macOS/Linux). После активации pip install django ставит пакеты только в это окружение.'));
            return { parts: parts };
        }
        
        if (/^django-admin startproject\s+\w+/.test(c)) {
            var name = (raw.match(/startproject\s+(\w+)/i) || [])[1] || 'myproject';
            simState.projects[name] = true;
            var tree = name + '/\n  ' + name + '/\n    __init__.py   ← пакет Python\n    asgi.py        ← ASGI для асинхронного сервера\n    settings.py   ← настройки (БД, INSTALLED_APPS, SECRET_KEY)\n    urls.py        ← корневая маршрутизация URL\n    wsgi.py        ← WSGI для развёртывания\n  manage.py       ← скрипт для runserver, migrate, startapp и др.';
            parts.push(part('simulator-line-success', tree));
            parts.push(part('simulator-line-info', '→ Дальше: cd ' + name + ', затем python manage.py runserver или python manage.py startapp myapp.'));
            return { parts: parts };
        }
        
        if (/^python manage\.py startapp\s+\w+/.test(c)) {
            var app = (raw.match(/startapp\s+(\w+)/i) || [])[1] || 'myapp';
            var proj = simProjectName() || 'myproject';
            if (!simState.apps[proj]) simState.apps[proj] = [];
            simState.apps[proj].push(app);
            var tree = 'Созданы файлы и папки:\n' + app + '/\n  __init__.py\n  admin.py     ← регистрация моделей в админке\n  apps.py      ← конфиг приложения\n  models.py    ← модели (таблицы БД)\n  views.py     ← функции/классы представлений\n  tests.py     ← тесты\n  migrations/  ← папка с миграциями (появится после makemigrations)';
            parts.push(part('simulator-line-success', tree));
            parts.push(part('simulator-line-info', '→ Добавьте \'' + app + '\' в INSTALLED_APPS в settings.py. Затем опишите модели в ' + app + '/models.py и выполните makemigrations, migrate.'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py runserver' || /^python manage\.py runserver(\s+\d+)?$/.test(c)) {
            var port = (raw.match(/runserver\s+(\d+)/i) || [])[1] || '8000';
            parts.push(part('simulator-line-out', 'Watching for file changes with StatReloader\nPerforming system checks...\nSystem check identified no issues (0 silenced).\nDjango version 5.0, using settings \'myproject.settings\'\nStarting development server at http://127.0.0.1:' + port + '/\nQuit the server with CTRL-BREAK.'));
            parts.push(part('simulator-line-info', '→ Откройте в браузере http://127.0.0.1:' + port + '/ — увидите страницу «The install worked successfully!».'));
            return { parts: parts };
        }
        if (/^python manage\.py runserver\s+[\d.]+:\d+/.test(c)) {
            parts.push(part('simulator-line-out', 'Starting development server at http://0.0.0.0:8000/\nQuit the server with CTRL-BREAK.'));
            parts.push(part('simulator-line-info', '→ 0.0.0.0 — доступ с других устройств в сети (порт 8000).'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py migrate') {
            parts.push(part('simulator-line-out', 'Operations to perform:\n  Apply all migrations: admin, auth, contenttypes, sessions\nRunning migrations:\n  Applying contenttypes.0001_initial... OK\n  Applying auth.0001_initial... OK\n  Applying admin.0001_initial... OK\n  Applying sessions.0001_initial... OK'));
            parts.push(part('simulator-line-info', '→ Миграции создают/обновляют таблицы в БД. Выполняйте после makemigrations или после первого startproject.'));
            return { parts: parts };
        }
        if (/^python manage\.py migrate\s+\w+/.test(c)) {
            var app = (raw.match(/migrate\s+(\w+)/i) || [])[1];
            parts.push(part('simulator-line-out', 'Running migrations:\n  Applying myapp.0001_initial... OK'));
            parts.push(part('simulator-line-info', '→ Применены только миграции приложения ' + (app || 'myapp') + '. Для отката: migrate ' + (app || 'myapp') + ' zero или migrate ' + (app || 'myapp') + ' 0001_initial.'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py makemigrations') {
            parts.push(part('simulator-line-out', 'No changes detected'));
            parts.push(part('simulator-line-info', '→ Django сравнивает models.py с миграциями. Если модели не менялись или уже есть миграция — выведет это. Укажите имя приложения: makemigrations myapp.'));
            return { parts: parts };
        }
        if (/^python manage\.py makemigrations\s+\w+/.test(c)) {
            var app = (raw.match(/makemigrations\s+(\w+)/i) || [])[1] || 'myapp';
            parts.push(part('simulator-line-out', 'Migrations for \'' + app + '\':\n  ' + app + '/migrations/0001_initial.py\n    - Create model Article'));
            parts.push(part('simulator-line-info', '→ Создан файл миграции. В нём — операции для БД (Create model, AddField и т.д.). Дальше: python manage.py migrate.'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py showmigrations' || /^python manage\.py showmigrations\s+\w+/.test(c)) {
            parts.push(part('simulator-line-out', 'admin\n [X] 0001_initial\n [X] 0002_logentry_alter_field...\nauth\n [X] 0001_initial\n [X] 0002_alter_permission_name_max_length\n...\nmyapp\n [ ] 0001_initial   ← [ ] значит не применена'));
            parts.push(part('simulator-line-info', '→ [X] — миграция применена, [ ] — нет. Применить: migrate; откатить: migrate app_name 0001_initial.'));
            return { parts: parts };
        }
        if (/^python manage\.py sqlmigrate\s+\w+\s+\d+/.test(c)) {
            parts.push(part('simulator-line-out', 'BEGIN;\nCREATE TABLE "myapp_article" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "title" varchar(200) NOT NULL, "content" text NOT NULL, "created_at" datetime NOT NULL);\nCOMMIT;'));
            parts.push(part('simulator-line-info', '→ SQL, который выполнит migrate для этой миграции. Полезно для отладки.'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py createsuperuser') {
            parts.push(part('simulator-line-out', 'Username: admin\nEmail: admin@example.com\nPassword: ********\nPassword (again): ********\nSuperuser created successfully.'));
            parts.push(part('simulator-line-info', '→ Этот пользователь может войти на /admin/ и управлять данными. Пароль вводится без отображения.'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py shell') {
            parts.push(part('simulator-line-out', 'Python 3.11.6 on win32\nType "help", "copyright", "credits" or "license" for more information.\n(InteractiveConsole)\n>>>'));
            parts.push(part('simulator-line-info', '→ Импортируйте модели (from myapp.models import Article) и работайте с БД: Article.objects.all(), .create(), .filter() и т.д.'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py test' || /^python manage\.py test(\s+\w+)?(\s+[\w.]+)?$/.test(c)) {
            var app = (raw.match(/test\s+(\w+)/i) || [])[1];
            parts.push(part('simulator-line-out', 'Creating test database for alias \'default\'...\nSystem check identified no issues (0 silenced).\nRan 3 tests in 0.042s\nOK'));
            parts.push(part('simulator-line-info', '→ Создаётся временная БД, запускаются тесты из tests.py (классы TestCase). Можно указать приложение: test myapp или конкретный класс/метод.'));
            return { parts: parts };
        }
        
        if (c === 'python manage.py collectstatic') {
            parts.push(part('simulator-line-out', 'Copying \'/static/css/style.css\'\nCopying \'/static/js/app.js\'\n\n2 static files copied to \'C:/deploy/staticfiles\'.'));
            parts.push(part('simulator-line-info', '→ Все файлы из STATIC_URL собираются в STATIC_ROOT. На сервере Nginx/другой веб-сервер раздаёт эту папку.'));
            return { parts: parts };
        }
        
        if (c === 'cd' || c === 'cd .') {
            parts.push(part('simulator-line-out', simCwdStr() || '(корень)'));
            return { parts: parts };
        }
        if (/^cd\s+\.\.\s*$/.test(c)) {
            if (simState.cwd.length > 0) simState.cwd.pop();
            parts.push(part('simulator-line-out', simCwdStr() || '(корень)'));
            return { parts: parts };
        }
        if (/^cd\s+\w+/.test(c)) {
            var dir = (raw.match(/cd\s+(\w+)/i) || [])[1];
            if (simState.cwd.length === 0 && simState.projects[dir]) {
                simState.cwd = [dir];
            } else if (simState.cwd.length === 1 && simState.apps[simProjectName()] && simState.apps[simProjectName()].indexOf(dir) !== -1) {
                simState.cwd = [simProjectName(), dir];
            } else if (simState.cwd.length === 0) {
                var found = false;
                for (var p in simState.projects) {
                    if (simState.apps[p] && simState.apps[p].indexOf(dir) !== -1) {
                        simState.cwd = [p, dir];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    parts.push(part('simulator-line-err', 'Папка не найдена. Создайте проект: django-admin startproject &lt;имя&gt; или приложение: python manage.py startapp &lt;имя&gt;.'));
                    return { parts: parts };
                }
            } else {
                parts.push(part('simulator-line-err', 'Папка не найдена.'));
                return { parts: parts };
            }
            parts.push(part('simulator-line-out', simCwdStr()));
            return { parts: parts };
        }
        
        if (c === 'dir' || c === 'ls' || c === 'ls -la' || c === 'ls -l') {
            var base = simCwdStr();
            var listing = '';
            if (!base) {
                var projList = Object.keys(simState.projects);
                var appList = projList.length ? (simState.apps[projList[0]] || []) : [];
                listing = 'manage.py   ' + (projList.length ? projList[0] + '/   ' + appList.join('/   ') + (appList.length ? '   ' : '') : '') + 'venv/\n\n→ В корне проекта: manage.py, папка проекта (настройки), папки приложений, venv (если создавали).';
            } else if (simState.cwd.length === 1) {
                listing = '__init__.py   asgi.py   settings.py   urls.py   wsgi.py\n\n→ Внутри папки проекта: настройки (settings.py), маршруты (urls.py), ASGI/WSGI.';
            } else if (simState.cwd.length === 2) {
                listing = '__init__.py   admin.py   apps.py   models.py   views.py   tests.py   migrations/\n\n→ Приложение: models.py — модели, views.py — представления, admin.py — регистрация в админке, migrations/ — файлы миграций.';
            } else {
                listing = '(пусто или неизвестная папка)';
            }
            parts.push(part('simulator-line-out', listing));
            return { parts: parts };
        }
        
        return { text: 'Команда не распознана. Введите <strong>help</strong> — список доступных команд с пояснениями.', err: true };
    }
    
    if (simulatorToggle) {
        simulatorToggle.addEventListener('click', function() {
            simulatorPanel.classList.toggle('is-open');
            simulatorPanel.setAttribute('aria-hidden', simulatorPanel.classList.contains('is-open') ? 'false' : 'true');
            if (simulatorPanel.classList.contains('is-open')) simulatorInput.focus();
        });
    }
    if (simulatorClose) {
        simulatorClose.addEventListener('click', function() {
            simulatorPanel.classList.remove('is-open');
            simulatorPanel.setAttribute('aria-hidden', 'true');
        });
    }
    if (simulatorInput && simulatorOutput) {
        simulatorInput.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            var cmd = this.value;
            this.value = '';
            if (cmd.trim().toLowerCase() === 'clear' || cmd.trim().toLowerCase() === 'cls') {
                simulatorOutput.innerHTML = '';
                return;
            }
            simulatorRunCommand(cmd);
        });
    }
    
    // Инициализация: восстанавливаем последнюю открытую тему
    applyLang();
    loadSavedTheme();
    (function initTopic() {
        var lastTopic = localStorage.getItem('lastTopic');
        if (lastTopic && topics.indexOf(lastTopic) !== -1) {
            loadTopic(lastTopic);
        } else {
            loadTopic(topics[0]);
        }
    })();
});