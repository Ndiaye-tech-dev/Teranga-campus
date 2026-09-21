/**
 * TERANGA CAMPUS - Sondage étudiants
 * ===================================
 * Ce script crée automatiquement tout le Google Form en 1 clic.
 *
 * MODE D'EMPLOI (2 minutes) :
 * 1. Va sur https://script.google.com/home -> "Nouveau projet"
 * 2. Supprime le code existant, colle tout ce fichier, Enregistrer (Ctrl+S)
 * 3. Clique sur "Exécuter" (▶) -> Autorise avec ton compte Google
 * 4. En bas dans "Journal d'exécution", tu verras 2 liens :
 *    - URL à PARTAGER aux étudiants
 *    - URL pour VOIR les réponses
 * 5. Les réponses arrivent dans l'onglet "Réponses" du Form
 *    (bouton Sheets vert pour les exporter en Excel).
 */

function creerFormulaireTerangaCampus() {
  var form = FormApp.create("Teranga Campus – Dis-nous comment tu révises 📚");

  form.setDescription(
    "Salut ! 👋\n\n" +
    "On veut construire la MEILLEURE plateforme de révision pour les étudiants de l'UFR Sciences Économiques et de Gestion (UFR SEG, L1-L3) de l'Université Amadou Mahtar Mbow.\n" +
    "Pour ça, on a besoin de TOI : dis-nous comment tu révises vraiment.\n\n" +
    "⏱ 3-4 minutes • Anonyme • Ça nous aide énormément 🙏"
  );
  form.setRequireLogin(false);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(true);
  form.setConfirmationMessage("Merci beaucoup ! 🎉 Ta réponse va nous aider à construire un Teranga Campus parfait pour toi. Bon courage pour tes révisions ! 💪");

  // ---------- SECTION A : QUI ES-TU ? ----------
  form.addSectionHeaderItem()
    .setTitle("A. Qui es-tu ?")
    .setHelpText("Pour savoir pour qui on construit.");

  var q1 = form.addListItem()
    .setTitle("Tu es en quel niveau ? *")
    .setRequired(true);
  q1.setChoices([
    q1.createChoice("Licence 1 (L1)"),
    q1.createChoice("Licence 2 (L2)"),
    q1.createChoice("Licence 3 (L3)"),
    q1.createChoice("Autre / Ancien étudiant")
  ]);

  var q2 = form.addListItem()
    .setTitle("Tu es à quel semestre ? *")
    .setRequired(true);
  q2.setChoices([
    q2.createChoice("S1"), q2.createChoice("S2"),
    q2.createChoice("S3"), q2.createChoice("S4"),
    q2.createChoice("S5"), q2.createChoice("S6")
  ]);

  var q3 = form.addMultipleChoiceItem()
    .setTitle("Avec quoi tu vas le plus sur internet / pour réviser ? *")
    .setRequired(true);
  q3.setChoices([
    q3.createChoice("Smartphone Android"),
    q3.createChoice("iPhone"),
    q3.createChoice("Ordinateur / PC"),
    q3.createChoice("Tablette"),
    q3.createChoice("Je mélange téléphone + PC")
  ]);

  var q4 = form.addMultipleChoiceItem()
    .setTitle("Ta connexion internet, c'est comment ? *")
    .setRequired(true);
  q4.setChoices([
    q4.createChoice("J'ai le WiFi souvent, pas de problème"),
    q4.createChoice("Je suis avec des forfaits mobiles (limité)"),
    q4.createChoice("C'est compliqué, souvent pas de connexion"),
    q4.createChoice("Ça dépend des jours")
  ]);

  // ---------- SECTION B : TES HABITUDES ----------
  form.addPageBreakItem().setTitle("B. Comment tu révises ?");

  var q5 = form.addMultipleChoiceItem()
    .setTitle("En dehors des cours, tu révises à quelle fréquence ? *")
    .setRequired(true);
  q5.setChoices([
    q5.createChoice("Tous les jours"),
    q5.createChoice("Plusieurs fois par semaine"),
    q5.createChoice("Seulement le week-end"),
    q5.createChoice("Seulement à la veille des examens 😅"),
    q5.createChoice("Rarement")
  ]);

  var q6 = form.addCheckboxItem()
    .setTitle("Tu révises plutôt quand ? (plusieurs réponses possibles)")
    .setRequired(false);
  q6.setChoices([
    q6.createChoice("Le matin"),
    q6.createChoice("L'après-midi"),
    q6.createChoice("Le soir / la nuit"),
    q6.createChoice("Le week-end"),
    q6.createChoice("Dans le bus / transport")
  ]);

  var q7 = form.addMultipleChoiceItem()
    .setTitle("Ton support principal pour réviser aujourd'hui, c'est quoi ? *")
    .setRequired(true);
  q7.setChoices([
    q7.createChoice("Les PDF sur mon téléphone"),
    q7.createChoice("Les PDF sur PC"),
    q7.createChoice("Cahiers / photocopies papier"),
    q7.createChoice("Vidéos YouTube"),
    q7.createChoice("Groupes WhatsApp"),
    q7.createChoice("Je mélange tout")
  ]);
  q7.showOtherOption(true);

  var q8 = form.addCheckboxItem()
    .setTitle("Ta méthode préférée pour retenir ? (plusieurs réponses possibles) *")
    .setRequired(true);
  q8.setChoices([
    q8.createChoice("Relire les cours"),
    q8.createChoice("Faire des exercices / TD"),
    q8.createChoice("Fiches / résumés courts"),
    q8.createChoice("Flashcards (cartes mémoire)"),
    q8.createChoice("QCM / quiz"),
    q8.createChoice("Réviser en groupe avec des amis"),
    q8.createChoice("Regarder des vidéos explicatives")
  ]);

  var q9 = form.addCheckboxItem()
    .setTitle("Ta PLUS GRANDE difficulté pour réviser aujourd'hui ? (2-3 réponses max) *")
    .setRequired(true);
  q9.setChoices([
    q9.createChoice("Je ne trouve pas les bons documents / pas à jour"),
    q9.createChoice("Les documents sont éparpillés partout (WhatsApp, amis...)"),
    q9.createChoice("Manque d'exercices corrigés"),
    q9.createChoice("Cours difficiles à comprendre seul"),
    q9.createChoice("Je manque d'organisation / de planning"),
    q9.createChoice("Connexion internet / pas de forfait"),
    q9.createChoice("Motivation / concentration")
  ]);
  q9.showOtherOption(true);

  // ---------- SECTION C : TERANGA CAMPUS AUJOURD'HUI ----------
  form.addPageBreakItem().setTitle("C. Teranga Campus aujourd'hui");

  var q10 = form.addMultipleChoiceItem()
    .setTitle("Tu connais / utilises Teranga Campus ? *")
    .setRequired(true);
  q10.setChoices([
    q10.createChoice("Oui, souvent"),
    q10.createChoice("Oui, parfois"),
    q10.createChoice("J'en ai entendu parler mais jamais utilisé"),
    q10.createChoice("Non, c'est la première fois")
  ]);

  form.addScaleItem()
    .setTitle("Si tu l'as déjà utilisé : c'est facile de trouver un cours ? (1 = très difficile, 5 = très facile)")
    .setBounds(1, 5)
    .setLabels("Très difficile", "Très facile")
    .setRequired(false);

  var q12 = form.addCheckboxItem()
    .setTitle("Qu'est-ce que tu utilises le plus sur Teranga Campus ?")
    .setRequired(false);
  q12.setChoices([
    q12.createChoice("Cours (PDF)"),
    q12.createChoice("TD / Exercices"),
    q12.createChoice("Corrections"),
    q12.createChoice("Flashcards"),
    q12.createChoice("Barre de recherche"),
    q12.createChoice("Je n'ai jamais utilisé")
  ]);

  form.addTextItem()
    .setTitle("Qu'est-ce qui te MANQUE le plus sur Teranga Campus aujourd'hui ? (1 phrase)")
    .setRequired(false);

  // ---------- SECTION D : FONCTIONNALITÉS ----------
  form.addPageBreakItem().setTitle("D. Ce que tu veux pour demain 🚀");

  var q14 = form.addCheckboxItem()
    .setTitle("Choisis tes 3 fonctionnalités PRÉFÉRÉES (coche 3 max) *")
    .setRequired(true);
  q14.setChoices([
    q14.createChoice("QCM avec correction automatique"),
    q14.createChoice("Fiches résumé par chapitre"),
    q14.createChoice("Plus de TD + corrections détaillées"),
    q14.createChoice("Flashcards pour toutes les matières"),
    q14.createChoice("Mode hors-ligne (réviser sans connexion)"),
    q14.createChoice("Télécharger les PDF facilement"),
    q14.createChoice("Recherche puissante (trouver vite un chapitre)"),
    q14.createChoice("Suivi de progression (où j'en suis)"),
    q14.createChoice("Favoris (sauvegarder mes cours)"),
    q14.createChoice("Notifications quand un nouveau cours arrive"),
    q14.createChoice("Forum / entraide entre étudiants"),
    q14.createChoice("Planning de révision automatique")
  ]);

  form.addScaleItem()
    .setTitle("Le mode HORS-LIGNE (réviser sans internet), c'est important pour toi ? (1 = pas du tout, 5 = indispensable) *")
    .setBounds(1, 5)
    .setLabels("Pas du tout", "Indispensable")
    .setRequired(true);

  var q16 = form.addMultipleChoiceItem()
    .setTitle("Pour comprendre vite un chapitre, tu préfères quoi ? *")
    .setRequired(true);
  q16.setChoices([
    q16.createChoice("Lire le PDF complet du prof"),
    q16.createChoice("Une fiche courte qui résume l'essentiel"),
    q16.createChoice("Une vidéo courte qui explique"),
    q16.createChoice("Faire directement un QCM / des exercices"),
    q16.createChoice("Demander à un ami / groupe WhatsApp")
  ]);

  var q17 = form.addMultipleChoiceItem()
    .setTitle("Veux-tu un COMPTE perso pour sauvegarder tes favoris et ta progression ? *")
    .setRequired(true);
  q17.setChoices([
    q17.createChoice("Oui, c'est très utile"),
    q17.createChoice("Non, je préfère sans compte, simple et rapide"),
    q17.createChoice("Peu importe")
  ]);

  var q18 = form.addMultipleChoiceItem()
    .setTitle("Serais-tu prêt à PARTAGER tes propres fiches / TD pour aider les autres ?")
    .setRequired(false);
  q18.setChoices([
    q18.createChoice("Oui, avec plaisir !"),
    q18.createChoice("Peut-être, si c'est simple"),
    q18.createChoice("Non")
  ]);

  // ---------- SECTION E : STYLE / DESIGN ----------
  form.addPageBreakItem().setTitle("E. Le style que tu aimes 🎨");

  var q19 = form.addMultipleChoiceItem()
    .setTitle("Tu préfères quel thème ? *")
    .setRequired(true);
  q19.setChoices([
    q19.createChoice("Clair (fond blanc, simple)"),
    q19.createChoice("Sombre / Dark mode 🌙"),
    q19.createChoice("Automatique (comme mon téléphone)")
  ]);

  var q20 = form.addMultipleChoiceItem()
    .setTitle("Quel style visuel tu aimes pour une appli de révision ? *")
    .setRequired(true);
  q20.setChoices([
    q20.createChoice("Simple, rapide et léger (l'essentiel)"),
    q20.createChoice("Moderne et coloré, avec images"),
    q20.createChoice("Sérieux / universitaire")
  ]);

  var q21 = form.addMultipleChoiceItem()
    .setTitle("Pour lire un cours, tu préfères ? *")
    .setRequired(true);
  q21.setChoices([
    q21.createChoice("Lire directement sur le site"),
    q21.createChoice("Télécharger le PDF"),
    q21.createChoice("Les deux selon le moment")
  ]);

  var q22 = form.addCheckboxItem()
    .setTitle("Sur téléphone, qu'est-ce qui compte le PLUS pour toi ? (2 réponses max)")
    .setRequired(false);
  q22.setChoices([
    q22.createChoice("Que ça marche vite même avec une faible connexion"),
    q22.createChoice("Gros boutons, facile à utiliser"),
    q22.createChoice("Texte grand et lisible"),
    q22.createChoice("Mode nuit pour lire le soir"),
    q22.createChoice("Beau design")
  ]);

  // ---------- SECTION F : POUR FINIR ----------
  form.addPageBreakItem().setTitle("F. Dernière ligne droite 🙏");

  form.addTextItem()
    .setTitle("Quelle est ta matière la PLUS DIFFICILE / prioritaire ? (ex : Comptabilité, Microéconomie...)")
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("Si tu avais une baguette magique, tu changerais QUOI sur Teranga Campus ? (réponse libre)")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Ton WhatsApp ou email pour tester la nouvelle version en avant-première ? (facultatif)")
    .setHelpText("On ne partagera jamais ton contact. Juste pour te prévenir quand la nouvelle version sort.")
    .setRequired(false);

  Logger.log("✅ FORMULAIRE CRÉÉ !");
  Logger.log("🔗 LIEN À PARTAGER AUX ÉTUDIANTS : " + form.getPublishedUrl());
  Logger.log("📊 LIEN POUR VOIR LES RÉPONSES : " + form.getEditUrl());
}
