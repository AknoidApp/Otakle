# Otakle · preparación para nueva solicitud de AdSense

## Meta
Llegar al 14 de junio con una web que se vea claramente como un sitio público con contenido útil, navegación real, páginas informativas sólidas y señales editoriales suficientes para reducir el riesgo de otro rechazo por "Contenido de poco valor".

## Ya hecho
- Se ampliaron páginas clave: `about`, `how-to-play`, `strategy`.
- Se añadieron 5 páginas editoriales nuevas:
  - `/como-leer-pistas-otakle`
  - `/guia-naruto-otakle`
  - `/guia-one-piece-otakle`
  - `/guia-dragon-ball-otakle`
  - `/animes-faciles-para-empezar-en-otakle`
- Se reforzaron `home`, `faq`, `animes`, `contact` y el footer global.
- Se dejó `vercel.json` y el prerender adaptado para rutas tipo `/ruta/index.html`.
- Lint y build local pasan.

## Bloqueador actual
Producción todavía no refleja el último trabajo publicado en GitHub. `www.otakle.app` sigue sirviendo una versión vieja y rutas nuevas como `/como-leer-pistas-otakle` devuelven 404. Esto apunta a un problema de despliegue/configuración en Vercel más que a contenido.

## Prioridades antes del 14
1. **Resolver despliegue en producción**
   - Confirmar que Vercel esté desplegando el repo y la rama correctos.
   - Confirmar que use `npm run build` como build command.
   - Verificar que publique `dist` y no un output viejo.

2. **Subir masa editorial útil**
   - Crear más guías públicas si hace falta:
     - guía de Bleach
     - guía de My Hero Academia
     - guía de Kimetsu no Yaiba
     - artículo sobre cómo usar el año de debut
     - artículo sobre errores comunes al jugar Otakle

3. **Profundizar señales de sitio real**
   - Página hub de guías/editorial.
   - Mejor interlinking entre FAQ, animes, personajes y guías.
   - Revisar que privacidad, términos y contacto estén visibles desde todo el sitio.

4. **Checklist previo a nueva solicitud**
   - Abrir homepage en incógnito.
   - Probar rutas clave.
   - Verificar sitemap.
   - Revisar ausencia de errores visibles.
   - Enviar nueva revisión de AdSense.

## Rutas clave a validar
- `/`
- `/about`
- `/how-to-play`
- `/strategy`
- `/faq`
- `/animes`
- `/personajes`
- `/contact`
- `/privacy`
- `/terms`
- `/como-leer-pistas-otakle`
- `/guia-naruto-otakle`
- `/guia-one-piece-otakle`
- `/guia-dragon-ball-otakle`
- `/animes-faciles-para-empezar-en-otakle`
