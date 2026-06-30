import { Injectable } from '@nestjs/common';

@Injectable()
export class NoticiasEducacionService {
  async obtener(q?: string) {
    const query =
      q?.trim() ||
      'educacion escolar Peru colegios docentes estudiantes calendario academico lectura evaluaciones';

    const urls = [
      this.buildGoogleNewsUrl(query),
      this.buildGoogleNewsUrl('colegios Peru estudiantes docentes aprendizaje calendario escolar'),
      this.buildGoogleNewsUrl('educacion Peru familias escuela evaluaciones lectura'),
    ];

    const noticias: any[] = [];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
        });

        if (!response.ok) continue;

        const xml = await response.text();
        noticias.push(...this.parseGoogleNews(xml));
      } catch (error) {
        console.error('Error leyendo noticias educativas', error);
      }
    }

    const resultado = this.uniqueByTitle(noticias)
      .filter((item) => this.esEducativa(`${item.title} ${item.description}`))
      .slice(0, 12)
      .map((item, index) => ({
        ...item,
        image: item.image || this.getFallbackImage(item.title, index),
      }));

    return {
      ok: true,
      actualizado: new Date().toISOString(),
      fuente: 'Radar educativo en vivo',
      total: resultado.length,
      noticias: resultado.length > 0 ? resultado : this.fallbackNoticias(),
    };
  }

  private buildGoogleNewsUrl(query: string) {
    return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=es-419&gl=PE&ceid=PE:es-419`;
  }

  private parseGoogleNews(xml: string) {
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const raw = match[1];

      const originalTitle = this.clean(this.getTag(raw, 'title'));
      const parsedTitle = this.cleanTitle(originalTitle);

      const descriptionRaw = this.getTag(raw, 'description');
      const imageFromDescription = this.extractImage(descriptionRaw);
      const imageFromMedia =
        this.extractMedia(raw, 'media:content') ||
        this.extractMedia(raw, 'media:thumbnail');

      items.push({
        title: parsedTitle.title,
        source:
          this.clean(this.getTag(raw, 'source')) ||
          parsedTitle.source ||
          'Fuente educativa',
        link: this.clean(this.getTag(raw, 'link')),
        pubDate: this.clean(this.getTag(raw, 'pubDate')),
        description: this.clean(this.stripHtml(descriptionRaw)),
        image: imageFromMedia || imageFromDescription || '',
      });
    }

    return items;
  }

  private getTag(block: string, tag: string) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = block.match(regex);
    return match ? match[1] : '';
  }

  private extractMedia(block: string, tag: string) {
    const regex = new RegExp(`<${tag}[^>]*(url|src)=["']([^"']+)["'][^>]*>`, 'i');
    const match = block.match(regex);
    return match ? this.clean(match[2]) : '';
  }

  private extractImage(html: string) {
    const match = String(html || '').match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? this.clean(match[1]) : '';
  }

  private cleanTitle(title: string) {
    const parts = title.split(' - ');

    if (parts.length > 1) {
      return {
        title: parts.slice(0, -1).join(' - '),
        source: parts[parts.length - 1],
      };
    }

    return {
      title,
      source: '',
    };
  }

  private clean(value: string) {
    return this.decodeHtml(
      String(value || '')
        .replace(/<!\[CDATA\[/g, '')
        .replace(/\]\]>/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    );
  }

  private stripHtml(value: string) {
    return String(value || '').replace(/<[^>]*>/g, ' ');
  }

  private decodeHtml(value: string) {
    return String(value || '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  }

  private uniqueByTitle(items: any[]) {
    const map = new Map();

    for (const item of items) {
      const key = String(item.title || '').toLowerCase().trim();
      if (!key || map.has(key)) continue;
      map.set(key, item);
    }

    return Array.from(map.values());
  }

  private esEducativa(text: string) {
    const t = String(text || '').toLowerCase();

    const keywords = [
      'educacion',
      'educación',
      'colegio',
      'colegios',
      'escuela',
      'escuelas',
      'estudiante',
      'estudiantes',
      'docente',
      'docentes',
      'minedu',
      'aprendizaje',
      'clases',
      'escolar',
      'matricula',
      'matrícula',
      'lectura',
      'evaluacion',
      'evaluación',
      'familias',
      'aula',
    ];

    return keywords.some((word) => t.includes(word));
  }

  private getFallbackImage(title: string, index: number) {
    const images = [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    ];

    return images[index % images.length];
  }

  private fallbackNoticias() {
    return [
      {
        title: 'Estrategias para fortalecer el aprendizaje escolar',
        source: 'Radar Educativo',
        link: 'https://news.google.com/search?q=estrategias%20aprendizaje%20escolar%20colegios&hl=es-419&gl=PE&ceid=PE:es-419',
        pubDate: new Date().toISOString(),
        description:
          'Los colegios combinan metodologías activas, comunicación con familias y recursos digitales para mejorar el seguimiento académico.',
        image:
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Comunicación escolar y familias: claves para una gestión ordenada',
        source: 'Gestión Escolar',
        link: 'https://news.google.com/search?q=comunicacion%20colegios%20familias%20educacion&hl=es-419&gl=PE&ceid=PE:es-419',
        pubDate: new Date().toISOString(),
        description:
          'Los avisos digitales, recordatorios y comunicados ayudan a mantener informada a toda la comunidad educativa.',
        image:
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      },
    ];
  }
}
