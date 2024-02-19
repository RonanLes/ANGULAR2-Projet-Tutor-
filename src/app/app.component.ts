import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PDFbuilder';
  titleFontSize = 16;
  descriptionFontSize = 12;
  instructionsFontSize = 10;
  demandeurFontSize = 12;
  piecesFontSize = 10;
  attestationFontSize = 10;
  administrationFontSize = 10;
  constructor() {}

  generatePDF() {
    // Création d'une nouvelle instance de jsPDF
    const doc = new jsPDF();

    // Définition des dimensions du cadre
    const cadreX = 10;
    const cadreY = 10;
    const cadreWidth = 190;
    const cadreHeight = 250;
    let currentY = cadreY; // Variable pour suivre la position actuelle Y
 
    
    // Dessin du cadre
    doc.rect(cadreX, cadreY, cadreWidth, cadreHeight);

    // Ajout du titre
    const title = 'ACTION SOCIALE D’INITIATIVE ACADÉMIQUE';
    doc.setFontSize(this.titleFontSize);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (cadreWidth - titleWidth) / 2 + cadreX; // Position horizontale centrée
    let titleY = cadreY + 20; // Décalage vers le bas pour l'espacement
    doc.text(title, titleX, titleY);

    // Calcul de la hauteur utilisée par le titre
    const titleHeight = doc.getTextDimensions(title).h;

    // Décalage pour la prochaine section
    titleY += titleHeight + 10;

    // Ajout de la description
    const description =
      'Exercice 2023 - Aide compensatoire à l’éloignement professionnel';
    doc.setFontSize(this.descriptionFontSize);
    const descriptionWidth = doc.getTextWidth(description);
    const descriptionX = (cadreWidth - descriptionWidth) / 2 + cadreX; // Position horizontale centrée
    let descriptionY = titleY + 10; // Décalage vers le bas pour l'espacement
    doc.text(description, descriptionX, descriptionY);

    // Calcul de la hauteur utilisée par la description
    const descriptionHeight = doc.getTextDimensions(description).h;

    // Décalage pour la prochaine section
    descriptionY += descriptionHeight + 10;

    // Ajout des instructions
    const instructions =
      'Ne pas attendre la date limite d’envoi pour déposer le dossier';
    doc.setFontSize(this.instructionsFontSize);
    const instructionsWidth = doc.getTextWidth(instructions);
    const instructionsX = (cadreWidth - instructionsWidth) / 2 + cadreX; // Position horizontale centrée
    let instructionsY = descriptionY + 10; // Décalage vers le bas pour l'espacement
    doc.text(instructions, instructionsX, instructionsY);

    // Calcul de la hauteur utilisée par les instructions
    const instructionsHeight = doc.getTextDimensions(instructions).h;

    // Décalage pour la prochaine section
    instructionsY += instructionsHeight + 10;

    // Ajout des informations du demandeur
    const demandeurX = cadreX + 10;
    let demandeurY = instructionsY + 15;

    doc.setFontSize(this.demandeurFontSize);
    doc.text('DEMANDEUR', demandeurX, demandeurY);

    demandeurY += 10;
    const demandeInfos = [
      {
        label: 'Nom d’usage et Prénom Né(e) le',
        value: '______________________________',
      },
      {
        label: 'Adresse familiale',
        value: '___________________________________',
      },
      {
        label: 'Etablissement d’exercice',
        value: '________________________________________________',
      },
      { label: 'Grade', value: '________________' },
      { label: 'IBAN', value: 'FR _________________' },
      {
        label: 'Distance domicile / travail du conjoint',
        value: '____________ Km',
      },
      {
        label: 'Combien de nuits restez-vous sur place ?',
        value: '__________',
      },
      {
        label: 'Combien d’aller/retour effectuez-vous par semaine ?',
        value: '__________',
      },
      {
        label: 'Période sollicitée',
        value: '________________________________________________',
      },
      {
        label: 'Coût du 2ème hébergement pour la période concernée',
        value: '_______________ €',
      },
    ];

    demandeurY += 10;
    demandeInfos.forEach((info) => {
      const labelWidth = doc.getTextWidth(info.label);
      doc.text(info.label, demandeurX, demandeurY);
      doc.text(info.value, demandeurX + labelWidth + 10, demandeurY);
      demandeurY += 10;
    });

    // Ajout des pièces à fournir
    const piecesX = cadreX + 10;
    let piecesY = demandeurY + 10;

    doc.text('Pièces à fournir obligatoirement :', piecesX, piecesY);
    const pieces = [
      "- arrêté d'affectation ou contrat de travail",
      '- 3 factures ou quittances de loyer du 2ème hébergement de la période concernée, au nom du demandeur',
      '- attestation d’assurance habitation de la résidence familiale au nom du demandeur',
    ];

    piecesY += 10;
    pieces.forEach((piece) => {
      doc.text(piece, piecesX, piecesY);
      piecesY += 5;
    });

    // Ajout de l'attestation sur l'honneur
    const attestationX = cadreX + 10;
    let attestationY = piecesY + 5;

    doc.text('ATTESTATION SUR L’HONNEUR', attestationX, attestationY);
    attestationY += 5;
    doc.text(
      'Je soussigné(e) …………………………………………………..…………, ',
      attestationX,
      attestationY
    );
    attestationY += 5;
    doc.text(
      'certifie sur l’honneur l’exactitude des renseignements ci-dessus ',
      attestationX,
      attestationY
    );
    attestationY += 5;
    doc.text(
      'Fait à …………………....................………………, le ……………………….. ',
      attestationX,
      attestationY
    );
    attestationY += 5;
    doc.text('Signature', attestationX, attestationY);

    currentY = this.addAdministration(
      doc,
      cadreX,
      attestationY,
      cadreWidth,
      cadreHeight
    );

    // Si le contenu dépasse la première page, ajouter une nouvelle page et continuer
    while (currentY > cadreHeight) {
      doc.addPage();
      currentY = cadreY;
      // currentY = this.addContent(doc, cadreX, currentY, cadreWidth, cadreHeight);
    }

    // Enreg istrement du PDF
    doc.save('formulaire.pdf');
  }
  getPositionOfCharacter(text: string, char: string, font: string, size: number): number {
    // Création d'une nouvelle instance de jsPDF pour obtenir la largeur du texte
    const tempDoc = new jsPDF();
    tempDoc.setFont(font);
    tempDoc.setFontSize(size);

    // Largeur du texte jusqu'au caractère spécifié
    const widthUntilChar = tempDoc.getStringUnitWidth(text.substring(0, text.indexOf(char)));

    // Largeur du texte jusqu'au début du document (pour obtenir la position X du caractère)
    const widthUntilStart = tempDoc.getStringUnitWidth(text);

    // Position X du caractère
    const posX = widthUntilStart - widthUntilChar;

    // Retourne la position X du caractère
    return posX;
}
  addAdministration(
    doc: jsPDF,
    cadreX: number,
    currentY: number,
    cadreWidth: number,
    cadreHeight: number
  ) {
    // Ajout de la partie réservée à l'administration
    // Assurez-vous de mettre à jour currentY à chaque ajout de texte
    // Ajout de la partie réservée à l'administration
    const administrationX = cadreX + 10;
    let administrationY = currentY + 20;

    doc.text(
      "PARTIE RESERVÉE A L'ADMINISTRATION",
      administrationX,
      administrationY
    );
    administrationY += 10;
    doc.text(
      'La présente demande :  correspond  ne correspond pas aux critères fixés par l’arrêté rectoral.',
      administrationX,
      administrationY
    );
    administrationY += 10;
    doc.text(
      "Je soussigné, recteur de l'Académie de Dijon, décide donc d’octroyer une aide d’un montant de ……..........…………€",
      administrationX,
      administrationY
    );
    administrationY += 10;
    doc.text('Académie de Dijon', administrationX, administrationY);
    administrationY += 5;
    doc.text('Prog :', administrationX, administrationY);
    administrationY += 5;
    doc.text('Centre de coût : RECSAXO021', administrationX, administrationY);
    administrationY += 5;
    doc.text('N° pièce :', administrationX, administrationY);
    administrationY += 5;
    doc.text(
      'Pour le recteur et par délégation,',
      administrationX,
      administrationY
    );
    administrationY += 5;
    doc.text(
      'la cheffe de division des affaires financières',
      administrationX,
      administrationY
    );
    administrationY += 5;
    doc.text('Magali KHATRI', administrationX, administrationY);

    //currentY = this.addContent(doc, cadreX, currentY, cadreWidth, cadreHeight);

    return administrationY; // Retourne la nouvelle position Y après avoir ajouté la partie réservée à l'administration
  }
}
