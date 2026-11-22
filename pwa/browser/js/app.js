const mapaTarjetas = {
    "tarjeta-maomao": "modalMaomao",
    "tarjeta-jinshi": "modalJinshi",
    "tarjeta-gaoshun": "modalGaoshun",
};

const abrirModal = (modal) => modal.classList.add("activo");
const cerrarModal = (modal) => modal.classList.remove("activo");

const btnContacto = document.getElementById("btnContacto");
const modalContacto = document.getElementById("modalContacto");

btnContacto.addEventListener("click", function () {
    abrirModal(modalContacto);
});

document.getElementById("cerrarModal").addEventListener("click", function () {
    cerrarModal(modalContacto);
});

document.getElementById("aceptarModal").addEventListener("click", function () {
    cerrarModal(modalContacto);
});

Object.entries(mapaTarjetas).forEach(function ([idTarjeta, idModal]) {
    const tarjeta = document.getElementById(idTarjeta);
    const modal = document.getElementById(idModal);

    if (!tarjeta || !modal) return;

    tarjeta.setAttribute("tabindex", "0");
    tarjeta.setAttribute("role", "button");
    tarjeta.addEventListener("click", function () {
        abrirModal(modal);
    });
    tarjeta.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            abrirModal(modal);
        }
    });
});

document.querySelectorAll("[data-cerrar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
        const modal = document.getElementById(boton.getAttribute("data-cerrar"));
        if (modal) cerrarModal(modal);
    });
});

document.querySelectorAll(".modal").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
        if (event.target === modal) cerrarModal(modal);
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal.activo").forEach(cerrarModal);
    }
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js")
            .then(function (registro) {
                console.log("SW: Registro exitoso", registro.scope);
            })
            .catch(function (error) {
                console.error("SW: Registro fallido", error);
            });
    });
} else {
    console.log("SW: Service Worker no soportado");
}

const btnInstalar = document.getElementById("btnInstalar");
const estadoInstalacion = document.getElementById("estadoInstalacion");
let eventoInstalacion = null;

window.addEventListener("beforeinstallprompt", function (evento) {
    evento.preventDefault();
    eventoInstalacion = evento;

    if (eventoInstalacion && btnInstalar) {
        btnInstalar.hidden = false;
    }
});

if (btnInstalar) {
    btnInstalar.addEventListener("click", async function () {
        if (!eventoInstalacion) {
            if (estadoInstalacion) {
                estadoInstalacion.textContent =
                    "La instalación se gestiona desde las opciones del navegador.";
            }
            return;
        }

        eventoInstalacion.prompt();
        const resultado = await eventoInstalacion.userChoice;

        if (estadoInstalacion) {
            estadoInstalacion.textContent = resultado.outcome === "accepted"
                ? "Instalación aceptada."
                : "Instalación cancelada.";
        }
        btnInstalar.hidden = true;
        eventoInstalacion = null;
    });
}

window.addEventListener("appinstalled", function () {
    if (estadoInstalacion) {
        estadoInstalacion.textContent = "La aplicación se instaló correctamente.";
    }
    if (btnInstalar) {
        btnInstalar.hidden = true;
    }
    eventoInstalacion = null;
});

if (window.matchMedia("(display-mode: standalone)").matches && btnInstalar) {
    btnInstalar.hidden = true;
}