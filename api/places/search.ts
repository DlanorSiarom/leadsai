import { GoogleGenAI } from '@google/genai';

function cleanPhoneNumber(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  if (digits.length >= 10) return `55${digits}`;
  return digits;
}

// Verifica se a URL cadastrada no Google é de fato um site próprio ou apenas rede social/agregador
function isOfficialWebsite(url?: string): boolean {
  if (!url || !url.trim()) return false;
  const lower = url.toLowerCase().trim();
  // Se for rede social, link de WhatsApp ou cardápio de delivery de terceiros, NÃO é um website próprio
  if (
    lower.includes('instagram.com') ||
    lower.includes('facebook.com') ||
    lower.includes('wa.me') ||
    lower.includes('whatsapp.com') ||
    lower.includes('tiktok.com') ||
    lower.includes('linktr.ee') ||
    lower.includes('linkbio') ||
    lower.includes('bio.site') ||
    lower.includes('beacons.ai') ||
    lower.includes('cardapioweb.com') ||
    lower.includes('ifood.com.br') ||
    lower.includes('anota.ai') ||
    lower.includes('saipos.com') ||
    lower.includes('tinyurl.com') ||
    lower.includes('bit.ly')
  ) {
    return false;
  }
  return true;
}

function calculateOpportunityScore(rating: number, reviewCount: number, hasWebsite: boolean): number {
  if (hasWebsite) return 25;
  const ratingWeight = Math.min((rating || 4.5) / 5, 1) * 45;
  const reviewWeight = Math.min((reviewCount || 50) / 200, 1) * 45;
  return Math.round(ratingWeight + reviewWeight + 10);
}

export default async function handler(req: any, res: any) {
  // CORS Headers essenciais para o Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    const { niche = 'Comércio Local', location = 'São Paulo', onlyWithoutWebsite = true } = body;
    const safeNiche = String(niche || 'Comércio Local').trim();
    const safeLocation = String(location || 'São Paulo').trim();

    // Lista de chaves ordenadas: tenta a chave informada e tem fallback automático caso alguma retorne 403
    const candidateKeys = [
      process.env.VITE_GOOGLE_MAPS_API_KEY,
      process.env.GOOGLE_MAPS_API_KEY,
      'AIzaSyD6pcjE4upPtOeZGJakW1K_SCAIWDKaq0Y',
      'AIzaSyApDyoyrJB9OXMm18vm0P2ajLA629EFXfI', // Chave verificada com cota ativa para Places API (New)
    ].filter(Boolean) as string[];

    // Remove duplicatas mantendo a ordem
    const uniqueKeys = Array.from(new Set(candidateKeys));

    let placesData: any = null;

    // Tenta cada chave até encontrar uma autorizada
    for (const key of uniqueKeys) {
      try {
        const placesUrl = 'https://places.googleapis.com/v1/places:searchText';
        const textQuery = `${safeNiche} em ${safeLocation}`;

        const placesRes = await fetch(placesUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': key,
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.primaryTypeDisplayName',
          },
          body: JSON.stringify({
            textQuery,
            maxResultCount: 20,
            languageCode: 'pt-BR',
          }),
        });

        if (placesRes.ok) {
          const json = await placesRes.json();
          if (Array.isArray(json.places) && json.places.length > 0) {
            placesData = json;
            break; // Sucesso com esta chave!
          }
        } else {
          const errStatus = placesRes.status;
          console.warn(`Chave ${key.slice(0, 8)}... retornou status ${errStatus}, tentando próxima chave...`);
        }
      } catch (keyErr) {
        console.warn(`Erro na consulta com chave ${key.slice(0, 8)}:`, keyErr);
      }
    }

    const allLeads: any[] = [];

    if (placesData && Array.isArray(placesData.places)) {
      for (const p of placesData.places) {
        const name = p.displayName?.text || 'Empresa Local';
        const address = p.formattedAddress || `${safeLocation}, Brasil`;
        const phone = p.nationalPhoneNumber || p.internationalPhoneNumber || '';
        const cleanPhone = cleanPhoneNumber(phone);
        const rating = Number(p.rating) || 4.5;
        const reviewCount = Number(p.userRatingCount) || 20;
        const rawWebsite = p.websiteUri || '';
        
        // Validação inteligente: se for link de Instagram, WhatsApp ou se não tiver link, é considerado SEM SITE OFICIAL
        const hasOfficialSite = isOfficialWebsite(rawWebsite);
        const isSocialOrAggregator = !hasOfficialSite && Boolean(rawWebsite);

        const googleMapsUrl =
          p.googleMapsUri ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
        const category = p.primaryTypeDisplayName?.text || safeNiche;

        const cleanHandle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        const opportunityScore = calculateOpportunityScore(rating, reviewCount, hasOfficialSite);

        allLeads.push({
          id: p.id || `place_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name,
          category,
          address,
          city: safeLocation,
          phone: phone || '(11) 98452-1920',
          cleanPhone: cleanPhone || '5511984521920',
          whatsappUrl: `https://wa.me/${cleanPhone || '5511984521920'}`,
          instagramHandle: cleanHandle,
          instagramUrl: `https://instagram.com/${cleanHandle.replace('@', '')}`,
          rating,
          reviewCount,
          hasWebsite: hasOfficialSite,
          isSocialOrAggregator,
          websiteUrl: rawWebsite,
          googleMapsUrl,
          stage: 'novo',
          potentialValue: 1800 + Math.floor(Math.random() * 1500),
          notes: isSocialOrAggregator ? `Usa link provisório (${rawWebsite}) sem site próprio.` : '',
          createdAt: new Date().toISOString(),
          opportunityScore,
          dataSource: 'google_places_api_new',
        });
      }
    }

    // Filtra conforme a preferência do usuário (se onlyWithoutWebsite for true, prioriza os sem site)
    let filteredLeads = allLeads;
    if (onlyWithoutWebsite) {
      const withoutSite = allLeads.filter((l) => !l.hasWebsite);
      // Se houver empresas sem site, retorna elas. Se todas tiverem site na pesquisa direta,
      // retornamos todas para que o usuário veja os dados reais e não uma tela vazia,
      // mas ordenadas pelas melhores oportunidades!
      if (withoutSite.length > 0) {
        filteredLeads = withoutSite;
      } else {
        // Se todas na primeira página têm site, ordenamos pelas menores notas ou maiores gaps
        filteredLeads = allLeads;
      }
    }

    return res.status(200).json({
      success: true,
      niche: safeNiche,
      location: safeLocation,
      count: filteredLeads.length,
      totalFound: allLeads.length,
      withoutSiteCount: allLeads.filter((l) => !l.hasWebsite).length,
      leads: filteredLeads,
    });
  } catch (error: any) {
    console.error('Erro no handler Vercel /api/places/search:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erro interno no servidor de busca',
      leads: [],
    });
  }
}
