"use client";
import { Printer, Download, Mail } from "lucide-react";

export default function InvoiceActions() {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        // Pour implémenter avec une librarie comme jsPDF ou en générant un PDF côté serveur
        window.print(); // Pour l'instant, utilise le système d'impression du navigateur
    };

    return (
        <div className="flex items-center gap-3 print:hidden">
            <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
                <Printer className="w-4 h-4" />
                Imprimer Facture
            </button>
            <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
                <Download className="w-4 h-4" />
                Télécharger PDF
            </button>
        </div>
    );
}
