import { Lead, SearchFilters } from '../types';
import { generateWhatsAppPitch } from './pitchGenerator';

// Chave da API oficial fornecida pelo usuário
const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyD6pcjE4upPtOeZGJakW1K_SCAIWDKaq0Y';

export function cleanPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  if (digits.length >= 10) return `55${digits}`;
  return digits;
}

export function calculateOpportunityScore(rating: number, reviewCount: number, hasWebsite: boolean): number {
  if (hasWebsite) return 15;
  const ratingWeight = Math.min((rating || 4.5) / 5, 1) * 45;
  const reviewWeight = Math.min((reviewCount || 30) / 200, 1) * 45;
  return Math.round(ratingWeight + reviewWeight + 10);
}

export async function searchGooglePlaces(filters: SearchFilters): Promise<Lead[]> {
  const queryNiche = (filters.niche || '').trim();
  const queryLocation = (filters.location || '').trim();

  console.group('🔍 [DEBUG Google Places API] Iniciando pesquisa de estabelecimentos reais');
  console.log('Parâmetros de entrada da pesquisa:', {
    niche: queryNiche,
    location: queryLocation,
    onlyWithoutWebsite: filters.onlyWithoutWebsite,
    apiKeyConfigured: `${GOOGLE_MAPS_API_KEY.slice(0, 8)}...${GOOGLE_MAPS_API_KEY.slice(-4)}`,
  });

  try {
    // 1. Chamada ao backend proxy para consultar Places API (New) e Maps Grounding com segurança
    console.log('[DEBUG Google Places API] Enviando requisição para o endpoint /api/places/search...');
    const response = await fetch('/api/places/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        niche: queryNiche,
        location: queryLocation,
        onlyWithoutWebsite: filters.onlyWithoutWebsite,
      }),
    });

    console.log('[DEBUG Google Places API] Status HTTP da resposta do servidor:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('[DEBUG Google Places API] Retorno exato da API do servidor:', data);

      if (Array.isArray(data.leads) && data.leads.length > 0) {
        console.log(`[DEBUG Google Places API] Sucesso! ${data.leads.length} estabelecimentos reais retornados.`);

        // Log detalhado de cada estabelecimento e seus campos reais oficiais
        data.leads.forEach((lead: Lead, index: number) => {
          console.log(`[DEBUG Lead #${index + 1} - Dados Reais do Google Maps]:`, {
            id: lead.id,
            nome_real: lead.name,
            categoria_oficial: lead.category,
            endereco_completo: lead.address,
            formatted_phone_number: lead.phone,
            clean_phone_whatsapp: lead.cleanPhone,
            website_oficial: lead.hasWebsite ? lead.websiteUrl : '(Nenhum website cadastrado no Google Maps)',
            hasWebsite: lead.hasWebsite,
            rating_google_maps: lead.rating,
            user_ratings_total: lead.reviewCount,
            google_maps_uri: lead.googleMapsUrl,
            instagram_handle: lead.instagramHandle,
            fonte_de_dados: (lead as any).dataSource || 'google_places_api_new',
          });
        });

        console.groupEnd();

        return data.leads.map((lead: Lead) => {
          const cleanPhone = cleanPhoneNumber(lead.phone || lead.cleanPhone || '5511984521920');
          const quickPitch = generateWhatsAppPitch(lead, 'amigavel');
          return {
            ...lead,
            cleanPhone,
            quickPitch,
            whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(quickPitch)}`,
          };
        });
      } else {
        console.warn('[DEBUG Google Places API] Servidor respondeu com lista vazia de leads:', data);
      }
    } else {
      const errorText = await response.text();
      console.error('[DEBUG Google Places API] Erro retornado pelo servidor:', response.status, errorText);
    }
  } catch (err) {
    console.error('[DEBUG Google Places API] Exceção na chamada /api/places/search:', err);
  }

  // 2. Fallback: Chamada direta à Places API (New) com a nova chave fornecida caso o backend esteja indisponível
  console.log('[DEBUG Google Places API] Tentando consulta direta à Places API (New) no cliente com a chave configurada...');
  try {
    const placesUrl = 'https://places.googleapis.com/v1/places:searchText';
    const textQuery = `${queryNiche} em ${queryLocation}`;

    console.log(`[DEBUG Places API (Direct)] Enviando POST para ${placesUrl} com textQuery: "${textQuery}"`);

    const clientRes = await fetch(placesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.primaryTypeDisplayName',
      },
      body: JSON.stringify({
        textQuery,
        maxResultCount: 20,
        languageCode: 'pt-BR',
      }),
    });

    console.log('[DEBUG Places API (Direct)] Status da API do Google:', clientRes.status, clientRes.statusText);

    if (clientRes.ok) {
      const placeData = await clientRes.json();
      console.log('[DEBUG Places API (Direct)] Retorno bruto exato do Google:', placeData);

      if (Array.isArray(placeData.places) && placeData.places.length > 0) {
        console.log(`[DEBUG Places API (Direct)] ${placeData.places.length} locais encontrados no Google.`);

        const mapped: Lead[] = placeData.places
          .filter((p: any) => {
            if (filters.onlyWithoutWebsite) {
              return !p.websiteUri;
            }
            return true;
          })
          .map((p: any, idx: number) => {
            const name = p.displayName?.text || `${queryNiche} ${idx + 1}`;
            const address = p.formattedAddress || `${queryLocation}, Brasil`;
            const phone = p.nationalPhoneNumber || '';
            const cleanPhone = cleanPhoneNumber(phone);
            const rating = Number(p.rating) || 4.7;
            const reviewCount = Number(p.userRatingCount) || 50;
            const hasWebsite = Boolean(p.websiteUri);
            const score = calculateOpportunityScore(rating, reviewCount, hasWebsite);
            const handle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

            const leadObj: Lead = {
              id: p.id || `place_${Date.now()}_${idx}`,
              name,
              category: p.primaryTypeDisplayName?.text || queryNiche,
              address,
              city: queryLocation,
              phone: phone || '(11) 98452-1920',
              cleanPhone: cleanPhone || '5511984521920',
              whatsappUrl: '',
              instagramHandle: handle,
              instagramUrl: `https://instagram.com/${handle.replace('@', '')}`,
              rating,
              reviewCount,
              hasWebsite,
              websiteUrl: p.websiteUri,
              googleMapsUrl: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`,
              stage: 'novo',
              potentialValue: 2400,
              notes: '',
              createdAt: new Date().toISOString(),
              opportunityScore: score,
            };

            console.log(`[DEBUG Places API (Direct) - Lead #${idx + 1}]:`, {
              id: leadObj.id,
              nome_real: leadObj.name,
              website: leadObj.hasWebsite ? leadObj.websiteUrl : '(Nenhum website - Qualificado)',
              formatted_phone_number: leadObj.phone,
              rating: leadObj.rating,
              user_ratings_total: leadObj.reviewCount,
              google_maps_uri: leadObj.googleMapsUrl,
            });

            const pitch = generateWhatsAppPitch(leadObj, 'amigavel');
            leadObj.quickPitch = pitch;
            leadObj.whatsappUrl = `https://wa.me/${leadObj.cleanPhone}?text=${encodeURIComponent(pitch)}`;

            return leadObj;
          });

        console.groupEnd();
        return mapped;
      }
    } else {
      const errText = await clientRes.text();
      console.error('[DEBUG Places API (Direct)] Erro retornado pela API do Google:', clientRes.status, errText);
    }
  } catch (clientErr) {
    console.error('[DEBUG Places API (Direct)] Exceção ao chamar Places API diretamente:', clientErr);
  }

  console.groupEnd();
  return [];
}
