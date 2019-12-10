# Чекалка сломанных ссылок

Мини-интерфейс для проверки редиректов и сломанных ссылок

[В опеншифте](http://linkebroken.utm.sigma.sbrf.ru/)

Т.к. Openshift не имеет доступ вовне, сервер стартует с `DISABLE_EXTERNAL=1`
с отключенной проверкой всех внешних ссылок. Если требуется более глубокая проверка,
пока есть возможность запустить только локально.

С не-master раскатывается на [тестовый стенд](http://linkebroken-test.utm.sigma.sbrf.ru/)

Также можно держать ссылку сразу на нужную ссылку `/?depth=-1&url=https://www.sberbank-ru.ift.sberbank.ru/ru/person`.

Сам кроулинг linkinator'а не используется, т.к. может зависать на редиректах пока что.

Авторы linkinator пока не хотят изменений по style / data-атрибутам, поэтому
используем форк `linkinator-css-edition`.

## TODO

- запуск демо одной командой
- В параллель несколько ссылок?
- Вылавливать относительные ссылки на страницах (!)
- http картинки помечать? (несекьюрные)
- Группировать одинаковые ссылки (одинаковые на всех страницах)
- Не дергать одинаковые ссылки каждый раз (как стейт при этом шарить?)
- Быстрая фильтрация по результатам

## Демо-режим

Запуск сборки фронтенда в демо-режиме на `http://localhost:7777`

    npm run dev:front

Запуск эмуляции бэкенда (пока не одной командой)

    npm run dev:back

Последний так же может получать настройки как из env-переменных, так и `.env`.


### На сервере

Собираем статику, запускаем сервер, который реализуета API и хостит статику.

    npm run build
    npm run start

Helm-чарт и Jenkinsfile описывает, как подняться.

### Версионирование

- **Для фиксов**: `npm version patch`: v0.0.1 => v0.0.2
- **Для фич**: `npm version minor`: v0.0.2 => v0.1.0
- **Релиз**: `npm version major`: v1.0.0-rc.1 => v1.0.0
