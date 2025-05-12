document.addEventListener('DOMContentLoaded', function() {
    // Объявление hljs
    const hljs = window.hljs;

    // Инициализация подсветки синтаксиса
    hljs.highlightAll();

    // Переменные
    const sidebar = document.getElementById('sidebar');
    const topicLinks = document.querySelectorAll('.topics li');
    const topicContent = document.getElementById('topic-content');
    const prevButton = document.getElementById('prev-topic');
    const nextButton = document.getElementById('next-topic');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const progressIndicator = document.getElementById('progress-indicator');
    const progressText = document.getElementById('progress-text');

    // Темы
    const topics = [
        'introduction',
        'installation',
        'project-creation',
        'models',
        'views',
        'templates',
        'urls',
        'forms',
        'admin',
        'users',
        'migrations',
        'rest-framework',
        'testing',
        'deployment',
        'best-practices'
    ];

    // Текущая тема
    let currentTopicIndex = 0;

    // Прогресс
    let completedTopics = JSON.parse(localStorage.getItem('completedTopics')) || [];
    updateProgress();

    // Загрузка темы
    function loadTopic(topicId) {
        const template = document.getElementById(`${topicId}-template`);
        
        if (template) {
            topicContent.innerHTML = template.innerHTML;
            
            // Инициализация подсветки синтаксиса для нового контента
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
            
            // Инициализация вкладок
            initTabs();
            
            // Инициализация тестов
            initQuizzes();
            
            // Отметка темы как прочитанной
            if (!completedTopics.includes(topicId)) {
                completedTopics.push(topicId);
                localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
                updateProgress();
            }
        } else {
            topicContent.innerHTML = '<div class="warning-box"><h3>Тема в разработке</h3><p>Эта тема находится в разработке и будет доступна в ближайшее время.</p></div>';
        }
        
        // Обновление активной темы в меню
        topicLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.topic === topicId) {
                link.classList.add('active');
            }
        });
        
        // Обновление кнопок навигации
        currentTopicIndex = topics.indexOf(topicId);
        prevButton.disabled = currentTopicIndex === 0;
        nextButton.disabled = currentTopicIndex === topics.length - 1;
        
        // Прокрутка к началу контента
        topicContent.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Инициализация вкладок
    function initTabs() {
        const tabHeaders = document.querySelectorAll('.tab-header');
        
        tabHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                const tabContainer = this.closest('.tabs');
                
                // Деактивация всех вкладок
                tabContainer.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
                tabContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Активация выбранной вкладки
                this.classList.add('active');
                tabContainer.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
            });
        });
        
        // Инициализация вложенных вкладок
        const subTabHeaders = document.querySelectorAll('.sub-tabs .tab-header');
        
        subTabHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                e.stopPropagation(); // Предотвращаем всплытие события
                
                const tabId = this.dataset.tab;
                const tabContainer = this.closest('.sub-tabs');
                
                // Деактивация всех вкладок
                tabContainer.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
                tabContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Активация выбранной вкладки
                this.classList.add('active');
                tabContainer.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
            });
        });
    }
    
    // Инициализация тестов
    function initQuizzes() {
        const quizzes = document.querySelectorAll('.quiz');
        
        quizzes.forEach(quiz => {
            const checkButton = quiz.querySelector('.check-answers');
            const questions = quiz.querySelectorAll('.question');
            const resultsDiv = quiz.querySelector('.quiz-results');
            const topicId = quiz.dataset.topic;
            
            checkButton.addEventListener('click', function() {
                let correctCount = 0;
                
                questions.forEach((question, index) => {
                    const selectedOption = question.querySelector('input[type="radio"]:checked');
                    const feedbackDiv = question.querySelector('.feedback');
                    
                    if (selectedOption) {
                        // Проверка ответов (правильные ответы захардкожены для примера)
                        const correctAnswers = {
                            'introduction': ['b', 'c', 'c'],
                            'installation': ['c', 'b', 'c'],
                            'project-creation': ['b', 'c', 'b']
                        };
                        
                        const isCorrect = selectedOption.value === correctAnswers[topicId][index];
                        
                        if (isCorrect) {
                            feedbackDiv.textContent = 'Правильно!';
                            feedbackDiv.className = 'feedback correct';
                            correctCount++;
                        } else {
                            feedbackDiv.textContent = 'Неправильно. Попробуйте еще раз.';
                            feedbackDiv.className = 'feedback incorrect';
                        }
                    } else {
                        feedbackDiv.textContent = 'Пожалуйста, выберите ответ.';
                        feedbackDiv.className = 'feedback';
                    }
                });
                
                // Отображение результатов
                const totalQuestions = questions.length;
                const percentage = Math.round((correctCount / totalQuestions) * 100);
                
                resultsDiv.textContent = `Результат: ${correctCount} из ${totalQuestions} (${percentage}%)`;
                
                // Если все ответы правильные, отмечаем тему как завершенную
                if (correctCount === totalQuestions && !completedTopics.includes(topicId)) {
                    completedTopics.push(topicId);
                    localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
                    updateProgress();
                }
            });
        });
    }
    
    // Обновление прогресса
    function updateProgress() {
        const totalTopics = topics.length;
        const completedCount = completedTopics.length;
        const percentage = Math.round((completedCount / totalTopics) * 100);
        
        progressIndicator.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% завершено`;
    }
    
    // Обработчики событий
    
    // Клик по теме в меню
    topicLinks.forEach(link => {
        link.addEventListener('click', function() {
            const topicId = this.dataset.topic;
            loadTopic(topicId);
            
            // Закрываем мобильное меню
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
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
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        // Очистка результатов поиска
        searchResults.innerHTML = '';
        
        // Поиск по темам
        let resultsFound = false;
        
        topicLinks.forEach(link => {
            const topicText = link.textContent.toLowerCase();
            
            if (topicText.includes(query)) {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.textContent = link.textContent;
                resultItem.dataset.topic = link.dataset.topic;
                
                resultItem.addEventListener('click', function() {
                    loadTopic(this.dataset.topic);
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
                
                searchResults.appendChild(resultItem);
                resultsFound = true;
            }
        });
        
        if (resultsFound) {
            searchResults.classList.add('active');
        } else {
            searchResults.classList.remove('active');
        }
    });
    
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        
        if (query.length < 2) {
            return;
        }
        
        // Поиск первого совпадения и переход к нему
        for (const link of topicLinks) {
            const topicText = link.textContent.toLowerCase();
            
            if (topicText.includes(query)) {
                loadTopic(link.dataset.topic);
                searchResults.classList.remove('active');
                searchInput.value = '';
                break;
            }
        }
    });
    
    // Закрытие результатов поиска при клике вне
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.classList.remove('active');
        }
    });
    
    // Переключение темы
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Обновление иконки
        this.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
    
    // Мобильное меню
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Закрытие мобильного меню при клике вне
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && e.target !== mobileMenuToggle) {
            sidebar.classList.remove('active');
        }
    });
    
    // Инициализация темы из localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
    }
    
    // Загрузка начальной темы
    loadTopic(topics[currentTopicIndex]);
    
    // Обработка клавиатурных сокращений
    document.addEventListener('keydown', function(e) {
        // Alt + стрелка влево - предыдущая тема
        if (e.altKey && e.key === 'ArrowLeft' && !prevButton.disabled) {
            prevButton.click();
        }
        
        // Alt + стрелка вправо - следующая тема
        if (e.altKey && e.key === 'ArrowRight' && !nextButton.disabled) {
            nextButton.click();
        }
        
        // Ctrl + F - фокус на поиск
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
    });
});