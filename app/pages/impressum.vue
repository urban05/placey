<template>
  <div class="flex flex-col w-dvw h-dvh p-4">
    <!-- Bar -->
    <section class="flex justify-between items-start">
      <NuxtLink to="/" class="flex justify-center items-center size-15 border border-gray-200 rounded-full shadow cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36"><path fill="#000" d="M29 14h-9V7L7 18l13 11v-7h9z"/></svg>
      </NuxtLink>
      <div class="self-center text-2xl font-bold">Impressum</div>
      <div class="size-15"></div>
    </section>
    <div class="grow text-justify p-8 max-w-200 mx-auto">
      <h3>Haftung für Inhalte</h3>
      <p>
        Die auf den Web-Seiten abrufbaren Beiträge dienen nur der allgemeinen Information und nicht der Beratung in konkreten Fällen.
        Wir sind bemüht, für die Richtigkeit und Aktualität aller auf der Website enthaltenen Informationen und Daten gemäß § 7 Abs.1 TMG zu sorgen.
        Für die Korrektheit, die Vollständigkeit, die Aktualität oder Qualität der bereitgestellten Informationen und Daten wird jedoch keine Gewähr nach § 8 bis 10 TMG übernommen.
        Die Haftung für den Inhalt der abrufbaren Informationen wird ausgeschlossen, soweit es sich nicht um vorsätzliche oder grob fahrlässige Falschinformation handelt.
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
        Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>
      <h3>Haftung für Links</h3>
      <p>
        Wir sind für den Inhalt von Webseiten, die über einen Hyperlink erreicht werden, nicht verantwortlich.
        Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        Wir machen uns die Inhalte dieser Internetseiten ausdrücklich nicht zu eigen und können deshalb für die inhaltliche Korrektheit, Vollständigkeit und Verfügbarkeit keine Gewähr leisten.
        Wir haben bei der erstmaligen Verknüpfung zwar den fremden Inhalt daraufhin überprüft, ob durch ihn eine mögliche zivilrechtliche oder strafrechtliche Verantwortlichkeit ausgelöst wird.
        Wir sind aber nicht dazu verpflichtet, die Inhalte, auf die wir unserem Angebot verweisen, ständig auf Veränderungen zu überprüfen, die eine Verantwortlichkeit neu begründen könnten.
        Erst wenn wir feststellen oder von anderen darauf hingewiesen werden, dass ein konkretes Angebot, zu dem wir einen Link bereitgestellt haben, eine zivil- oder strafrechtliche Verantwortlichkeit auslöst, werden wir den Verweis auf dieses Angebot aufheben, soweit uns dies technisch möglich und zumutbar ist.
      </p>
      <h3>Urheberrecht</h3>
      <p>
        Die durch den Betreiber dieser Seite erstellten Inhalte und Werke auf diesen Webseiten unterliegen dem deutschen Urheberrecht.
        Sämtliche Beiträge Dritter sind als solche gekennzeichnet.
        Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        Kopien von diesen Seiten sind nur für den privaten Bereich gestattet, nicht jedoch für kommerzielle Zwecke.
      </p>
      <h3>Datenschutz</h3>
      <p>
        Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich.
        Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis.
        Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
      </p>
      <p>
        In Verbindung mit Ihrem Zugriff werden in unserem Server für Zwecke der Datensicherheit vorübergehend Daten gespeichert, die möglicherweise eine Identifizierung zulassen (zum Beispiel IP-Adresse, Datum, Uhrzeit und Name der angeforderten Datei).
        Eine Auswertung, mit Ausnahme für statistische Zwecke in anonymisierter Form, erfolgt nicht.
      </p>
      <p>
        Sollten Sie bei uns Informationsmaterialien bestellen, benötigen wir von Ihnen Name, E-Mail-Adresse sowie Angaben zur Lieferung und Rechnungsstellung.
        So können wir Ihre Bestellung bearbeiten und ausführen.
        Diese Daten werden für die Dauer der Auftragsabwicklung in elektronischer Form gespeichert.
        Eine weitergehende Nutzung personenbezogener Daten oder eine Weitergabe an Dritte erfolgt ohne Ihre ausdrückliche Einwilligung nicht.
      </p>
      <p>
        Mit der Bestellung willigen Sie in die genannte Verarbeitung Ihrer personenbezogenen Daten ein, soweit dies für den Zweck des Vertrages erforderlich ist.
        Sie können diese Einwilligung schriftlich oder per E-Mail uns gegenüber jederzeit mit Wirkung für die Zukunft widerrufen.
      </p>
    </div>
    <div class="text-center">&copy; by Placey. All rights reserved.</div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
h3 {
  font-size: large;
  font-weight: 600;
  margin-top: 1em;
}
p {
  padding-block: 0.5em;
}
</style>