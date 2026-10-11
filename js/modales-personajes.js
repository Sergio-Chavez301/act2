/* ============================================================
   MODALES DE PERSONAJES - Los Diarios de una Boticaria
   Archivo independiente para no afectar app.js de los compañeros.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Mapeo: id de la tarjeta -> id del modal que debe abrirse
  const mapaTarjetas = {
    "tarjeta-maomao": "modalMaomao",
    "tarjeta-jinshi": "modalJinshi",
    "tarjeta-gaoshun": "modalGaoshun",
  };

  // 1) Abrir el modal correspondiente al hacer clic en cada tarjeta
  Object.keys(mapaTarjetas).forEach(function (idTarjeta) {
    const tarjeta = document.getElementById(idTarjeta);
    const modal = document.getElementById(mapaTarjetas[idTarjeta]);

    if (tarjeta && modal) {
      tarjeta.addEventListener("click", function () {
        modal.classList.add("activo");
      });

      // Accesibilidad: permitir abrir con Enter o Espacio
      tarjeta.setAttribute("tabindex", "0");
      tarjeta.setAttribute("role", "button");
      tarjeta.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          modal.classList.add("activo");
        }
      });
    }
  });

  // 2) Cerrar modales con cualquier botón que tenga data-cerrar
  document.querySelectorAll("[data-cerrar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const idModal = boton.getAttribute("data-cerrar");
      const modal = document.getElementById(idModal);
      if (modal) {
        modal.classList.remove("activo");
      }
    });
  });

  // 3) Cerrar al hacer clic fuera del contenido (sobre el fondo oscuro)
  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.remove("activo");
      }
    });
  });

  // 4) Cerrar con la tecla Escape (solo modales de personajes)
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      ["modalMaomao", "modalJinshi", "modalGaoshun"].forEach(function (id) {
        const modal = document.getElementById(id);
        if (modal) {
          modal.classList.remove("activo");
        }
      });
    }
  });
});
