const Game = require("./lib/game");
const Player = require("./lib/player");
const AiGreedy = require("./lib/ai/greedy");

const SIZE_LIMIT = 6;
const settings = { size: 4, playerA: Player, playerB: AiGreedy };
const formData = {};
const sizeOptions = [2, 3, 4, 5, 6];
const playerTypelabels = ["Human", "AI: Greedy"];
const playerTypes = [Player, AiGreedy];

function closeAllModals() {
  Array.from(document.getElementsByClassName("modal")).forEach((modal) =>
    modal.classList.add("hidden")
  );
}

window.onload = function () {
  const game = new Game(document.getElementById("canvas"), settings);
  game.play();

  document.getElementById("undo").addEventListener("click", game.undoMove);
  document.getElementById("redo").addEventListener("click", game.redoMove);
  document.getElementById("reset").addEventListener("click", game.restart);

  document.getElementById("info").addEventListener("click", () => {
    document.getElementById("info-modal").classList.remove("hidden");
  });

  ["playerA", "playerB"].forEach((id) => {
    let el = document.getElementById(id);
    playerTypes.forEach((player) => {
      const b = document.createElement("button");
      b.classList.add("player");
      b.textContent = `${playerTypelabels[playerTypes.indexOf(player)]}`;
      b.addEventListener("click", (e) => {
        formData[id] = player;
        formData.changed = true;
        document.getElementById("settings-ok").classList.remove("disabled");
        Array.from(document.getElementById(id).childNodes).forEach((el, i) => {
          if (playerTypes[i] === formData[id]) {
            el.classList.add("selected");
          } else {
            el.classList.remove("selected");
          }
        });
      });
      el.appendChild(b);
    });
  });

  const gso = document.getElementById("grid-size-options");
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
            el.classList.add("selected");
          } else {
            el.classList.remove("selected");
          }
        }
      );
    });
    gso.appendChild(b);
  });

  document.getElementById("settings").addEventListener("click", () => {
    Object.assign(formData, settings);
    ["playerA", "playerB"].forEach((id) => {
      Array.from(document.getElementById(id).childNodes).forEach((el, i) => {
        if (playerTypes[i] === formData[id]) {
          el.classList.add("selected");
        } else {
          el.classList.remove("selected");
        }
      });
    });
    Array.from(document.getElementsByClassName("grid-size")).forEach(
      (el, i) => {
        if (sizeOptions[i] === formData.size) {
          el.classList.add("selected");
        } else {
          el.classList.remove("selected");
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
