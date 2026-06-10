# ADR — Действие при инциденти с опасни товари

Електронен справочник за опасни материали, предназначен за подпомагане на первоначалните действия при транспортни инциденти с опасни товари. Приложението се основава на данни и указания в съответствие с **Emergency Response Guidebook (ERG)** и **ADR** (Европейска спогодба за международен превоз на опасни товари по шосе).

---

## Правна информация и задължения (Disclaimer)

### Основа на данните

Настоящото приложение използва данни и методология, изведени от **Emergency Response Guidebook (ERG)** — ръководство, публикувано съвместно от:

- **U.S. Department of Transportation / Pipeline and Hazardous Materials Safety Administration (PHMSA)**
- **Transport Canada**
- **Secretaría de Infraestructura, Comunicaciones y Transportes (SICT)** (Мексико)

ERG се актуализира на всеки четири години. Препоръчва се използването на най-новото издание. Текущото е **ERG 2024**.

Приложението включва също информация съобразена с разпоредбите на **ADR 2025** (Европейска спогодба за международен превоз на опасни товари по шосе) и свързаното европейско и национално законодателство.

### Ограничение на отговорността

> **ВАЖНО:** Настоящото приложение е разработено **единствено с информационна цел**. То не замества официалните ръководства, законодателни актове, специализираното обучение или решенията на компетентните органи.

- Информацията в приложението не представлява официален нормативен акт или задължителна инструкция.
- При реален инцидент с опасни товари незабавно уведомете **спасителните служби (112)** и следвайте указанията на компетентните органи.
- Авторите и операторите на приложението **не носят отговорност** за щети, наранявания или смърт, настъпили в резултат на използване или неправилно тълкуване на данните в него.
- Таблата с номера на ООН, кодовете на опасност и инструкциите са предоставени като ориентировъчна информация и могат да не отразяват последната нормативна актуализация.

### Авторски права

ERG е публикация на правителствени агенции и е свободно достъпна за ползване. Допълнителните данни, структурата на приложението, потребителският интерфейс и кодът са обект на авторско право на разработчика. Съдържанието, пряко производно от ERG или ADR, се предоставя в съответствие с условията на съответните издателски правила.

### Задължения на потребителя

Потребителят е длъжен:
1. Да използва приложението само като допълнителен информационен инструмент, а не като единствен източник при вземане на решения в кризисни ситуации.
2. Да поддържа актуална версия на официалния ERG и ADR в хартиен или официален електронен вид.
3. Да е преминал съответното обучение съгласно приложимото законодателство (напр. ADR удостоверение за превозвач/водач).
4. Да докладва неточности чрез страницата с проблеми в хранилището на проекта.

---

## Изисквания

- **Node.js** v18 или по-нова версия
- **MongoDB** v6 или по-нова версия
- **npm** v9 или по-нова версия

---

## Инсталация — Linux сървър

### 1. Инсталиране на зависимости

```bash
# Ubuntu / Debian
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git

# Инсталиране на Node.js 22.x (LTS) чрез NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка
node -v && npm -v

# Инсталиране на MongoDB 8.x
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
  sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/8.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

### 2. Клониране на проекта

```bash
git clone https://github.com/bbbnova/ADR.git
cd ADR
npm ci
```

### 3. Конфигуриране на среда

Създайте файл `.env` в основната директория на проекта:

```env
PORT=3001
DATABASE_URL=mongodb://127.0.0.1:27017/adr
NODE_ENV=production
TOKEN_PASSWORD=сменете_с_произволен_таен_низ
SECRET_KEY=сменете_с_произволен_таен_низ
```

> Генерирайте сигурни стойности с: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Зареждане на базата данни

Базата данни се доставя като компресиран архив (`adr_04-04-2026.gz`), създаден с `mongodump --gzip --archive`.

```bash
mongorestore --uri="mongodb://127.0.0.1:27017" --gzip --archive=adr_04-04-2026.gz
```

### 5. Стартиране (без PM2)

```bash
node server.js
```

### 6. Стартиране с PM2 (препоръчително за продукция)

```bash
# Инсталиране на PM2
npm install -g pm2

# Стартиране
pm2 start server.js --name adr

# Автоматично стартиране при рестарт на сървъра
pm2 startup
pm2 save
```

### 7. Настройка на Nginx (обратен прокси, по избор)

```nginx
server {
    listen 80;
    server_name вашият-домейн.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo apt install -y nginx
# Поставете конфигурацията в /etc/nginx/sites-available/adr
sudo ln -s /etc/nginx/sites-available/adr /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Инсталация — Windows сървър

### 1. Инсталиране на зависимости

1. Изтеглете и инсталирайте **Node.js 22 LTS** от [nodejs.org](https://nodejs.org/).
2. Изтеглете и инсталирайте **MongoDB Community Server** от [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
   - По време на инсталацията изберете „Install MongoDB as a Service".
3. Инсталирайте **Git** от [git-scm.com](https://git-scm.com/).

### 2. Клониране на проекта

Отворете **PowerShell** или **Git Bash** и изпълнете:

```powershell
git clone https://github.com/bbbnova/ADR.git
cd ADR
npm ci
```

### 3. Конфигуриране на среда

Създайте файл `.env` в основната директория:

```env
PORT=3001
DATABASE_URL=mongodb://127.0.0.1:27017/adr
NODE_ENV=production
TOKEN_PASSWORD=сменете_с_произволен_таен_низ
SECRET_KEY=сменете_с_произволен_таен_низ
```

> Генерирайте сигурни стойности в PowerShell:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4. Зареждане на базата данни

Базата данни се доставя като компресиран архив (`adr_04-04-2026.gz`), създаден с `mongodump --gzip --archive`.

```powershell
mongorestore --gzip --archive=adr_04-04-2026.gz
```

> Уверете се, че `mongorestore` е в системния `PATH`. Инструментът се инсталира заедно с **MongoDB Database Tools** от [mongodb.com/try/download/database-tools](https://www.mongodb.com/try/download/database-tools).

### 5. Стартиране (без PM2)

```powershell
node .\server.js
```

### 6. Стартиране с PM2

```powershell
npm install -g pm2
npm install -g pm2-windows-startup
pm2 start server.js --name adr
pm2-startup install
pm2 save
```

### 7. Настройка на IIS като обратен прокси (по избор)

1. Инсталирайте **IIS** от „Turn Windows features on or off".
2. Инсталирайте **URL Rewrite** и **Application Request Routing (ARR)** за IIS.
3. Конфигурирайте ARR прокси към `http://localhost:3001`.

Алтернативно — отворете порт 3001 в защитната стена:

```powershell
New-NetFirewallRule -DisplayName "ADR App" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

---

## Инсталация — Docker контейнер

### Предварителни изисквания

- **Docker** v24 или по-нова версия
- **Docker Compose** v2 или по-нова версия (включен в Docker Desktop)

### 1. Клониране и конфигуриране

```bash
git clone https://github.com/bbbnova/ADR.git
cd ADR
```

Създайте файловете с тайни:

```bash
echo "сменете_с_произволен_таен_низ" > token_password.txt
echo "сменете_с_произволен_таен_низ" > secret_key.txt
```

> **Никога** не добавяйте `token_password.txt` и `secret_key.txt` към git. Уверете се, че са изброени в `.gitignore`.

### 2. Настройка на `docker-compose.yaml`

По подразбиране приложението очаква MongoDB на адрес `mongodb://mongo_db:27017/adr` (вътрешна мрежа). Ако MongoDB работи на отделен контейнер или сървър, актуализирайте `DATABASE_URL` в `docker-compose.yaml`.

В текущия файл услугата `mongo_db` вече е включена.

Ако искате външна MongoDB (извън този compose):
- променете `DATABASE_URL` към външния адрес;
- премахнете услугата `mongo_db`;
- премахнете `depends_on` в услугата `adr`, ако е включен.

Пример за конфигурация с локална MongoDB услуга:

```yaml
services:
    mongo_db:
        container_name: mongodb
        image: mongo:8.0.4
        ports:
            - "27017:27017"
        restart: unless-stopped
        volumes:
            - mongo_db:/data/db
        networks:
            - db_network
```

### 3. Изграждане и стартиране

```bash
docker compose up -d --build
```

Приложението ще бъде достъпно на `http://localhost:4001`.

### 4. Зареждане на базата данни

Базата данни се доставя като компресиран архив (`adr_04-04-2026.gz`), създаден с `mongodump --gzip --archive`.

Възстановяване директно от хоста към MongoDB услугата:

```bash
docker compose exec -T mongo_db mongorestore --gzip --archive < adr_04-04-2026.gz
```

Алтернатива (по име на контейнер):

```bash
docker cp adr_04-04-2026.gz mongodb:/tmp/adr_04-04-2026.gz
docker exec -it mongodb mongorestore --gzip --archive=/tmp/adr_04-04-2026.gz
```

### 5. Управление на контейнера

```bash
# Преглед на логовете
docker compose logs -f adr

# Спиране
docker compose down

# Обновяване след промяна в кода
docker compose up -d --build
```

### 6. Продукционна настройка с Docker

За продукционна среда се препоръчва:
- Промяна на `NODE_ENV` на `production` в `docker-compose.yaml`.
- Използване на обратен прокси (Nginx, Traefik) пред контейнера.
- TLS/SSL сертификат (напр. Let's Encrypt чрез Certbot).

---

## Структура на проекта

```
ADR/
├── controllers/       # Логика за обработка на заявки
├── middleware/        # Express middleware (автентикация)
├── models/            # Mongoose модели (MongoDB схеми)
├── modules/           # Помощни модули (кодове на опасност, изображения)
├── public/            # Статични файлове (CSS, JS, изображения)
├── routers/           # Express маршрути
├── views/             # EJS шаблони
├── docker-compose.yaml
├── Dockerfile
├── package.json
└── server.js          # Входна точка на приложението
```

---

## Лиценз

ISC © Vasil Vasilev

Данните, производни от ERG, са собственост на съответните правителствени агенции (PHMSA, Transport Canada, SICT) и са предоставени за свободно ползване. Приложението само по себе си е лицензирано под ISC лиценз.

