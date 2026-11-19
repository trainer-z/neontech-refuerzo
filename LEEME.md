# NeónTech · Proyecto de refuerzo

## Cómo abrir el proyecto
Abre la carpeta en VS Code y usa **Live Server** (clic derecho en `index.html` → *Open with Live Server*).
Si abres los archivos con doble clic, `fetch` no puede leer la carpeta `json/` y el catálogo no carga.

## Qué archivos toca cada grupo
| Grupo | Página | Archivos |
|---|---|---|
| Grupo 1 | Catálogo de productos | `html/catalogo.html`, `js/catalogo.js` |
| Grupo 2 | Carrito de compras | `html/carrito.html`, `js/carrito.js` |
| Grupo 3 | Formulario del pedido | `html/pedido.html`, `js/pedido.js` |
| Grupo 4 | Seguimiento del pedido | `html/seguimiento.html`, `js/seguimiento.js` |
| Grupo 5 | Reseñas de clientes | `html/resenas.html`, `js/resenas.js` |
| Grupo 6 | Inventario del administrador | `html/inventario.html`, `js/inventario.js` |
| Extra A | Página de inicio | `index.html`, `js/inicio.js` |
| Extra B | Contacto y ayuda | `html/contacto.html`, `js/contacto.js` |

Cada grupo modifica **solo sus archivos** y agrega sus estilos al final de `css/style.css`, debajo del título de su grupo.
No modifiques `js/script.js` ni los archivos de `json/`: son el contrato común.

## Contrato de localStorage
| Clave | Contenido | La escribe | La lee |
|---|---|---|---|
| `neontech:carrito` | `[{ id, cantidad }]` | Catálogo, Carrito, Pedido | Todas (contador del menú) |
| `neontech:resumen` | `{ items, subtotal, descuento, envio, total }` | Carrito | Pedido |
| `neontech:pedido` | `{ numero, cliente, items, total, metodo, franja, estado }` | Pedido, Seguimiento | Seguimiento |
| `neontech:resenas` | `[{ productoId, autor, puntaje, texto }]` | Reseñas | Reseñas |
| `neontech:inventario` | copia editada de los productos | Inventario | `cargarProductos()` (todas) |

Para empezar de cero, escribe en la consola del navegador: `localStorage.clear()`.
