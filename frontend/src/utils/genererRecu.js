import jsPDF from 'jspdf'

export function genererRecu(vente, parametres) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 150] // Format ticket de caisse
  })

  const devise = parametres?.devise ?? 'FCFA'
  const nomRestaurant = parametres?.nom_restaurant ?? 'RestauManager'
  const adresse = parametres?.adresse ?? ''
  const telephone = parametres?.telephone ?? ''

  let y = 10

  // En-tête
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(nomRestaurant, 40, y, { align: 'center' })
  y += 6

  if (adresse) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(adresse, 40, y, { align: 'center' })
    y += 5
  }

  if (telephone) {
    doc.setFontSize(8)
    doc.text(`Tél: ${telephone}`, 40, y, { align: 'center' })
    y += 5
  }

  // Séparateur
  doc.setLineWidth(0.3)
  doc.line(5, y, 75, y)
  y += 5

  // Infos vente
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Reçu N°: ${vente.id}`, 5, y)
  y += 4
  doc.text(`Date: ${new Date(vente.dateHeure).toLocaleString('fr-FR')}`, 5, y)
  y += 4
  doc.text(`Caissier: ${vente.employe?.prenom} ${vente.employe?.nom}`, 5, y)
  y += 5

  // Séparateur
  doc.line(5, y, 75, y)
  y += 5

  // En-tête articles
  doc.setFont('helvetica', 'bold')
  doc.text('Article', 5, y)
  doc.text('Qté', 45, y)
  doc.text('Prix', 58, y)
  doc.text('Total', 68, y)
  y += 4

  doc.setLineWidth(0.1)
  doc.line(5, y, 75, y)
  y += 4

  // Articles
  doc.setFont('helvetica', 'normal')
  vente.lignes?.forEach(ligne => {
    const nom = ligne.article?.nom ?? ''
    const qty = ligne.quantite
    const prix = Number(ligne.prixUnitaire).toLocaleString('fr-FR')
    const total = Number(ligne.sousTotal).toLocaleString('fr-FR')

    // Tronquer le nom si trop long
    const nomCourt = nom.length > 20 ? nom.substring(0, 18) + '..' : nom

    doc.text(nomCourt, 5, y)
    doc.text(String(qty), 45, y)
    doc.text(prix, 52, y)
    doc.text(total, 66, y)
    y += 5
  })

  // Séparateur
  doc.setLineWidth(0.3)
  doc.line(5, y, 75, y)
  y += 5

  // Total
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL', 5, y)
  doc.text(
    `${Number(vente.montantTotal).toLocaleString('fr-FR')} ${devise}`,
    75, y, { align: 'right' }
  )
  y += 8

  // Séparateur
  doc.setLineWidth(0.3)
  doc.line(5, y, 75, y)
  y += 6

  // Message de remerciement
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('Merci pour votre visite !', 40, y, { align: 'center' })
  y += 4
  doc.text('À bientôt !', 40, y, { align: 'center' })

  // Télécharger le PDF
  doc.save(`recu-${vente.id}.pdf`)
}