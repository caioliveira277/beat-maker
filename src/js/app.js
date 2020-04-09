class Drumkit {
  constructor() {
    this.pads = document.querySelectorAll("div.pad");
    this.playBtn = document.querySelector("button.play");
    this.currentKick = "../public/assets/sound/kick-classic.wav";
    this.currentSnare = "../public/assets/sound/snare-acounstic01.wav";
    this.currentHihat = "../public/assets/sound/hihat-acounstic01.wav";
    this.kickAudio = document.querySelector("audio.kick-sound");
    this.snareAudio = document.querySelector("audio.snare-sound");
    this.hithatAudio = document.querySelector("audio.hihat-sound");
    this.index = 0;
    this.bpm = 150;
    this.isPlaying = null;
    this.selects = document.querySelectorAll("select");
    this.muteBtns = document.querySelectorAll("button.mute");
    this.bpmSlider = document.querySelector("input.bpm-slider");
  }
  activePad(event) {
    event.target.classList.toggle("active");
    this.storeSequence(event);
  }
  repeat() {
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`div.b${step}`);
    activeBars.forEach((bar) => {
      if (bar.classList.contains("active")) {
        bar.style.animation = `playTrack 350ms alternate cubic-bezier(0.48, 0.88, 0.43, 0.86)`;
        if (bar.classList.contains("kick-pad")) {
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        }
        if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }
        if (bar.classList.contains("hihat-pad")) {
          this.hithatAudio.currentTime = 0;
          this.hithatAudio.play();
        }
      } else {
        bar.style.animation = `shines 500ms reverse linear forwards`;
      }
    });
    this.index++;
  }
  start() {
    const interval = (60 / this.bpm) * 1000;
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }
  updateBtn() {
    if (!this.isPlaying) {
      this.playBtn.innerText = "Stop";
      this.playBtn.classList.add("active");
    } else {
      this.playBtn.innerText = "Play";
      this.playBtn.classList.remove("active");
    }
  }
  changeSound(event) {
    const selectionName = event.target.name;
    const selectionValue = event.target.value;
    this.storeChangeSound(event);
    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue;
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue;
        break;
      case "hihat-select":
        this.hithatAudio.src = selectionValue;
        break;
    }
  }
  mute(event) {
    const muteIndex = event.target.getAttribute("data-track");
    let isMuted;

    if (event.target.classList.toggle("active")) {
      event.target.firstElementChild.innerText = "volume_off";
      isMuted = 0;
    } else {
      event.target.firstElementChild.innerText = "volume_up";
      isMuted = 1;
    }
    this.storeMute(event);
    switch (muteIndex) {
      case "0":
        this.kickAudio.volume = isMuted;
        break;
      case "1":
        this.snareAudio.volume = isMuted;
        break;
      case "2":
        this.hithatAudio.volume = isMuted;
        break;
    }
  }
  changeBpm(event) {
    const bpmText = document.querySelector(".bpm-value");
    this.bpm = event.target.value;
    localStorage.setItem("bpm", event.target.value);
    bpmText.innerText = event.target.value;
  }
  updateInterval() {
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    const playBtn = document.querySelector("button.play");
    if (playBtn.classList.contains("active")) {
      this.start();
    }
  }
  storeSequence(event) {
    const padIndex = event.target.parentNode.getAttribute("data-index");
    const padPosition = [...event.target.parentNode.children].indexOf(
      event.target
    );
    const getSequence =
      JSON.parse(localStorage.getItem(`sequence${padIndex}`)) || [];
    if (getSequence.indexOf(padPosition) != -1) {
      getSequence.splice(getSequence.indexOf(padPosition), 1);
    } else {
      getSequence.push(padPosition);
    }
    localStorage.setItem(`sequence${padIndex}`, JSON.stringify(getSequence));
  }
  storeChangeSound(event) {
    localStorage.setItem(event.target.name, event.target.value);
  }
  storeMute(event) {
    let isMuted;
    if (event.target.classList.contains("active")) {
      isMuted = 1;
    } else {
      isMuted = 0;
    }
    localStorage.setItem(
      "mute" + event.target.getAttribute("data-track"),
      isMuted
    );
  }
}

const drumKit = new Drumkit();

/* Events */
drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", (event) => {
    drumKit.activePad(event);
  });
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});
drumKit.playBtn.addEventListener("click", () => {
  drumKit.updateBtn();
  drumKit.start();
});
drumKit.selects.forEach((select) => {
  select.addEventListener("change", function () {
    drumKit.changeSound(event);
  });
});
drumKit.muteBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    drumKit.mute(event);
  });
});
drumKit.bpmSlider.addEventListener("input", function (event) {
  drumKit.changeBpm(event);
});
drumKit.bpmSlider.addEventListener("change", function (event) {
  drumKit.updateInterval(event);
});

class Dropdown {
  constructor() {
    this.helpButton = document.querySelector("span.help-info");
  }
  activeDropDown() {
    this.nextElementSibling.classList.toggle("active");
  }
}

const dropdown = new Dropdown();

/* Events */
dropdown.helpButton.addEventListener("mouseenter", dropdown.activeDropDown);
dropdown.helpButton.addEventListener("mouseleave", dropdown.activeDropDown);

class ChangeTheme {
  constructor() {
    this.themeButton = document.querySelector("button.btn-theme");
  }
  active() {
    if (this.themeButton.classList.toggle("active")) {
      this.themeButton.firstElementChild.innerText = "brightness_7";
      this.setColor();
    } else {
      this.themeButton.firstElementChild.innerText = "brightness_5";
      this.setColor();
    }
  }
  setColor() {
    if (this.themeButton.classList.contains("active")) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("darkTheme", 1);
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("darkTheme", 0);
    }
  }
}

const changeTheme = new ChangeTheme();

/* Events */
changeTheme.themeButton.addEventListener("click", () => {
  changeTheme.active();
});

class LastState extends Drumkit {
  constructor() {
    super();
    this.darkTheme = parseInt(localStorage.getItem("darkTheme"));
    this.getBpm = localStorage.getItem("bpm");
    this.mutes = [
      parseInt(localStorage.getItem("mute0")),
      parseInt(localStorage.getItem("mute1")),
      parseInt(localStorage.getItem("mute2")),
    ];
    this.selecteds = {
      "snare-select": localStorage.getItem("snare-select"),
      "hihat-select": localStorage.getItem("hihat-select"),
      "kick-select": localStorage.getItem("kick-select"),
    };
    this.sequences = () => {
      return {
        0: JSON.parse(localStorage.getItem("sequence0")),
        1: JSON.parse(localStorage.getItem("sequence1")),
        2: JSON.parse(localStorage.getItem("sequence2")),
      };
    };
    this.padBox = document.querySelectorAll("div.pad-box");
    this.btnReset = document.querySelector("button.btn-reset");
  }
  setState() {
    if (this.darkTheme)
      changeTheme.themeButton.dispatchEvent(new Event("click"));

    this.muteBtns.forEach((_btn, key) => {
      if (this.mutes[key]) this.muteBtns[key].dispatchEvent(new Event("click"));
    });

    if (this.getBpm) {
      this.bpmSlider.value = this.getBpm;
      this.bpmSlider.dispatchEvent(new Event("input"));
    }

    this.selects.forEach((item) => {
      if (this.selecteds[item.name]) {
        item.value = this.selecteds[item.name];
        item.dispatchEvent(new Event("change"));
      }
    });

    const getSequences = this.sequences(); 
    for (let key in getSequences) {
      let pads = this.padBox[key].children;
      for (let index in pads) {
        let padPosition = [...pads].indexOf(pads[index]);
        if (getSequences[key]) {
          if (getSequences[key].indexOf(padPosition) != -1) {
            pads[index].classList.add("active");
          }
        }
      }
    }
  }
  resetPadState() {
    const getSequences = this.sequences(); 
    for (let key in getSequences) {
      let pads = this.padBox[key].children;
      for (let index in pads) {
        let padPosition = [...pads].indexOf(pads[index]);
        if (getSequences[key]) {
          if (getSequences[key].indexOf(padPosition) != -1) {
            pads[index].classList.remove("active");
          }
        }
      }
    }
    localStorage.setItem("sequence0", "[]");
    localStorage.setItem("sequence1", "[]");
    localStorage.setItem("sequence2", "[]");
  }
}
const lastState = new LastState();

/* Events */
document.addEventListener("DOMContentLoaded", () => {
  lastState.setState();
});
lastState.btnReset.addEventListener("click", (event) => {
  lastState.resetPadState(event);
  event.target.firstChild.style.transform = "rotate(-360deg)";
  event.target.firstChild.addEventListener("transitionend", event => {
    event.target.style.transform = "rotate(0deg)";
  })
});
