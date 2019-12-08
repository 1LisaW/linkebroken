FROM registry.access.redhat.com/ubi8/nodejs-10:1

# для nodejs первоначально копируем файлы, которые отвечают за установку зависимых пакетов.
# т.к. зависимые пакеты меняются реже, чем код, это позволит ускорить сборку
COPY .npmrc .
COPY package.json .
COPY package-lock.json .
 
# запускаем установку зависимых пакетов
RUN npm ci
 
# копируем на исходный код
COPY . .

RUN npm run build

ENV TZ=Europe/Moscow

EXPOSE 8080

ENTRYPOINT []
CMD ["npm", "start"]
