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
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    // Текущая тема
    let currentTopicIndex = 0;
    const topics = Array.from(topicLinks).map(link => link.getAttribute('data-topic'));
    
    // Загрузка темы
    function loadTopic(topicName) {
        const template = document.getElementById(`${topicName}-template`);
        if (template) {
            topicContent.innerHTML = template.innerHTML;
            
            // Инициализация подсветки синтаксиса для нового контента
            topicContent.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
            
            // Инициализация вкладок
            initTabs();
            
            // Инициализация тестов
            initQuizzes();
            
            // Обновление активной темы в сайдбаре
            topicLinks.forEach(link => {
                if (link.getAttribute('data-topic') === topicName) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Обновление индекса текущей темы
            currentTopicIndex = topics.indexOf(topicName);
            
            // Обновление кнопок навигации
            updateNavigationButtons();
            
            // Обновление прогресса
            updateProgress();
            
            // Прокрутка вверх
            window.scrollTo(0, 0);
            
            // Закрытие мобильного меню после выбора темы
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        }
    }
    
    // Обновление кнопок навигации
    function updateNavigationButtons() {
        prevButton.disabled = currentTopicIndex === 0;
        nextButton.disabled = currentTopicIndex === topics.length - 1;
    }
    
    // Обновление прогресса
    function updateProgress() {
        const progress = ((currentTopicIndex + 1) / topics.length) * 100;
        progressIndicator.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% завершено`;
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
    
    // Инициализация тестов
    function initQuizzes() {
        const quizzes = document.querySelectorAll('.quiz');
        
        quizzes.forEach(quiz => {
            const checkButton = quiz.querySelector('.check-answers');
            const questions = quiz.querySelectorAll('.question');
            const resultsDiv = quiz.querySelector('.quiz-results');
            
            // Правильные ответы для каждой темы
            const correctAnswers = {
                'introduction': ['b', 'c', 'c'],
                'installation': ['c', 'b', 'c'],
                'project-creation': ['b', 'c', 'b'],
                'models': ['b', 'b', 'a'],
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
            
            if (checkButton) {
                checkButton.addEventListener('click', function() {
                    const topic = quiz.getAttribute('data-topic');
                    const answers = correctAnswers[topic] || [];
                    let correctCount = 0;
                    
                    questions.forEach((question, index) => {
                        const selectedOption = question.querySelector('input[type="radio"]:checked');
                        const feedback = question.querySelector('.feedback');
                        
                        if (selectedOption) {
                            if (selectedOption.value === answers[index]) {
                                feedback.textContent = 'Правильно!';
                                feedback.className = 'feedback correct';
                                correctCount++;
                            } else {
                                feedback.textContent = 'Неправильно. Попробуйте еще раз.';
                                feedback.className = 'feedback incorrect';
                            }
                        } else {
                            feedback.textContent = 'Выберите ответ.';
                            feedback.className = 'feedback incorrect';
                        }
                    });
                    
                    // Отображение результатов
                    if (resultsDiv) {
                        if (correctCount === questions.length) {
                            resultsDiv.textContent = `Отлично! Вы ответили правильно на все ${questions.length} вопросов.`;
                            resultsDiv.className = 'quiz-results success';
                        } else if (correctCount > 0) {
                            resultsDiv.textContent = `Вы ответили правильно на ${correctCount} из ${questions.length} вопросов.`;
                            resultsDiv.className = 'quiz-results partial';
                        } else {
                            resultsDiv.textContent = 'Вы не ответили правильно ни на один вопрос. Попробуйте еще раз.';
                            resultsDiv.className = 'quiz-results fail';
                        }
                    }
                    
                    // Сохранение прогресса в localStorage
                    saveQuizProgress(topic, correctCount === questions.length);
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
    
    // Мобильное меню
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Адаптация при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });
    
    // Инициализация
    loadSavedTheme();
    loadTopic(topics[0]);
});