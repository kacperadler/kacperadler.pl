# Deploy na Dokploy

Każdy push do `main` to wydanie: Dokploy sam buduje obraz z `Dockerfile` i wdraża go na produkcję. W kontenerze działają dwa procesy. nginx serwuje gotowe strony i przekazuje `/api/` do serwera Node, który zapisuje leady z formularza. Gdy któryś z nich padnie, kontener się kończy, a Dokploy stawia go od nowa. Kontener słucha na porcie 80, a Traefik w Dokploy kieruje na niego ruch z certyfikatem Let's Encrypt.

Poniższe kroki robi się raz, przy pierwszym ustawianiu aplikacji. Nazwy menu pochodzą z dokumentacji Dokploy (Applications → Advanced). Jeśli w Twojej wersji brzmią inaczej, szukaj odpowiednika.

## 1. Domena w Resend

Na [resend.com/domains](https://resend.com/domains) dodaj domenę `kacperadler.pl` w regionie EU (`eu-west-1`). Resend pokaże rekordy DNS (DKIM oraz SPF i MX dla poddomeny wysyłkowej). Dodaj je u dostawcy DNS i poczekaj, aż domena dostanie status "Verified".

Potem na [resend.com/api-keys](https://resend.com/api-keys) utwórz klucz z uprawnieniem **Sending access**, najlepiej tylko dla tej domeny. Skopiuj go od razu, bo Resend pokazuje go tylko raz.

## 2. Wolumen na bazę leadów

Wolumen dodaj przed pierwszym deployem, inaczej leady zginą przy następnym redeployu. W aplikacji wejdź w zakładkę **Advanced**, sekcję **Volumes/Mounts**, kliknij **Add Volume** i wybierz typ **Volume Mount**:

- **Volume Name**: `kacperadler-leads`
- **Mount Path**: `/data`

Zapisz. Baza to plik `/data/leads.sqlite`. Obraz sam ustawia `LEADS_DB_PATH=/data/leads.sqlite`, więc tej zmiennej nie dodawaj.

Wolumen przeżywa redeploy i restart kontenera. Znika dopiero wtedy, gdy skasujesz go w Dokploy albo na serwerze.

## 3. Zmienne środowiskowe

W zakładce **Environment** dopisz trzy linie i kliknij **Save**:

```
RESEND_API_KEY=re_...
LEAD_NOTIFY_FROM=Strona kacperadler.pl <leady@kacperadler.pl>
LEAD_NOTIFY_TO=twoj-adres@example.com
```

Nadawca musi być adresem w domenie zweryfikowanej w kroku 1, a `LEAD_NOTIFY_TO` to skrzynka, na którą mają przychodzić powiadomienia. Serwer czyta te zmienne przy każdym żądaniu, więc nie są wkompilowane w obraz. Ich wartości nie trafiają do repozytorium.

## 4. Deploy

Kliknij **Deploy** (albo **Redeploy**) w zakładce **General** i poczekaj, aż deployment w zakładce **Deployments** zrobi się zielony.

## 5. Sprawdzenie, czy lead doszedł

Wyślij formularz na [kacperadler.pl/#contact](https://kacperadler.pl/#contact). Po wysłaniu powinna pojawić się karta sukcesu, a na `LEAD_NOTIFY_TO` mail "Nowy lead #<numer> - <typy projektu>". Mail podaje tylko numer leada, typy projektu i godzinę, bez adresu, firmy i treści odwiedzającego. Całe zgłoszenie czytasz z bazy.

W zakładce **Logs** szukaj linii `[lead] saved #<numer>`. Ostrzeżenie `no e-mail` znaczy, że brakuje którejś zmiennej z kroku 3. Linia `the e-mail was not sent` znaczy, że Resend odrzucił wysyłkę, a powód jest w tej samej linii. W obu przypadkach lead jest zapisany, a odwiedzający widzi sukces.

Pięć ostatnich leadów pokaże terminal kontenera (w Dokploy **Docker Terminal** albo **Terminal** aplikacji, na serwerze `docker exec -it <kontener> sh`):

```bash
node -e "const {DatabaseSync}=require('node:sqlite');console.table(new DatabaseSync('/data/leads.sqlite',{readOnly:true}).prepare('select * from leads order by id desc limit 5').all())"
```

## 6. Sprawdzenie limitu zapytań

nginx przepuszcza najwyżej pięć zgłoszeń na minutę z jednego adresu. Adres odwiedzającego bierze z nagłówka `X-Forwarded-For`, który dopisuje Traefik, ale ufa mu tylko wtedy, gdy żądanie przyszło z sieci `10.0.0.0/8`. Na serwerze Dokploy sprawdź, z jakiej podsieci przychodzi Traefik:

```bash
docker network inspect dokploy-network --format '{{range .IPAM.Config}}{{.Subnet}}{{end}}'
```

Wynik musi leżeć w `10.0.0.0/8`, na przykład `10.0.1.0/24` z domyślnej puli Docker Swarm. Inna podsieć znaczy, że nginx liczy limit dla adresu Traefika, czyli wspólnie dla wszystkich odwiedzających. Wtedy wpisz tę podsieć w `set_real_ip_from` w `nginx.conf`.
