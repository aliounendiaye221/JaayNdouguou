import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/app/utils/email';
import { z } from 'zod';

// Validation schema
const contactSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    phone: z.string().min(8, 'Numéro de téléphone invalide'),
    subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validatedData = contactSchema.parse(body);

        // Send email
        const result = await sendContactEmail(validatedData);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Message envoyé avec succès. Nous vous contacterons bientôt.',
            });
        } else {
            // Even if email fails, log the contact for manual follow-up
            console.error('Email sending failed, but contact logged:', validatedData);

            return NextResponse.json({
                success: true,
                message: 'Message reçu. Nous vous contacterons via WhatsApp au ' +
                    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
            });
        }
    } catch (error) {
        console.error('Error processing contact form:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Erreur de validation',
                    details: error.issues.map((e: z.ZodIssue) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Échec de l\'envoi du message' },
            { status: 500 }
        );
    }
}
