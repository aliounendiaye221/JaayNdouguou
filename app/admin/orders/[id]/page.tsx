import { prisma } from "@/app/utils/prisma";
import { notFound } from "next/navigation";
import { Printer, ArrowLeft, Phone, MapPin, Package, Truck } from "lucide-react";
import Link from "next/link";
import InvoiceActions from "./InvoiceActions";

// Using default export for page component
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params object before accessing properties (Next.js 15+ requirement)
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: true,
            items: {
                include: { product: true }
            }
        }
    });

    if (!order) notFound();

    const getStatusInfo = (status: string) => {
        const statusMap: any = {
            pending: { label: 'En attente', color: 'bg-orange-100 text-orange-700 border-orange-200' },
            confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            preparing: { label: 'En préparation', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            delivering: { label: 'En livraison', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            delivered: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
            cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700 border-red-200' },
        };
        return statusMap[status] || statusMap.pending;
    };

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 print:hidden">
                <Link href="/admin/orders" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour aux commandes</span>
                </Link>
                <InvoiceActions />
            </div>

            {/* Order Status Banner */}
            <div className={`p-4 sm:p-6 rounded-2xl border-2 ${statusInfo.color} print:hidden`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold mb-0.5">Statut de la commande</h3>
                        <p className="text-xs sm:text-sm opacity-90">{statusInfo.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {order.status === 'delivering' && <Truck className="w-6 h-6 sm:w-8 sm:h-8" />}
                        {order.status === 'delivered' && <Package className="w-6 h-6 sm:w-8 sm:h-8" />}
                    </div>
                </div>
            </div>

            {/* Invoice Container - Printable Area */}
            <div className="bg-white p-4 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 print:shadow-none print:border-none" id="invoice"
                style={{ pageBreakAfter: 'avoid' }}>
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 border-b-2 border-gray-200 pb-6 sm:pb-8 mb-6 sm:mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-emerald-600 mb-2 sm:mb-3">JaayNdougou</h1>
                        <p className="text-gray-600 text-sm font-medium">Marché Digital de Produits Frais</p>
                        <p className="text-gray-600 text-xs sm:text-sm">Dakar & Rufisque, Sénégal</p>
                        <p className="text-gray-600 text-xs sm:text-sm">Tél: +221 78 603 79 13</p>
                        <p className="text-gray-600 text-xs sm:text-sm">Email: contact@jaayndougou.sn</p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2">FACTURE</h2>
                        <p className="text-gray-700 font-mono text-base sm:text-xl font-bold">#{order.orderNumber}</p>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">Date: {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}</p>
                        <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 justify-start sm:justify-end">
                            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold border ${statusInfo.color}`}>
                                Statut: {statusInfo.label}
                            </div>
                            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold border
                                ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                {order.paymentStatus === 'paid' ? '✓ PAYÉ' : 'EN ATTENTE'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer & Delivery Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-12">
                    <div className="bg-slate-50 p-4 sm:p-6 rounded-xl">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Informations Client</h3>
                        <div className="text-slate-900 font-bold text-base sm:text-lg mb-2">{order.customer.firstName} {order.customer.lastName}</div>
                        <div className="flex items-center gap-2 text-slate-700 mb-1">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <a href={`tel:${order.customer.phone}`} className="font-bold text-emerald-700 hover:underline">
                                {order.customer.phone}
                            </a>
                        </div>
                        <div className="text-slate-600 text-xs sm:text-sm">{order.customer.email}</div>
                    </div>
                    <div className="bg-emerald-50 p-4 sm:p-6 rounded-xl">
                        <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3">Adresse de Livraison</h3>
                        <div className="flex items-start gap-2 text-slate-800">
                            <MapPin className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                            <div>
                                <span className="block font-bold text-sm sm:text-base">{order.deliveryAddress}</span>
                                <span className="block text-slate-600 text-xs sm:text-sm mt-0.5">{order.deliveryCity}</span>
                                <span className="block text-slate-600 font-medium text-xs sm:text-sm mt-1">Tél livraison: {order.deliveryPhone}</span>
                            </div>
                        </div>
                        {order.deliveryNotes && (
                            <div className="mt-3 p-2.5 bg-yellow-50 text-yellow-800 text-xs rounded-lg border border-yellow-200">
                                <strong>Note:</strong> {order.deliveryNotes}
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-blue-900">Mode de paiement:</span>
                        <span className="text-xs sm:text-sm font-black text-blue-700 uppercase">
                            {order.paymentMethod === 'cod' ? '💵 Espèces à la livraison' :
                             order.paymentMethod === 'wave' ? '📱 Wave' :
                             order.paymentMethod === 'orange-money' ? '🟠 Orange Money' : order.paymentMethod}
                        </span>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-6 sm:mb-10">
                    <table className="w-full min-w-[340px]">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider">Article</th>
                                <th className="text-center py-3 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider">Qté</th>
                                <th className="text-right py-3 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider">Prix Unit.</th>
                                <th className="text-right py-3 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 sm:py-5">
                                        <div className="font-bold text-gray-900 text-sm sm:text-base">{item.product.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{item.product.category} · {item.product.unit}</div>
                                    </td>
                                    <td className="py-3 sm:py-5 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 text-emerald-700 font-black rounded-lg text-xs sm:text-sm">
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td className="py-3 sm:py-5 text-right text-gray-700 font-bold text-xs sm:text-sm">{item.price.toLocaleString()} F</td>
                                    <td className="py-3 sm:py-5 text-right font-black text-gray-900 text-xs sm:text-base">{(item.price * item.quantity).toLocaleString()} FCFA</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="border-t-2 border-gray-200 pt-6 sm:pt-8">
                    <div className="flex justify-end">
                        <div className="w-full sm:w-80 space-y-3">
                            <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                                <span className="font-medium">Sous-total</span>
                                <span className="font-bold">{order.subtotal.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                                <span className="font-medium">Frais de livraison</span>
                                <span className="font-bold">{order.deliveryFee.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between text-lg sm:text-2xl font-black text-emerald-600 border-t-2 border-emerald-200 pt-3 bg-emerald-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl">
                                <span>TOTAL</span>
                                <span>{order.total.toLocaleString()} FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
                    <p className="font-bold text-lg text-emerald-600 mb-2">Merci de votre confiance !</p>
                    <p className="text-sm">Pour toute question concernant cette facture, contactez-nous au +221 78 603 79 13</p>
                    <p className="text-xs mt-4 text-gray-400">JaayNdougou - Facture {order.orderNumber} - Émise le {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>
        </div>
    );
}
