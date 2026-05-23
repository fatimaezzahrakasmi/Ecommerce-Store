/**
 * Global constants and configuration values
 */

export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '212600000000';

export const ADMIN_PINS = process.env.NEXT_PUBLIC_ADMIN_PIN 
  ? process.env.NEXT_PUBLIC_ADMIN_PIN.split(',').map(p => p.trim())
  : ['2026'];

export const SHOP_NAME = 'BADR SPAIN MENSWEAR S.A.';
export const SHOP_EMAIL = 'contact@badrspain.com';

export const DEFAULT_PRODUCT_PRICE = 199;
export const DEFAULT_PRODUCT_SIZES = 'S,M,L,XL';
export const DEFAULT_PRODUCT_COLORS = 'Black,White';
export const DEFAULT_PRODUCT_STOCK = 20;
