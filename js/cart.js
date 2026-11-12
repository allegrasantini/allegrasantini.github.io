/* Carrello demo Allegra Santini — salvato nel browser (localStorage). Nessun pagamento. */
(function () {
  "use strict";
  var CHIAVE = "allegra_santini_carrello";

  function leggi() {
    try { return JSON.parse(localStorage.getItem(CHIAVE)) || []; }
    catch (e) { return []; }
  }
  function salva(voci) { localStorage.setItem(CHIAVE, JSON.stringify(voci)); }

  function aggiornaConteggio() {
    var n = leggi().reduce(function (tot, v) { return tot + v.qty; }, 0);
    document.querySelectorAll("[data-conteggio]").forEach(function (el) {
      el.textContent = n;
      el.style.display = n > 0 ? "inline-flex" : "none";
    });
  }

  window.AllegraCarrello = {
    aggiungi: function (id, nome) {
      var voci = leggi();
      var esistente = voci.find(function (v) { return v.id === id; });
      if (esistente) { esistente.qty += 1; } else { voci.push({ id: id, nome: nome, qty: 1 }); }
      salva(voci); aggiornaConteggio();
    },
    impostaQty: function (id, qty) {
      var voci = leggi().map(function (v) { if (v.id === id) { v.qty = qty; } return v; })
        .filter(function (v) { return v.qty > 0; });
      salva(voci); aggiornaConteggio();
      return voci;
    },
    rimuovi: function (id) {
      var voci = leggi().filter(function (v) { return v.id !== id; });
      salva(voci); aggiornaConteggio();
      return voci;
    },
    voci: leggi
  };

  document.addEventListener("DOMContentLoaded", function () {
    aggiornaConteggio();
    document.querySelectorAll("[data-aggiungi]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        AllegraCarrello.aggiungi(btn.getAttribute("data-aggiungi"), btn.getAttribute("data-nome"));
        var vecchio = btn.textContent;
        btn.textContent = "Aggiunta ✓ Vai al carrello";
        setTimeout(function () {
          btn.textContent = vecchio;
          window.location.href = "carrello.html";
        }, 550);
      });
    });
    /* Moduli solo-frontend: mostrano il messaggio di conferma senza inviare dati */
    document.querySelectorAll("form[data-demo]").forEach(function (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var ok = form.parentElement.querySelector(".messaggio-ok");
        if (ok) { ok.style.display = "block"; ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
        form.reset();
      });
    });
    /* Galleria scheda prodotto: le miniature cambiano la vista principale */
    var principale = document.querySelector("[data-galleria-principale]");
    if (principale) {
      document.querySelectorAll("[data-miniatura]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          principale.className = "foto " + btn.getAttribute("data-miniatura");
          document.querySelectorAll("[data-miniatura]").forEach(function (b) { b.classList.remove("sel"); });
          btn.classList.add("sel");
        });
      });
    }
  });
})();
