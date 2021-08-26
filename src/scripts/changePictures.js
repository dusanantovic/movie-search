const wallpaper1El = document.getElementById("wallpaper-1");
const wallpaper2El = document.getElementById("wallpaper-2");

const positions = [
    "left top", "left", "left bottom",
    "center top", "center", "center bottom",
    "right top", "right", "right bottom"
];

setInterval(() => {
    wallpaper1El.style.backgroundPosition = positions[Math.floor(Math.random() * positions.length)];
    wallpaper2El.style.backgroundPosition = positions[Math.floor(Math.random() * positions.length)];
}, 4000);