import { Vehicle } from '../types/vehicle';
import { formatNaira } from './currency';

export const WHATSAPP_PHONE_NUMBER = '2347033325827';
export const WHATSAPP_DISPLAY_NUMBER = '+234 703 332 5827';
export const WHATSAPP_LOCAL_NUMBER = '07033325827';

/**
 * Creates a dynamic WhatsApp message link for a specific vehicle listing.
 */
export function createVehicleWhatsAppLink(car: Vehicle): string {
  const formattedPrice = formatNaira(car.price);
  
  const message = `Hello AHAVA AUTOS, I am interested in the ${car.brand} ${car.model} ${car.year} advertised on your website.

Listed Price: ${formattedPrice}
Location: ${car.location}
Vehicle Reference: ${car.id}

Please provide more information about this vehicle and let me know how I can arrange an inspection. Thank you.`;

  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates a WhatsApp link for general enquiries or custom vehicle requests.
 */
export function createGeneralWhatsAppLink(customPrompt?: string): string {
  const message = customPrompt || `Hello AHAVA AUTOS, I am contacting you from your website to enquire about available vehicles and car inspection in Nigeria.`;
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates a WhatsApp link from the contact enquiry form.
 */
export function createContactFormWhatsAppLink(data: {
  name: string;
  phone: string;
  carInterest: string;
  message: string;
}): string {
  const message = `Hello AHAVA AUTOS,
My name is ${data.name}.
Phone: ${data.phone}
Vehicle of Interest: ${data.carInterest}

Message:
${data.message}

Please get back to me with availability details and inspection schedule. Thank you.`;

  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Native Web Share API helper with clipboard fallback
 */
export async function shareVehicle(car: Vehicle): Promise<{ success: boolean; fallbackCopied?: boolean }> {
  const shareData = {
    title: `${car.brand} ${car.model} ${car.year} | AHAVA AUTOS`,
    text: `Check out this ${car.condition} ${car.brand} ${car.model} ${car.year} (${formatNaira(car.price)}) located in ${car.location} on AHAVA AUTOS.`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true };
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return { success: false };
      }
    }
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    return { success: true, fallbackCopied: true };
  } catch {
    return { success: false };
  }
}

/**
 * Helper to download current car photo
 */
export async function downloadCarImage(imageUrl: string, filename: string): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // If CORS or local blob fails, trigger direct download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.download = `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
