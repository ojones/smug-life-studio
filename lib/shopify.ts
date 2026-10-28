// Shopify Storefront & Admin API integration utilities

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken?: string;
  adminAccessToken?: string;
}

export function getShopifyConfig(): ShopifyConfig {
  return {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
    adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''
  };
}

export async function createShopifyCheckoutSession(payload: {
  designId: string;
  title: string;
  quantity: number;
  basePrice: number;
  artworkUrl: string;
  customerEmail?: string;
  shippingAddress?: any;
}) {
  const config = getShopifyConfig();
  
  if (!config.storeDomain || !config.storefrontAccessToken) {
    // Return simulated instant checkout
    return {
      checkoutUrl: `/checkout/simulated?designId=${payload.designId}&price=${payload.basePrice}`,
      checkoutId: `sim-chk-${Date.now()}`
    };
  }

  // Real Storefront GraphQL checkout create
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const res = await fetch(`https://${config.storeDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            email: payload.customerEmail,
            lineItems: [
              {
                variantId: 'gid://shopify/ProductVariant/1', // Will use fallback if not configured
                quantity: payload.quantity,
                customAttributes: [
                  { key: 'ArtworkTitle', value: payload.title },
                  { key: 'ArtworkURL', value: payload.artworkUrl },
                  { key: 'PrintFormat', value: '11oz Ceramic Mug Wrap 8.25x3.85"' }
                ]
              }
            ]
          }
        }
      })
    });

    const data = await res.json();
    if (data?.data?.checkoutCreate?.checkout?.webUrl) {
      return {
        checkoutUrl: data.data.checkoutCreate.checkout.webUrl,
        checkoutId: data.data.checkoutCreate.checkout.id
      };
    }
  } catch (err) {
    console.error('Shopify API Error:', err);
  }

  return {
    checkoutUrl: `https://${config.storeDomain || 'checkout.shopify.com'}/cart`,
    checkoutId: `chk-${Date.now()}`
  };
}
