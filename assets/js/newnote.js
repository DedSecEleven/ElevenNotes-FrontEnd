const inputTile = document.querySelector(".inputTitle");
const inputP = document.querySelector(".inputP");

inputTile.addEventListener("input", () => {
    inputTile.style.height = "auto";
    inputTile.style.height = inputTile.scrollHeight + "px";
})

inputP.addEventListener("input", () => {
    inputP.style.height = "auto";
    inputP.style.height = inputP.scrollHeight + "px";
})