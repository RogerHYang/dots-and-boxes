const Game = require("./lib/game");

const SIZE_LIMIT = 6;
const settings = { size: 4, playerA: "Human", playerB: "Human" };
const formData = {};
const sizeOptions = [2, 3, 4, 5, 6];
const playerTypeOptions = ["Human", "AI"];

let game;

function startGame() {
  game = new Game(document.getElementById("canvas"), settings);
  game.play();
}

function closeAllModals() {
  Array.from(document.getElementsByClassName("modal")).forEach((modal) =>
    modal.classList.add("hidden")
  );
}

window.onload = function () {
  startGame();

  document.getElementById("undo").addEventListener("click", game.undoMove);
  document.getElementById("redo").addEventListener("click", game.redoMove);
  document.getElementById("reset").addEventListener("click", game.restart);

  document.getElementById("info").addEventListener("click", () => {
    document.getElementById("info-modal").classList.remove("hidden");
  });

  const gso = document.getElementById("grid-size-options");
  gso.innerHTML = "";
  sizeOptions.forEach((size) => {
    const b = document.createElement("button");
    b.classList.add("grid-size");
    b.textContent = `${size} x ${size}`;
    b.addEventListener("click", (e) => {
      formData.size = size;
      formData.changed = true;
      document.getElementById("settings-ok").classList.remove("disabled");
      Array.from(document.getElementsByClassName("grid-size")).forEach(
        (el, i) => {
          if (sizeOptions[i] === formData.size) {
            el.classList.add("current-size");
          } else {
            el.classList.remove("current-size");
          }
        }
      );
    });
    gso.appendChild(b);
  });

  document.getElementById("settings").addEventListener("click", () => {
    Object.assign(formData, settings);
    Array.from(document.getElementsByClassName("grid-size")).forEach(
      (el, i) => {
        if (sizeOptions[i] === formData.size) {
          el.classList.add("current-size");
        } else {
          el.classList.remove("current-size");
        }
      }
    );
    document.getElementById("settings-modal").classList.remove("hidden");
    document.getElementById("settings-ok").classList.add("disabled");
  });

  document.getElementById("settings-ok").addEventListener("click", (e) => {
    if (!e.target.classList.contains("disabled")) {
      let changed = false;
      Object.keys(formData).forEach((k) => {
        if (settings.hasOwnProperty(k)) {
          if (settings[k] !== formData[k]) {
            changed = true;
            settings[k] = formData[k];
          }
        }
      });
      closeAllModals();
      if (changed) {
        game.restart();
      }
    }
  });

  Array.from(document.getElementsByClassName("close-modal")).forEach((el) => {
    el.addEventListener("click", closeAllModals);
  });

  Array.from(document.getElementsByClassName("modal")).forEach((el) => {
    el.addEventListener("click", closeAllModals);
  });

  Array.from(document.getElementsByClassName("modal-content")).forEach((el) => {
    el.addEventListener("click", (e) => e.stopPropagation());
  });
};
