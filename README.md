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

- **Node.js** v22 LTS
- **MongoDB** v8 (препоръчително)
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
DATABASE_URL=mongodb://adr_app:URL_ENCODED_PASSWORD@127.0.0.1:27017/adr?authSource=adr&tls=true&tlsCAFile=/secure/mongodb-ca.crt
NODE_ENV=production
TOKEN_PASSWORD=минимум_32_случайни_символа
SECRET_KEY=минимум_32_случайни_символа
```

> Генерирайте сигурни стойности с: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Зареждане на базата данни

Поставете одобрен компресиран backup извън Git repository-то. Архивът трябва да
е създаден с `mongodump --gzip --archive`. Използвайте authentication и TLS при
restore; production процедурата е описана в Docker раздела по-долу.

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
DATABASE_URL=mongodb://adr_app:URL_ENCODED_PASSWORD@127.0.0.1:27017/adr?authSource=adr&tls=true&tlsCAFile=C:\secure\mongodb-ca.crt
NODE_ENV=production
TOKEN_PASSWORD=минимум_32_случайни_символа
SECRET_KEY=минимум_32_случайни_символа
```

> Генерирайте сигурни стойности в PowerShell:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4. Зареждане на базата данни

Поставете одобрен компресиран backup извън Git repository-то. Архивът трябва да
е създаден с `mongodump --gzip --archive`. Използвайте authentication и TLS при
restore; production процедурата е описана в Docker раздела по-долу.

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

Production Compose конфигурацията стартира приложението `adr` и споделения
MongoDB контейнер `mongodb` в частната мрежа `db_network`. MongoDB не публикува
порт `27017`, изисква TLS и authentication, а приложението използва отделния
потребител `adr_app` с `readWrite` само за базата `adr`.

### 1. Тайни и сертификати

Compose очаква следните файлове:

```text
./token_password.txt
./secret_key.txt
/home/vasil/.config/mongodb-auth/adr.password
/home/vasil/.config/adr/mongodb-ca.crt
```

Генерирайте application тайните и ограничете достъпа им:

```bash
openssl rand -hex 32 > token_password.txt
openssl rand -hex 32 > secret_key.txt
chmod 600 token_password.txt secret_key.txt
```

MongoDB паролата и CA сертификатът се provision-ват отделно от repository-то.
Всички тайни се монтират read-only; не ги добавяйте в Git или Docker image.
MongoDB server certificate/private key се пазят отделно в
`/home/vasil/.config/mongodb-tls` на production хоста.

### 2. Стартиране и проверка

```bash
docker compose up -d --build
docker compose ps
docker logs --tail 100 adr
curl --fail http://127.0.0.1:4001/
```

Приложението е достъпно на `http://localhost:4001`. Production режимът вече е
зададен в `docker-compose.yaml`; приложението отказва да стартира при MongoDB
връзка без credentials или TLS.

### 3. Резервно копие

Изпълнете на production хоста:

```bash
docker cp /home/vasil/.config/mongodb-auth/admin.password mongodb:/tmp/admin.password
docker exec mongodb sh -c 'mongodump \
  --host mongodb \
  --ssl \
  --sslCAFile /run/mongodb-tls/ca.crt \
  --username energidio_admin \
  --password "$(tr -d "\\r\\n" < /tmp/admin.password)" \
  --authenticationDatabase admin \
  --db adr \
  --archive=/tmp/adr-backup.gz \
  --gzip'
docker cp mongodb:/tmp/adr-backup.gz ./adr-backup.gz
docker exec mongodb rm -f /tmp/admin.password /tmp/adr-backup.gz
chmod 600 ./adr-backup.gz
gzip -t ./adr-backup.gz
```

Пазете backup архива извън Git, криптирано и с ограничен достъп.

### 4. Възстановяване

`--drop` заменя текущите колекции. Направете актуален backup преди restore и
спрете приложението, за да няма записи по време на операцията.

```bash
gzip -t ./adr-backup.gz
docker cp ./adr-backup.gz mongodb:/tmp/adr-restore.gz
docker cp /home/vasil/.config/mongodb-auth/admin.password mongodb:/tmp/admin.password
docker stop adr
docker exec mongodb sh -c 'mongorestore \
  --host mongodb \
  --ssl \
  --sslCAFile /run/mongodb-tls/ca.crt \
  --username energidio_admin \
  --password "$(tr -d "\\r\\n" < /tmp/admin.password)" \
  --authenticationDatabase admin \
  --archive=/tmp/adr-restore.gz \
  --gzip \
  --drop \
  --nsInclude="adr.*"'
docker exec mongodb rm -f /tmp/admin.password /tmp/adr-restore.gz
docker start adr
docker logs --tail 100 adr
```

### 5. Управление и сигурност

```bash
docker compose logs -f adr
docker compose restart adr
docker compose down
```

- Не публикувайте MongoDB порт `27017`.
- Използвайте MongoDB администратора само за backup, restore и поддръжка.
- Използвайте HTTPS reverse proxy пред публичното приложение.
- Ротирайте credentials при съмнение за компрометиране.
- Инсталирайте редовно security updates и тествайте restore процедурата.

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
