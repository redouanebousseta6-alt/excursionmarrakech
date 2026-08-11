/**
 * Multi-language UI (EN / FR / DE / ES / AR) + combined language/currency control
 */
(function () {
  "use strict";

  var LANG_KEY = "em_lang";
  var SUPPORTED = ["en", "fr", "de", "es", "ar"];
  var LABELS = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    ar: "العربية",
  };

  var STRINGS = {"en":{"nav.home":"Home","nav.trips":"All Trips","nav.about":"About","nav.transfers":"Transfers","nav.book":"Book an excursion","nav.currency":"Currency","prefs.label":"Language & currency","prefs.language":"Language","prefs.currency":"Currency","home.eyebrow":"Marrakech · Atlas · Sahara","home.heroTitle":"Unforgettable Marrakech excursions, crafted for curious travelers","home.heroText":"From Agafay sunsets to Atlas valleys and medina nights — private or group tours with transparent pricing and local guides.","home.ctaExplore":"Explore all trips","home.ctaFeatured":"Featured experiences","home.featuredEyebrow":"Handpicked","home.featuredTitle":"Featured trips","home.featuredText":"Our most requested desert adventures, day trips and signature evenings.","home.viewCatalogue":"View full catalogue","home.catsEyebrow":"Browse by mood","home.catsTitle":"Find your kind of Morocco","home.catsText":"Desert thrills, valley day trips, Red City walks, or slow wellness rituals.","home.reviewsEyebrow":"Guest stories","home.reviewsTitle":"What travelers say","home.trustEyebrow":"Why book with us","home.trustTitle":"Trusted local hosts for Marrakech adventures","home.statTrips":"Curated trips","home.statRating":"Guest rating","home.statSupport":"WhatsApp support","home.trust1Title":"Clear Private vs Group pricing","home.trust1Text":"See exact MAD rates before you inquire — no surprise markups.","home.trust2Title":"Flexible lead booking","home.trust2Text":"Request a date and party size; we confirm availability personally.","home.trust3Title":"Local expertise","home.trust3Text":"Atlas routes, Agafay camps and medina secrets from people who live here.","footer.tagline":"Premium excursions and desert tours from Marrakech — desert, Atlas, coast & city.","footer.explore":"Explore","footer.contact":"Contact","footer.allTrips":"All trips","footer.transfers":"Airport transfers","footer.desert":"Desert adventures","footer.dayTrips":"Day trips","footer.about":"About","footer.privacy":"Privacy","footer.termsUse":"Terms of Use","footer.terms":"Terms & Conditions","footer.sitemap":"Sitemap","cat.desert":"Desert Adventures","cat.desert.desc":"Agafay dunes, camel rides, quads & starlit camps","cat.day-trips":"Day Trips","cat.day-trips.desc":"Atlas valleys, waterfalls, Essaouira & kasbahs","cat.city":"City Tours","cat.city.desc":"Medina, gardens, carriage rides & night lights","cat.wellness":"Wellness","cat.wellness.desc":"Hammam rituals & hands-on cooking classes","cat.multi-day":"Multi-day","cat.multi-day.desc":"Sahara overnight journeys to Merzouga & Zagora","trips.eyebrow":"Catalogue","trips.title":"All Marrakech excursions","trips.intro":"Filter by category to find desert thrills, Atlas day trips, city experiences, wellness rituals and multi-day Sahara journeys.","trips.filter":"Filter by category","trips.all":"All trips","trips.transfersFilter":"Airport transfers","trips.listings":"listings","trips.listing":"listing","card.viewDetails":"View details →","card.from":"from","about.eyebrow":"Our story","about.title":"About excursionmarrakech","about.tagline":"Local hosts. Clear pricing. Unforgettable Morocco.","about.whoTitle":"Who we are","about.whoText":"excursionmarrakech is a Marrakech-based excursion team dedicated to premium desert adventures, Atlas day trips, medina experiences and wellness rituals. We design every outing for comfort, safety and authentic Moroccan hospitality.","about.standTitle":"What we stand for","about.stand1":"Transparent Private and Group pricing in MAD, with USD, EUR and GBP display","about.stand2":"Licensed drivers, vetted partners and clear inclusions","about.stand3":"Personal confirmation for every booking inquiry","about.stand4":"Support before and during your trip via phone and WhatsApp","about.howTitle":"How booking works","about.howText":"Choose a trip, pick Private or Group when available, send a booking request with your details and preferred date. Our team confirms availability and the next steps by email or WhatsApp.","about.contactTitle":"Contact","about.browse":"Browse excursions","about.galleryEyebrow":"Moments from Morocco","about.galleryTitle":"Gallery","about.galleryText":"Scenes from our Marrakech excursions, desert days, and Atlas escapes.","trip.desc":"Description","trip.itinerary":"Itinerary","trip.included":"What’s included","trip.related":"You might also like","trip.relatedAll":"View all trips →","trip.notFound":"Trip not found","trip.notFoundText":"This excursion may have moved. Browse the full catalogue instead.","booking.fullName":"Full name","booking.email":"Email","booking.date":"Preferred date","booking.travelers":"Number of travelers","booking.submit":"Request Booking","booking.price":"Price","booking.agree":"By booking you agree to our","transfer.badge":"Menara Airport · Fixed prices","transfer.title":"Marrakech Airport — Private Transfer Price List","transfer.heroText":"Skip the queue. Your driver meets you at arrivals with a name board, helps with luggage, and takes you straight to your riad, hotel or next destination — in comfort.","transfer.ctaWhatsapp":"Book on WhatsApp","transfer.ctaPrices":"View prices","transfer.cardTitle":"Marrakech Airport — Private Transfer","transfer.cardText":"Fixed-price private transfers from Menara Airport to the city, coast and long-distance destinations. VIP Mercedes available.","transfer.cardPrice":"from €15","transfer.cardLink":"View prices →","transfer.cardMeta":"Private · Meet & greet","transfer.introEyebrow":"Private & reliable","transfer.introTitle":"Door-to-door transfers from Marrakech Menara Airport (RAK)","transfer.pricesEyebrow":"Transparent rates","transfer.pricesTitle":"Private transfer price list","transfer.pricesNote":"All prices in euros (€) one-way. Return transfers available on request.","transfer.vipEyebrow":"Upgrade your arrival","transfer.vipTitle":"VIP Mercedes E-Class","transfer.howEyebrow":"Simple booking","transfer.howTitle":"How to book your airport transfer","transfer.faqTitle":"Marrakech airport transfer — common questions","consent.text":"We use cookies for analytics and ads to improve your experience and measure bookings. See our","consent.privacy":"Privacy Policy","consent.reject":"Essential only","consent.accept":"Accept","lang.label":"Language","booking.placeholderName":"Your full name","booking.placeholderEmail":"your.name@gmail.com","booking.priceLabel":"Price","booking.perPerson":"per person","booking.group":"Group","booking.private":"Private","booking.min":"min","booking.total":"Price: {price} · {n} traveler(s)","booking.driver":"Driver","booking.passenger":"Passenger","trip.reviews":"reviews","trip.from":"from {price}"},"fr":{"nav.home":"Accueil","nav.trips":"Toutes les excursions","nav.about":"À propos","nav.transfers":"Transferts","nav.book":"Réserver une excursion","nav.currency":"Devise","prefs.label":"Langue et devise","prefs.language":"Langue","prefs.currency":"Devise","home.eyebrow":"Marrakech · Atlas · Sahara","home.heroTitle":"Excursions inoubliables à Marrakech, conçues pour les voyageurs curieux","home.heroText":"Des couchers de soleil à Agafay aux vallées de l’Atlas et aux soirées dans la médina — circuits privés ou en groupe, tarifs clairs et guides locaux.","home.ctaExplore":"Voir toutes les excursions","home.ctaFeatured":"Expériences phares","home.featuredEyebrow":"Sélection","home.featuredTitle":"Excursions en vedette","home.featuredText":"Nos aventures désert, escapades à la journée et soirées signature les plus demandées.","home.viewCatalogue":"Voir le catalogue","home.catsEyebrow":"Par envie","home.catsTitle":"Trouvez votre Maroc","home.catsText":"Frissons du désert, escapades en vallée, balades dans la Ville Rouge ou rituels bien-être.","home.reviewsEyebrow":"Avis voyageurs","home.reviewsTitle":"Ce que disent les voyageurs","home.trustEyebrow":"Pourquoi nous choisir","home.trustTitle":"Hôtes locaux de confiance pour vos aventures à Marrakech","home.statTrips":"Excursions sélectionnées","home.statRating":"Note des voyageurs","home.statSupport":"Support WhatsApp","home.trust1Title":"Tarifs Privé / Groupe clairs","home.trust1Text":"Voyez les tarifs MAD exacts avant de demander — sans majoration surprise.","home.trust2Title":"Réservation souple","home.trust2Text":"Indiquez date et nombre de voyageurs ; nous confirmons personnellement.","home.trust3Title":"Expertise locale","home.trust3Text":"Routes de l’Atlas, camps d’Agafay et secrets de médina par ceux qui vivent ici.","footer.tagline":"Excursions premium et circuits désert depuis Marrakech — désert, Atlas, côte et ville.","footer.explore":"Explorer","footer.contact":"Contact","footer.allTrips":"Toutes les excursions","footer.transfers":"Transferts aéroport","footer.desert":"Aventures désert","footer.dayTrips":"Excursions à la journée","footer.about":"À propos","footer.privacy":"Confidentialité","footer.termsUse":"Conditions d’utilisation","footer.terms":"Conditions générales","footer.sitemap":"Plan du site","cat.desert":"Aventures désert","cat.desert.desc":"Dunes d’Agafay, dromadaires, quads et camps sous les étoiles","cat.day-trips":"Excursions à la journée","cat.day-trips.desc":"Vallées de l’Atlas, cascades, Essaouira et kasbahs","cat.city":"Circuits en ville","cat.city.desc":"Médina, jardins, calèches et lumières de nuit","cat.wellness":"Bien-être","cat.wellness.desc":"Rituels hammam et cours de cuisine","cat.multi-day":"Multi-jours","cat.multi-day.desc":"Séjours Sahara vers Merzouga et Zagora","trips.eyebrow":"Catalogue","trips.title":"Toutes les excursions à Marrakech","trips.intro":"Filtrez par catégorie : désert, Atlas, ville, bien-être et séjours Sahara.","trips.filter":"Filtrer par catégorie","trips.all":"Toutes les excursions","trips.transfersFilter":"Transferts aéroport","trips.listings":"annonces","trips.listing":"annonce","card.viewDetails":"Voir les détails →","card.from":"à partir de","about.eyebrow":"Notre histoire","about.title":"À propos d’excursionmarrakech","about.tagline":"Hôtes locaux. Tarifs clairs. Maroc inoubliable.","about.whoTitle":"Qui nous sommes","about.whoText":"excursionmarrakech est une équipe basée à Marrakech dédiée aux aventures désert premium, escapades Atlas, expériences médina et rituels bien-être. Chaque sortie est pensée pour le confort, la sécurité et l’hospitalité marocaine.","about.standTitle":"Nos engagements","about.stand1":"Tarifs Privé et Groupe transparents en MAD, affichage USD, EUR et GBP","about.stand2":"Chauffeurs licenciés, partenaires vérifiés et inclusions claires","about.stand3":"Confirmation personnelle pour chaque demande","about.stand4":"Assistance avant et pendant le voyage par téléphone et WhatsApp","about.howTitle":"Comment réserver","about.howText":"Choisissez une excursion, Privé ou Groupe si disponible, envoyez une demande avec vos coordonnées et la date. Notre équipe confirme la dispo et la suite par e-mail ou WhatsApp.","about.contactTitle":"Contact","about.browse":"Voir les excursions","about.galleryEyebrow":"Instants du Maroc","about.galleryTitle":"Galerie","about.galleryText":"Scènes de nos excursions à Marrakech, journées désert et escapades Atlas.","trip.desc":"Description","trip.itinerary":"Itinéraire","trip.included":"Inclus","trip.related":"Vous aimerez aussi","trip.relatedAll":"Voir toutes les excursions →","trip.notFound":"Excursion introuvable","trip.notFoundText":"Cette excursion a peut-être été déplacée. Consultez le catalogue.","booking.fullName":"Nom complet","booking.email":"E-mail","booking.date":"Date souhaitée","booking.travelers":"Nombre de voyageurs","booking.submit":"Demander une réservation","booking.price":"Prix","booking.agree":"En réservant, vous acceptez notre","transfer.badge":"Aéroport Menara · Prix fixes","transfer.title":"Aéroport de Marrakech — Tarifs transferts privés","transfer.heroText":"Évitez la file. Votre chauffeur vous attend à l’arrivée avec un panneau nominatif, aide avec les bagages et vous conduit directement à votre riad ou hôtel.","transfer.ctaWhatsapp":"Réserver sur WhatsApp","transfer.ctaPrices":"Voir les tarifs","transfer.cardTitle":"Transfert privé — Aéroport de Marrakech","transfer.cardText":"Transferts privés à prix fixe depuis Menara vers la ville, la côte et les longues distances. Mercedes VIP disponible.","transfer.cardPrice":"à partir de 15 €","transfer.cardLink":"Voir les tarifs →","transfer.cardMeta":"Privé · Accueil personnalisé","transfer.introEyebrow":"Privé & fiable","transfer.introTitle":"Transferts porte-à-porte depuis l’aéroport Menara (RAK)","transfer.pricesEyebrow":"Tarifs transparents","transfer.pricesTitle":"Grille tarifaire des transferts privés","transfer.pricesNote":"Tous les prix en euros (€) aller simple. Retours sur demande.","transfer.vipEyebrow":"Améliorez votre arrivée","transfer.vipTitle":"Mercedes Classe E VIP","transfer.howEyebrow":"Réservation simple","transfer.howTitle":"Comment réserver votre transfert aéroport","transfer.faqTitle":"Transfert aéroport Marrakech — questions fréquentes","consent.text":"Nous utilisons des cookies analytiques et publicitaires pour améliorer votre expérience et mesurer les réservations. Voir notre","consent.privacy":"Politique de confidentialité","consent.reject":"Essentiels uniquement","consent.accept":"Accepter","lang.label":"Langue","booking.placeholderName":"Votre nom complet","booking.placeholderEmail":"votre.nom@gmail.com","booking.priceLabel":"Prix","booking.perPerson":"par personne","booking.group":"Groupe","booking.private":"Privé","booking.min":"min","booking.total":"Prix : {price} · {n} voyageur(s)","booking.driver":"Conducteur","booking.passenger":"Passager","trip.reviews":"avis","trip.from":"à partir de {price}"},"de":{"nav.home":"Start","nav.trips":"Alle Touren","nav.about":"Über uns","nav.transfers":"Transfers","nav.book":"Tour buchen","nav.currency":"Währung","prefs.label":"Sprache & Währung","prefs.language":"Sprache","prefs.currency":"Währung","home.eyebrow":"Marrakesch · Atlas · Sahara","home.heroTitle":"Unvergessliche Ausflüge in Marrakesch für neugierige Reisende","home.heroText":"Von Agafay-Sonnenuntergängen bis zu Atlas-Tälern und Medina-Nächten — privat oder in der Gruppe, mit klaren Preisen und lokalen Guides.","home.ctaExplore":"Alle Touren entdecken","home.ctaFeatured":"Highlights","home.featuredEyebrow":"Handverlesen","home.featuredTitle":"Beliebte Touren","home.featuredText":"Unsere meistgebuchten Wüstenabenteuer, Tagesausflüge und Signature-Abende.","home.viewCatalogue":"Zum Katalog","home.catsEyebrow":"Nach Stimmung","home.catsTitle":"Finden Sie Ihr Marokko","home.catsText":"Wüstenkick, Taltagesausflüge, Spaziergänge in der Roten Stadt oder Wellness.","home.reviewsEyebrow":"Gästestimmen","home.reviewsTitle":"Was Reisende sagen","home.trustEyebrow":"Warum bei uns buchen","home.trustTitle":"Vertrauenswürdige lokale Gastgeber für Marrakesch-Abenteuer","home.statTrips":"Ausgewählte Touren","home.statRating":"Gästebewertung","home.statSupport":"WhatsApp-Support","home.trust1Title":"Klare Privat- vs. Gruppenpreise","home.trust1Text":"Sehen Sie genaue MAD-Preise vor der Anfrage — keine Überraschungen.","home.trust2Title":"Flexible Anfragebuchung","home.trust2Text":"Wunschdatum und Gruppengröße anfragen; wir bestätigen persönlich.","home.trust3Title":"Lokale Expertise","home.trust3Text":"Atlas-Routen, Agafay-Camps und Medina-Geheimnisse von Locals.","footer.tagline":"Premium-Ausflüge und Wüstentouren ab Marrakesch — Wüste, Atlas, Küste & Stadt.","footer.explore":"Entdecken","footer.contact":"Kontakt","footer.allTrips":"Alle Touren","footer.transfers":"Flughafentransfers","footer.desert":"Wüstenabenteuer","footer.dayTrips":"Tagesausflüge","footer.about":"Über uns","footer.privacy":"Datenschutz","footer.termsUse":"Nutzungsbedingungen","footer.terms":"AGB","footer.sitemap":"Sitemap","cat.desert":"Wüstenabenteuer","cat.desert.desc":"Agafay-Dünen, Kamelritte, Quads & Sternencamps","cat.day-trips":"Tagesausflüge","cat.day-trips.desc":"Atlas-Täler, Wasserfälle, Essaouira & Kasbahs","cat.city":"Stadttouren","cat.city.desc":"Medina, Gärten, Kutschfahrten & Nachtlichter","cat.wellness":"Wellness","cat.wellness.desc":"Hammam-Rituale & Kochkurse","cat.multi-day":"Mehrtägig","cat.multi-day.desc":"Sahara-Übernachtungen nach Merzouga & Zagora","trips.eyebrow":"Katalog","trips.title":"Alle Marrakesch-Ausflüge","trips.intro":"Nach Kategorie filtern: Wüste, Atlas, Stadt, Wellness und Sahara-Reisen.","trips.filter":"Nach Kategorie filtern","trips.all":"Alle Touren","trips.transfersFilter":"Flughafentransfers","trips.listings":"Einträge","trips.listing":"Eintrag","card.viewDetails":"Details ansehen →","card.from":"ab","about.eyebrow":"Unsere Geschichte","about.title":"Über excursionmarrakech","about.tagline":"Lokale Gastgeber. Klare Preise. Unvergessliches Marokko.","about.whoTitle":"Wer wir sind","about.whoText":"excursionmarrakech ist ein Marrakesch-Team für Premium-Wüstenabenteuer, Atlas-Tagesausflüge, Medina-Erlebnisse und Wellness. Jede Tour ist auf Komfort, Sicherheit und marokkanische Gastfreundschaft ausgelegt.","about.standTitle":"Wofür wir stehen","about.stand1":"Transparente Privat- und Gruppenpreise in MAD, Anzeige in USD, EUR und GBP","about.stand2":"Lizenzierte Fahrer, geprüfte Partner und klare Leistungen","about.stand3":"Persönliche Bestätigung für jede Anfrage","about.stand4":"Support vor und während der Reise per Telefon und WhatsApp","about.howTitle":"So funktioniert die Buchung","about.howText":"Wählen Sie eine Tour, Privat oder Gruppe falls verfügbar, senden Sie eine Anfrage mit Daten und Wunschdatum. Wir bestätigen Verfügbarkeit und nächste Schritte per E-Mail oder WhatsApp.","about.contactTitle":"Kontakt","about.browse":"Touren entdecken","about.galleryEyebrow":"Momente aus Marokko","about.galleryTitle":"Galerie","about.galleryText":"Szenen unserer Marrakesch-Touren, Wüstentage und Atlas-Ausflüge.","trip.desc":"Beschreibung","trip.itinerary":"Reiseverlauf","trip.included":"Inklusive","trip.related":"Das könnte Ihnen auch gefallen","trip.relatedAll":"Alle Touren →","trip.notFound":"Tour nicht gefunden","trip.notFoundText":"Diese Tour wurde möglicherweise verschoben. Sehen Sie im Katalog nach.","booking.fullName":"Vollständiger Name","booking.email":"E-Mail","booking.date":"Wunschdatum","booking.travelers":"Anzahl Reisende","booking.submit":"Buchungsanfrage senden","booking.price":"Preis","booking.agree":"Mit der Buchung akzeptieren Sie unsere","transfer.badge":"Flughafen Menara · Festpreise","transfer.title":"Flughafen Marrakesch — Private Transferpreise","transfer.heroText":"Keine Warteschlange. Ihr Fahrer erwartet Sie mit Namensschild, hilft beim Gepäck und bringt Sie direkt zu Riad oder Hotel.","transfer.ctaWhatsapp":"Per WhatsApp buchen","transfer.ctaPrices":"Preise ansehen","transfer.cardTitle":"Privater Transfer — Flughafen Marrakesch","transfer.cardText":"Festpreis-Transfers ab Menara in die Stadt, an die Küste und zu Fernzielen. VIP Mercedes verfügbar.","transfer.cardPrice":"ab €15","transfer.cardLink":"Preise ansehen →","transfer.cardMeta":"Privat · Abholung mit Namensschild","transfer.introEyebrow":"Privat & zuverlässig","transfer.introTitle":"Tür-zu-Tür-Transfers ab Flughafen Menara (RAK)","transfer.pricesEyebrow":"Transparente Preise","transfer.pricesTitle":"Private Transferpreisliste","transfer.pricesNote":"Alle Preise in Euro (€) einfach. Rücktransfers auf Anfrage.","transfer.vipEyebrow":"Upgrade für Ihre Ankunft","transfer.vipTitle":"VIP Mercedes E-Klasse","transfer.howEyebrow":"Einfache Buchung","transfer.howTitle":"So buchen Sie Ihren Flughafentransfer","transfer.faqTitle":"Flughafentransfer Marrakesch — häufige Fragen","consent.text":"Wir verwenden Cookies für Analyse und Werbung, um Ihr Erlebnis zu verbessern und Buchungen zu messen. Siehe unsere","consent.privacy":"Datenschutzerklärung","consent.reject":"Nur essenzielle","consent.accept":"Akzeptieren","lang.label":"Sprache","booking.placeholderName":"Ihr vollständiger Name","booking.placeholderEmail":"ihr.name@gmail.com","booking.priceLabel":"Preis","booking.perPerson":"pro Person","booking.group":"Gruppe","booking.private":"Privat","booking.min":"min","booking.total":"Preis: {price} · {n} Reisende(r)","booking.driver":"Fahrer","booking.passenger":"Mitfahrer","trip.reviews":"Bewertungen","trip.from":"ab {price}"},"es":{"nav.home":"Inicio","nav.trips":"Todas las excursiones","nav.about":"Nosotros","nav.transfers":"Traslados","nav.book":"Reservar excursión","nav.currency":"Moneda","prefs.label":"Idioma y moneda","prefs.language":"Idioma","prefs.currency":"Moneda","home.eyebrow":"Marrakech · Atlas · Sáhara","home.heroTitle":"Excursiones inolvidables en Marrakech para viajeros curiosos","home.heroText":"Desde atardeceres en Agafay hasta valles del Atlas y noches en la medina — tours privados o en grupo, precios claros y guías locales.","home.ctaExplore":"Ver todas las excursiones","home.ctaFeatured":"Experiencias destacadas","home.featuredEyebrow":"Selección","home.featuredTitle":"Excursiones destacadas","home.featuredText":"Nuestras aventuras en el desierto, escapadas de día y veladas más solicitadas.","home.viewCatalogue":"Ver catálogo","home.catsEyebrow":"Según tu mood","home.catsTitle":"Encuentra tu Marruecos","home.catsText":"Emoción en el desierto, escapadas de valle, paseos por la Ciudad Roja o bienestar.","home.reviewsEyebrow":"Historias de viajeros","home.reviewsTitle":"Lo que dicen los viajeros","home.trustEyebrow":"Por qué reservar con nosotros","home.trustTitle":"Anfitriones locales de confianza para aventuras en Marrakech","home.statTrips":"Excursiones seleccionadas","home.statRating":"Valoración de huéspedes","home.statSupport":"Soporte WhatsApp","home.trust1Title":"Precios claros Privado / Grupo","home.trust1Text":"Vea tarifas MAD exactas antes de consultar — sin recargos sorpresa.","home.trust2Title":"Reserva flexible","home.trust2Text":"Solicite fecha y tamaño del grupo; confirmamos personalmente.","home.trust3Title":"Experiencia local","home.trust3Text":"Rutas del Atlas, campamentos Agafay y secretos de la medina de quien vive aquí.","footer.tagline":"Excursiones premium y tours por el desierto desde Marrakech — desierto, Atlas, costa y ciudad.","footer.explore":"Explorar","footer.contact":"Contacto","footer.allTrips":"Todas las excursiones","footer.transfers":"Traslados aeropuerto","footer.desert":"Aventuras en el desierto","footer.dayTrips":"Excursiones de día","footer.about":"Nosotros","footer.privacy":"Privacidad","footer.termsUse":"Términos de uso","footer.terms":"Términos y condiciones","footer.sitemap":"Mapa del sitio","cat.desert":"Aventuras en el desierto","cat.desert.desc":"Dunas de Agafay, camellos, quads y campamentos bajo las estrellas","cat.day-trips":"Excursiones de día","cat.day-trips.desc":"Valles del Atlas, cascadas, Essaouira y kasbahs","cat.city":"Tours por la ciudad","cat.city.desc":"Medina, jardines, calesas y luces nocturnas","cat.wellness":"Bienestar","cat.wellness.desc":"Rituales de hammam y clases de cocina","cat.multi-day":"Varios días","cat.multi-day.desc":"Viajes con noche en el Sáhara a Merzouga y Zagora","trips.eyebrow":"Catálogo","trips.title":"Todas las excursiones en Marrakech","trips.intro":"Filtre por categoría: desierto, Atlas, ciudad, bienestar y viajes al Sáhara.","trips.filter":"Filtrar por categoría","trips.all":"Todas las excursiones","trips.transfersFilter":"Traslados aeropuerto","trips.listings":"listados","trips.listing":"listado","card.viewDetails":"Ver detalles →","card.from":"desde","about.eyebrow":"Nuestra historia","about.title":"Sobre excursionmarrakech","about.tagline":"Anfitriones locales. Precios claros. Marruecos inolvidable.","about.whoTitle":"Quiénes somos","about.whoText":"excursionmarrakech es un equipo en Marrakech dedicado a aventuras premium en el desierto, escapadas al Atlas, experiencias en la medina y bienestar. Diseñamos cada salida para comodidad, seguridad y hospitalidad marroquí.","about.standTitle":"Nuestros valores","about.stand1":"Precios Privado y Grupo transparentes en MAD, con visualización en USD, EUR y GBP","about.stand2":"Conductores con licencia, socios verificados e inclusiones claras","about.stand3":"Confirmación personal para cada solicitud","about.stand4":"Soporte antes y durante el viaje por teléfono y WhatsApp","about.howTitle":"Cómo reservar","about.howText":"Elija una excursión, Privado o Grupo si está disponible, envíe una solicitud con sus datos y fecha. Confirmamos disponibilidad y pasos siguientes por email o WhatsApp.","about.contactTitle":"Contacto","about.browse":"Ver excursiones","about.galleryEyebrow":"Momentos de Marruecos","about.galleryTitle":"Galería","about.galleryText":"Escenas de nuestras excursiones en Marrakech, días de desierto y escapes al Atlas.","trip.desc":"Descripción","trip.itinerary":"Itinerario","trip.included":"Qué incluye","trip.related":"También te puede gustar","trip.relatedAll":"Ver todas las excursiones →","trip.notFound":"Excursión no encontrada","trip.notFoundText":"Esta excursión puede haberse movido. Consulte el catálogo.","booking.fullName":"Nombre completo","booking.email":"Correo electrónico","booking.date":"Fecha preferida","booking.travelers":"Número de viajeros","booking.submit":"Solicitar reserva","booking.price":"Precio","booking.agree":"Al reservar acepta nuestra","transfer.badge":"Aeropuerto Menara · Precios fijos","transfer.title":"Aeropuerto de Marrakech — Precios de traslados privados","transfer.heroText":"Evite la cola. Su chófer le espera en llegadas con cartel, ayuda con el equipaje y le lleva directo a su riad u hotel.","transfer.ctaWhatsapp":"Reservar por WhatsApp","transfer.ctaPrices":"Ver precios","transfer.cardTitle":"Traslado privado — Aeropuerto de Marrakech","transfer.cardText":"Traslados privados a precio fijo desde Menara a la ciudad, costa y destinos largos. Mercedes VIP disponible.","transfer.cardPrice":"desde 15 €","transfer.cardLink":"Ver precios →","transfer.cardMeta":"Privado · Recepción personalizada","transfer.introEyebrow":"Privado y fiable","transfer.introTitle":"Traslados puerta a puerta desde el aeropuerto Menara (RAK)","transfer.pricesEyebrow":"Tarifas transparentes","transfer.pricesTitle":"Lista de precios de traslados privados","transfer.pricesNote":"Todos los precios en euros (€) solo ida. Retornos bajo petición.","transfer.vipEyebrow":"Mejora tu llegada","transfer.vipTitle":"Mercedes Clase E VIP","transfer.howEyebrow":"Reserva sencilla","transfer.howTitle":"Cómo reservar su traslado al aeropuerto","transfer.faqTitle":"Traslado aeropuerto Marrakech — preguntas frecuentes","consent.text":"Usamos cookies de analítica y anuncios para mejorar su experiencia y medir reservas. Consulte nuestra","consent.privacy":"Política de privacidad","consent.reject":"Solo esenciales","consent.accept":"Aceptar","lang.label":"Idioma","booking.placeholderName":"Su nombre completo","booking.placeholderEmail":"su.nombre@gmail.com","booking.priceLabel":"Precio","booking.perPerson":"por persona","booking.group":"Grupo","booking.private":"Privado","booking.min":"mín","booking.total":"Precio: {price} · {n} viajero(s)","booking.driver":"Conductor","booking.passenger":"Pasajero","trip.reviews":"reseñas","trip.from":"desde {price}"},"ar":{"nav.home":"الرئيسية","nav.trips":"جميع الرحلات","nav.about":"من نحن","nav.transfers":"التنقلات","nav.book":"احجز رحلة","nav.currency":"العملة","prefs.label":"اللغة والعملة","prefs.language":"اللغة","prefs.currency":"العملة","home.eyebrow":"مراكش · الأطلس · الصحراء","home.heroTitle":"رحلات لا تُنسى في مراكش للمسافرين الفضوليين","home.heroText":"من غروب أكافاي إلى وديان الأطلس وليالي المدينة — جولات خاصة أو جماعية بأسعار واضحة ومرشدين محليين.","home.ctaExplore":"استكشف كل الرحلات","home.ctaFeatured":"تجارب مميزة","home.featuredEyebrow":"مختارة بعناية","home.featuredTitle":"رحلات مميزة","home.featuredText":"أكثر مغامرات الصحراء والرحلات اليومية والأمسيات طلبًا.","home.viewCatalogue":"عرض الكتالوج","home.catsEyebrow":"تصفح حسب الأجواء","home.catsTitle":"اعثر على مغربك","home.catsText":"إثارة الصحراء ورحلات الوديان ونزهات المدينة الحمراء أو طقوس الاستجمام.","home.reviewsEyebrow":"قصص الضيوف","home.reviewsTitle":"ماذا يقول المسافرون","home.trustEyebrow":"لماذا تحجز معنا","home.trustTitle":"مضيفون محليون موثوقون لمغامرات مراكش","home.statTrips":"رحلات مختارة","home.statRating":"تقييم الضيوف","home.statSupport":"دعم واتساب","home.trust1Title":"أسعار واضحة خاص / مجموعة","home.trust1Text":"اطّلع على أسعار الدرهم قبل الطلب — بلا زيادات مفاجئة.","home.trust2Title":"حجز مرن","home.trust2Text":"اطلب التاريخ وعدد المسافرين؛ نؤكد التوفر شخصيًا.","home.trust3Title":"خبرة محلية","home.trust3Text":"طرق الأطلس ومخيمات أكافاي وأسرار المدينة ممن يعيشون هنا.","footer.tagline":"رحلات فاخرة وجولات صحراوية من مراكش — الصحراء والأطلس والساحل والمدينة.","footer.explore":"استكشف","footer.contact":"اتصل بنا","footer.allTrips":"جميع الرحلات","footer.transfers":"تنقلات المطار","footer.desert":"مغامرات الصحراء","footer.dayTrips":"رحلات يومية","footer.about":"من نحن","footer.privacy":"الخصوصية","footer.termsUse":"شروط الاستخدام","footer.terms":"الشروط والأحكام","footer.sitemap":"خريطة الموقع","cat.desert":"مغامرات الصحراء","cat.desert.desc":"كثبان أكافاي وجولات الجمال والكواود ومخيمات تحت النجوم","cat.day-trips":"رحلات يومية","cat.day-trips.desc":"وديان الأطلس والشلالات والصويرة والقصبات","cat.city":"جولات المدينة","cat.city.desc":"المدينة والحدائق والعربات وأضواء الليل","cat.wellness":"الاستجمام","cat.wellness.desc":"طقوس الحمام ودورات الطبخ","cat.multi-day":"عدة أيام","cat.multi-day.desc":"رحلات صحراوية مع مبيت إلى مرزوكة وزاكورة","trips.eyebrow":"الكتالوج","trips.title":"جميع رحلات مراكش","trips.intro":"صفِّ حسب الفئة: صحراء وأطلس ومدينة واستجمام ورحلات صحراوية.","trips.filter":"تصفية حسب الفئة","trips.all":"جميع الرحلات","trips.transfersFilter":"تنقلات المطار","trips.listings":"عروض","trips.listing":"عرض","card.viewDetails":"عرض التفاصيل ←","card.from":"من","about.eyebrow":"قصتنا","about.title":"عن excursionmarrakech","about.tagline":"مضيفون محليون. أسعار واضحة. مغرب لا يُنسى.","about.whoTitle":"من نحن","about.whoText":"excursionmarrakech فريق بمراكش مخصص لمغامرات صحراوية فاخرة ورحلات الأطلس وتجارب المدينة وطقوس الاستجمام. نصمم كل خرجة للراحة والأمان والضيافة المغربية الأصيلة.","about.standTitle":"قيمنا","about.stand1":"أسعار خاص ومجموعة شفافة بالدرهم مع عرض بالدولار واليورو والجنيه","about.stand2":"سائقون مرخّصون وشركاء موثوقون ومشمولات واضحة","about.stand3":"تأكيد شخصي لكل طلب حجز","about.stand4":"دعم قبل وأثناء الرحلة عبر الهاتف وواتساب","about.howTitle":"كيف يتم الحجز","about.howText":"اختر رحلة، خاص أو مجموعة إن توفّر، وأرسل طلبًا ببياناتك والتاريخ. نؤكد التوفر والخطوات عبر البريد أو واتساب.","about.contactTitle":"اتصل بنا","about.browse":"تصفح الرحلات","about.galleryEyebrow":"لحظات من المغرب","about.galleryTitle":"المعرض","about.galleryText":"مشاهد من رحلات مراكش وأيام الصحراء وخرجات الأطلس.","trip.desc":"الوصف","trip.itinerary":"البرنامج","trip.included":"ما يشمله السعر","trip.related":"قد يعجبك أيضًا","trip.relatedAll":"عرض كل الرحلات ←","trip.notFound":"الرحلة غير موجودة","trip.notFoundText":"ربما نُقلت هذه الرحلة. تصفّح الكتالوج.","booking.fullName":"الاسم الكامل","booking.email":"البريد الإلكتروني","booking.date":"التاريخ المفضل","booking.travelers":"عدد المسافرين","booking.submit":"طلب الحجز","booking.price":"السعر","booking.agree":"بالحجز فإنك توافق على","transfer.badge":"مطار مراكش · أسعار ثابتة","transfer.title":"مطار مراكش — قائمة أسعار النقل الخاص","transfer.heroText":"تجاوز الطابور. سائقك في الاستقبال بلوحة اسمك، يساعد في الحقائب ويوصلك مباشرة إلى رياضك أو فندقك.","transfer.ctaWhatsapp":"احجز عبر واتساب","transfer.ctaPrices":"عرض الأسعار","transfer.cardTitle":"نقل خاص — مطار مراكش","transfer.cardText":"نقل خاص بأسعار ثابتة من المطار إلى المدينة والساحل والوجهات البعيدة. مرسيدس VIP متاحة.","transfer.cardPrice":"من 15 €","transfer.cardLink":"عرض الأسعار ←","transfer.cardMeta":"خاص · استقبال شخصي","transfer.introEyebrow":"خاص وموثوق","transfer.introTitle":"نقل من الباب إلى الباب من مطار مراكش (RAK)","transfer.pricesEyebrow":"أسعار شفافة","transfer.pricesTitle":"قائمة أسعار النقل الخاص","transfer.pricesNote":"جميع الأسعار باليورو (€) ذهاب فقط. العودة عند الطلب.","transfer.vipEyebrow":"رقِّ وصولك","transfer.vipTitle":"مرسيدس E-Class VIP","transfer.howEyebrow":"حجز بسيط","transfer.howTitle":"كيف تحجز تنقّل المطار","transfer.faqTitle":"تنقل مطار مراكش — أسئلة شائعة","consent.text":"نستخدم ملفات تعريف الارتباط للتحليلات والإعلانات لتحسين تجربتك وقياس الحجوزات. راجع","consent.privacy":"سياسة الخصوصية","consent.reject":"الأساسية فقط","consent.accept":"قبول","lang.label":"اللغة","booking.placeholderName":"اسمك الكامل","booking.placeholderEmail":"your.name@gmail.com","booking.priceLabel":"السعر","booking.perPerson":"للشخص","booking.group":"مجموعة","booking.private":"خاص","booking.min":"حد أدنى","booking.total":"السعر: {price} · {n} مسافر","booking.driver":"سائق","booking.passenger":"راكب","trip.reviews":"تقييمات","trip.from":"من {price}"}};

  function normalizeLang(code) {
    if (!code) return null;
    code = String(code).toLowerCase().slice(0, 2);
    return SUPPORTED.indexOf(code) !== -1 ? code : null;
  }

  function detectLang() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = normalizeLang(params.get("lang"));
    if (fromQuery) return fromQuery;
    try {
      var stored = normalizeLang(localStorage.getItem(LANG_KEY));
      if (stored) return stored;
    } catch (e) {}
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return normalizeLang(nav) || "en";
  }

  function refreshPriceGrids() {
    var featured = document.getElementById("featured-grid");
    if (featured && EM.TRIPS && EM.renderTripGrid) {
      EM.renderTripGrid(featured, EM.getFeatured(6), { includeTransfer: true });
    }
    var tripsGrid = document.getElementById("trips-grid");
    if (tripsGrid && EM.TRIPS && EM.renderTripGrid) {
      var params = new URLSearchParams(window.location.search);
      var active = params.get("category") || "all";
      if (active === "transfers") EM.renderTripGrid(tripsGrid, [], { transferOnly: true });
      else
        EM.renderTripGrid(tripsGrid, EM.getByCategory(active === "all" ? null : active), {
          includeTransfer: active === "all",
        });
    }
    var relatedRail = document.getElementById("related-trips-rail");
    var relatedSection = document.getElementById("related-trips");
    if (relatedRail && relatedSection && relatedSection.dataset.tripId && EM.getRelatedTrips) {
      var current = EM.getTrip
        ? EM.getTrip(relatedSection.dataset.tripId)
        : (EM.TRIPS || []).find(function (t) {
            return t.id === relatedSection.dataset.tripId;
          });
      if (current) {
        EM.renderTripGrid(relatedRail, EM.getRelatedTrips(current, 4));
        if (EM.syncRelatedTripsNav) EM.syncRelatedTripsNav();
      }
    }
    if (typeof EM.refreshCategoryGrid === "function") EM.refreshCategoryGrid();
    if (typeof EM.refreshTripsFilters === "function") EM.refreshTripsFilters();
  }

  window.EM = window.EM || {};
  EM.SUPPORTED_LANGS = SUPPORTED;
  EM.LANG_LABELS = LABELS;

  EM.getLang = function () {
    return EM.lang || detectLang();
  };

  EM.t = function (key) {
    var lang = EM.getLang();
    var pack = STRINGS[lang] || STRINGS.en;
    return pack[key] || STRINGS.en[key] || key;
  };

  EM.localizedTrip = function (trip) {
    if (!trip) return trip;
    var lang = EM.getLang();
    if (lang === "en" || !EM.TRIPS_I18N || !EM.TRIPS_I18N[lang]) return trip;
    var pack = EM.TRIPS_I18N[lang][trip.id];
    if (!pack) return trip;
    return Object.assign({}, trip, {
      title: pack.title || trip.title,
      shortDescription: pack.short || trip.shortDescription,
      description: pack.description || trip.description,
      itinerary: pack.itinerary || trip.itinerary,
      included: pack.included || trip.included,
      duration: pack.duration || trip.duration,
      durationLabel: pack.duration || trip.durationLabel || trip.duration,
    });
  };

  EM.categoryLabel = function (id) {
    var key = "cat." + id;
    var translated = EM.t(key);
    return translated === key ? id : translated;
  };

  EM.updatePrefsLabel = function () {
    var label = document.querySelector("[data-prefs-label]");
    if (!label) return;
    var lang = (EM.getLang() || "en").toUpperCase();
    var cur = (EM.money && EM.money.code) || "MAD";
    label.textContent = lang + " · " + cur;
  };

  EM.setLang = function (lang, opts) {
    opts = opts || {};
    lang = normalizeLang(lang) || "en";
    EM.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("is-rtl", lang === "ar");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = EM.t(key);
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = val;
      else el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.placeholder = EM.t(el.getAttribute("data-i18n-placeholder"));
    });

    var select = document.querySelector("[data-lang]");
    if (select && select.value !== lang) select.value = lang;

    EM.updatePrefsLabel();
    EM.injectHreflang();

    if (opts.reloadGrids !== false) refreshPriceGrids();

    // Re-apply localized trip hero if on trip page
    if (opts.reloadTrip && EM._currentTrip && typeof EM.applyTripI18n === "function") {
      EM.applyTripI18n(EM._currentTrip);
    }

    if (opts.pushUrl !== false) {
      var url = new URL(window.location.href);
      if (lang === "en") url.searchParams.delete("lang");
      else url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url);
    }
  };

  EM.injectHreflang = function () {
    document.querySelectorAll("link[data-em-hreflang]").forEach(function (n) {
      n.remove();
    });
    var site = (EM.config && EM.config.siteUrl) || "https://excursionmarrakech.net";
    var path = window.location.pathname;
    SUPPORTED.forEach(function (lang) {
      var link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.setAttribute("data-em-hreflang", "1");
      var href = site.replace(/\/$/, "") + path;
      if (lang !== "en") href += (href.indexOf("?") === -1 ? "?" : "&") + "lang=" + lang;
      link.href = href;
      document.head.appendChild(link);
    });
    var xdef = document.createElement("link");
    xdef.rel = "alternate";
    xdef.hreflang = "x-default";
    xdef.setAttribute("data-em-hreflang", "1");
    xdef.href = site.replace(/\/$/, "") + path;
    document.head.appendChild(xdef);
  };

  EM.mountPrefsMenu = function () {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;
    // Remove legacy separate controls
    nav.querySelectorAll(".lang-switch, .currency-switch").forEach(function (n) {
      n.remove();
    });
    if (nav.querySelector("[data-prefs]")) {
      EM.updatePrefsLabel();
      return;
    }
    if (!EM.money && EM.createCurrency) EM.money = EM.createCurrency();

    var codes = EM.money ? EM.money.codes() : ["MAD", "USD", "EUR", "GBP"];
    var cur = EM.money ? EM.money.code : "MAD";
    var lang = EM.getLang();

    var wrap = document.createElement("div");
    wrap.className = "prefs-menu";
    wrap.setAttribute("data-prefs", "1");
    wrap.innerHTML =
      '<button type="button" class="prefs-menu__btn" data-prefs-toggle aria-expanded="false" aria-haspopup="true">' +
      '<span data-prefs-label>' +
      lang.toUpperCase() +
      " · " +
      cur +
      "</span>" +
      '<span class="prefs-menu__caret" aria-hidden="true">▾</span>' +
      "</button>" +
      '<div class="prefs-menu__panel" data-prefs-panel hidden>' +
      '<label class="prefs-menu__field"><span data-i18n="prefs.language">' +
      EM.t("prefs.language") +
      "</span>" +
      '<select data-lang aria-label="' +
      EM.t("prefs.language") +
      '">' +
      SUPPORTED.map(function (code) {
        return (
          '<option value="' +
          code +
          '"' +
          (code === lang ? " selected" : "") +
          ">" +
          LABELS[code] +
          "</option>"
        );
      }).join("") +
      "</select></label>" +
      '<label class="prefs-menu__field"><span data-i18n="prefs.currency">' +
      EM.t("prefs.currency") +
      "</span>" +
      '<select data-currency aria-label="' +
      EM.t("prefs.currency") +
      '">' +
      codes
        .map(function (c) {
          return (
            '<option value="' +
            c +
            '"' +
            (c === cur ? " selected" : "") +
            ">" +
            c +
            "</option>"
          );
        })
        .join("") +
      "</select></label>" +
      "</div>";

    nav.appendChild(wrap);

    var btn = wrap.querySelector("[data-prefs-toggle]");
    var panel = wrap.querySelector("[data-prefs-panel]");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
        wrap.classList.add("is-open");
      } else {
        panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
        wrap.classList.remove("is-open");
      }
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
        wrap.classList.remove("is-open");
      }
    });

    function closePrefs() {
      panel.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      wrap.classList.remove("is-open");
    }

    wrap.querySelector("[data-lang]").addEventListener("change", function (e) {
      EM.setLang(e.target.value, { reloadGrids: true, reloadTrip: true });
      closePrefs();
    });
    wrap.querySelector("[data-currency]").addEventListener("change", function (e) {
      if (EM.money) EM.money.setCode(e.target.value);
      EM.updatePrefsLabel();
      refreshPriceGrids();
      if (typeof EM.refreshTripPrice === "function") EM.refreshTripPrice();
      closePrefs();
    });
  };

  EM.mountLanguageSwitcher = function () {
    EM.mountPrefsMenu();
  };
  EM.mountCurrencySwitcher = function () {
    EM.mountPrefsMenu();
  };

  EM.initI18n = function () {
    EM.mountPrefsMenu();
    EM.setLang(detectLang(), { pushUrl: true, reloadGrids: true });
  };
})();
