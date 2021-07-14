# Billennium-workshops-01-TDD-w-Typescript

## Czym jest test ?

Sprawdzenie naszego kodu w sposób manualny bądź automatyczny (uruchomienie go i porównanie otrzymanego wyniku z oczekiwanym).
My się skupimy na automatycznym testowaniu z wykorzystaniem
`jest`.

### Co dają testy ?

- Poczucie stabilności w projekcie jeżeli są dobrze napisane.
- Odporność na regresję.
- Łatwość robienia refactoru kodu.
- Ułatwiają utrzymanie aplikacji.
- Wprowadzają swoistą dokumentację do kodu.

### Piramida testów

![Piramida testów](https://projectquality.it/wp-content/uploads/2020/02/Piramida-Testo%CC%81w-Projectquality.it_-1024x640.png)

Zazawyczaj piszemy najwięcej testów jednostkowych chociaż są projekty i podejścia w których stawia się na testy integracyjne.
One znacznie częściej failują, ale pilnują większej częsci funkcjonalności.

### Utrzymanie testów

Czyli koszt jaki ponosimy pisząc testy, naprawiając je, aktualizując biblitoteki, ucząć się potrzebnych technologii
oraz pilnując konwencji (tak w skrócie).

### TDD

Podejście w którym najpierw piszemy test, testy. Sprawiamy, aby te testy nie przechodziły, a następnie dopisujemy kod i uruchamiając testy sprawdzamy czy testy przechodzą.

### Kiedy używać ?

- Dla mało doświadczonych devów tylko na testach jednostkowych.
- Dla całej reszty to już zależy od preferencji (ja piszę dla testów jednostkowych zawsze, dla integracyjnych tylko wtedy gdy testują logikę biznesową).
- Kiedy projekt ma stabilny proces planowania i dokumentowania funkcjonalności (jeżeli koncept jest często zmieniany to nie ma sensu wykorzystywać TDD), a nawet i często pisać testy.

### Jakie problemy może rozwiązać TDD ?

- W skrócie dobrze wykorzystywane TDD potrafi znacznie ograniczyć liczbę bugów związanych z warunkami brzegowymi.
- Kod staje się bardziej przemyślany ponieważ przed pisaniem tworzymy w pewien sposób scenariusz tego jak kod ma działać.
- Kod staje się bardziej odporny na regresję.
- Pozwala się łatwo odnaleźć w przypadku gdy ktoś skaczę z projektu na projekt i ma tendencję do zapominania tego co robił wczoraj czy kilka dni temu. Pozwalają robić coś w rodzaju ToDo listy pod konkretny task.

### Jakie problemy może spowodować ?

Wiadomo, że w programowaniu jak i w życiu nie ma nic za darmo i zawsze balansujemy pomiędzy wagami plusów i ich ilością, a minusów.

- Spory próg wejścia i problem z przestawieniem myślenia dla mniej doświadczonych devów.
- Dla osób rozpoczynających przygodę z tym podejściem często czas developmentu się znacznie wydłuża.
- Wymaga sporej wprawy.
- Wymaga umiejętności przestawiania się na to czy coś piszemy z wykorzystaniem TDD czy "tradycyjnie" najpierw implementacja, a później testy - poprostu czasami często jest wykorzystać TDD przy testowaniu integracyjnym.

## Po co tworzymy biblioteki ?

Wyobraźmy sobię sytuację, że mam ogromny projekt. Panel administratora, moduł płatności, aplikacja właściwa (system do obsługi faktur), moduł autoryzacji i tak dalej...

Technologie wykorzystywane w projekcie to (NodeJS, Angular 2+, React, TypeScript).

Występuje prosty podział backend/frontend i w tych katalogach
również podział na moduły (authorization, core, payment, ...etc).

Pewną logikę będziemy mieć bardzo podobną. Obsługę walidacji w formularzach oraz zapis danych z nich do bazy na serwerze, gdzie też musi być taka sama, a często bardziej zaawansowana walidacja.

Do tego dochodzi jeszcze jeden problem. Angular oraz React mają zupełnie inne API do obsługi formularzy oraz modele.

O ile z API nic nie zrobimy z powodu, że są to zupełnie inne technologie, z inną składnią, o tyle sam model możemy uspójnić.

Docelowo będziemy mieć - taki sam model o logikę walidacji na backendzie oraz na każdym możliwym frameworku na FE albo nawet w czystym JavaScript.

Poniżej przykład różniącego się API do obsługi formularzy oraz modeli:

### React

```ts
// VALIDATION SCHEMA
const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

// COMPONENT AND USAGE
export const ValidationSchemaExample = () => (
  <div>
    <h1>Signup</h1>
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Field name="firstName" />
          {errors.firstName && touched.firstName ? (
            <div>{errors.firstName}</div>
          ) : null}
          <Field name="lastName" />
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null}
          <Field name="email" type="email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  </div>
);
```

### Angular

```ts
import { Component } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-profile-editor",
  templateUrl: "./profile-editor.component.html",
  styleUrls: ["./profile-editor.component.css"],
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl(""),
    address: new FormGroup({
      street: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl(""),
      zip: new FormControl(""),
    }),
  });
}
```

```html
<form [formGroup]="profileForm">
  <label for="first-name">First Name: </label>
  <input id="first-name" type="text" formControlName="firstName" />

  <label for="last-name">Last Name: </label>
  <input id="last-name" type="text" formControlName="lastName" />
</form>

<p>Complete the form to enable button.</p>
<button type="submit" [disabled]="!profileForm.valid || profileForm.pristine">
  Submit
</button>
```

### NodeJS

```ts
import express, { Request, Response, NextFunction } from "express";

import { parseSuccess, BadRequest } from "../utils/response-management";
import { ScraperService } from "../services";

const ScraperController = express.Router();

ScraperController.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.query.url) {
        next(new BadRequest("Url parameter is required"));
      }

      const result = await ScraperService.scrapUrl(req.query.url as string);

      parseSuccess(result, res);
    } catch (err) {
      next(new BadRequest(err));
    }
  }
);

export default ScraperController;
```

Jak widać we wszystkich 3 przykładach istnieje inny sposób obsługi wyżej wspomnianej logiki.

Potrzebujemy prostego rozwiązania, które uspójni cały ten proces, pozwoli na współdzielenie kodu pomiędzy Angularem, Reactem i Nodem.

### Zanim zaczniemy

Pierwsze co w takich przypadkach warto zrobić to stworzyć prostą definicję modelu jaki będzie zwracany podzas walidacji oraz wypisać założenia.

#### Założenia

- **typesafety** - przekazany inicjalnie typ zawsze jest spełniony i pilnowany później podczas walidacji. Oznacza to, że przekazując interfejs `User` nie mogę nagle zmienić pól i edytować go w niedozwolony sposób.
- **spójny model** - biblioteka po każdej zmianie zwraca dokładnie ten sam model z taki samymi typami danych.
- **brak zależności** - biblioteka jest całkowicie standalone.
- **mały boilerplate** - staramy się wykorzystywać jak najmniejsze nazwy, ale wystarczająco opisowe.
- **100% immutable** - po to, aby OnPush angularowy działał defaultowo z naszą libką oraz React. Dodatkowo kod jest też łatwiejszy w utrzymaniu.
- **alogorytm walidacji możliwy do definiowania** - docelowo biblioteka wykorzystuje własny algorytm do walidacji, ale powinna dać możliwość dostosowania.
- **możliwa zmiana formatu błędów** - zamiast wartości **true/false** ktoś będzie chciał wprowadzić listę, która przy każdym walidatorze posiada odpowiednią informacje o rezultacie - biblioteka ma na to pozwolić.

#### Model oraz prototyp API

```ts
// Pseudo kod pokazujący sposób działania.

import { form } from 'form'
import { req, min, max, minLength, maxLength } from "validators";

const loginForm = form(
  {
    username: "",
    password: "",
  },
  { username: [req, min(2), max(10), minLength(20), maxLength(30)] }
);

loginForm.set({ username: 'd' }) // patch updates - sets property in form object and runs validation
loginForm.set({ username: 1 }) // TS ERROR invalid type

loginForm.next() // doing same as set but clones object

// f.e in React

this.setState(prevState => ({ loginForm: prevState.loginForm.next({
    username: e.target.value
})}))
```

## Implementacja biblioteki z uwzględnieniem kolejności developmentu

Rozpoczęcie implementacji od wszystkich commitów poza 1 - inicjalnym. Dodatkowo przy commitach mogą pokazywać się modyfikacje pliku `README.ts` - poprostu te modyfikacje należy ignorować.

## Podsumowanie

To czy TDD jest odpowiednim podejściem dla Ciebie czy od Twój projekt zależy od Ciebie i od projektu. Jednak można zrobić sobie prostą check listę, która powinna być chociaż w połowie spełniona.

- Dev team składa się z midów / seniorów, którzy piszą dobre testy. Wiedzą jak pisać testy jednostkowe, integracyjne, jak mockować, tworzyć stuby, proxy oraz dbają o czytelność i utrzymywanie testów.
- Biznes wie czego chce i przełożenie tych wymagań jest w dużej wiekszości wystarczająco czytelne dla developera, aby przygotować listę testów do napisania.
- Sam koncept jest wystarczająco mocno przećwiczony przez developerów - jakies 2,3 miesiące ciągłego pisania daje gwarancję dużej wprawy i prędkość tworzenia rozwiązań jest praktycznia taka sama jak bez testów (mój przykład, ale wiadomo każdy ma inną głowę).
- TDD wykorzystuje się raczej w przypadku tworzenia nowych rzeczy bądź dopisywania kodu do istniejących rozwiązań, który albo coś fixuje, albo w jakiś sposób powiększa funkcjonalność.

Podejście, które omówiono w tym przykładzie może zostać użyte do pisania tak naprawdę czegokolwiek w dużych systemach.
Logiki autoryzacji, mapowania, warstwy zarządzania logiką biznesowa, ...etc.

## Następna prezentacja - Monorepo z Lerna - 4 apki (Angular, Vue, React, Gatsby)