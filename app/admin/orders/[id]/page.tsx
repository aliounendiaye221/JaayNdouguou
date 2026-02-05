import { prisma } from "@/app/utils/prisma";
import { notFound } from "next/navigation";
import { Printer, ArrowLeft, Phone, MapPin } from "lucide-react";
import Link from "next/link";

// Using default export for page component
export default async function OrderDetailPage({ params }: { params: { id: string } }) {
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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center print:hidden">
                <Link href="/admin/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux commandes
                </Link>
                <button
                    // In a client component this would be onClick={() => window.print()}
                    // For server component, we can use a script or simple CSS approach
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                // Add a tiny client script wrapper if needed, or user can use browser print
                >
                    <Printer className="w-4 h-4" />
                    Imprimer Facture (Ctrl+P)
                </button>
            </div>

            {/* Invoice Container - Printable Area */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none" id="invoice">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-emerald-600 mb-2">JaayNdougou</h1>
                        <p className="text-gray-500 text-sm">Marché Digital de Produits Frais</p>
                        <p className="text-gray-500 text-sm">Dakar & Rufisque, Sénégal</p>
                        <p className="text-gray-500 text-sm">+221 78 603 79 13</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">FACTURE</h2>
                        <p className="text-gray-600 font-mono text-lg">#{order.orderNumber}</p>
                        <p className="text-gray-500 text-sm mt-1">Date: {new Date(order.createdAt).toLocaleDateString('fr-SN')}</p>
                        <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border
                            ${order.paymentStatus === 'paid' ? 'border-green-200 text-green-700 bg-green-50' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                            {order.paymentStatus === 'paid' ? 'PAYÉ' : 'EN ATTENTE'}
                        </div>
                    </div>
                </div>

                {/* Customer & Delivery Details */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Facturé à</h3>
                        <div className="text-gray-900 font-bold text-lg">{order.customer.firstName} {order.customer.lastName}</div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {order.customer.phone}
                        </div>
                        <div className="text-gray-600 mt-1">{order.customer.email}</div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Livraison</h3>
                        <div className="flex items-start gap-2 text-gray-800">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                                <span className="block font-medium">{order.deliveryAddress}</span>
                                <span className="block text-gray-600">{order.deliveryCity}</span>
                            </div>
                        </div>
                        {order.deliveryNotes && (
                            <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                                Note: {order.deliveryNotes}
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2 border-gray-100">
                            <th className="text-left py-3 text-sm font-bold text-gray-600 uppercase">Article</th>
                            <th className="text-center py-3 text-sm font-bold text-gray-600 uppercase">Qté</th>
                            <th className="text-right py-3 text-sm font-bold text-gray-600 uppercase">Prix Unit.</th>
                            <th className="text-right py-3 text-sm font-bold text-gray-600 uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-4">
                                    <div className="font-bold text-gray-900">{item.product.name}</div>
                                    <div className="text-xs text-gray-400 font-mono">APP-REF: {item.productId.slice(-6)}</div>
                                </td>
                                <td className="py-4 text-center font-medium">{item.quantity}</td>
                                <td className="py-4 text-right text-gray-600">{item.price.toLocaleString()} F</td>
                                <td className="py-4 text-right font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} F</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary */}
                <div className="border-t border-gray-100 pt-8 flex justify-end">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Sous-total</span>
                            <span>{order.subtotal.toLocaleString()} F</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Livraison</span>
                            <span>{order.deliveryFee.toLocaleString()} F</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-emerald-600 border-t border-gray-100 pt-3">
                            <span>Total</span>
                            <span>{order.total.toLocaleString()} CFA</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-400 text-sm print:fixed print:bottom-8 print:left-0 print:w-full">
                    <p>Merci de votre confiance !</p>
                    <p className="mt-1">JaayNdougou - {order.orderNumber}</p>
                </div>
            </div>
        </div>
    );
}
