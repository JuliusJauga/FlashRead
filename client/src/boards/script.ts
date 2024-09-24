const mainDiv = document.getElementById("MainBoard_selection") as HTMLDivElement;
const mode1 = document.getElementById("MainBoard_mode1") as HTMLDivElement;

const mode1Button = document.getElementById("MainBoard_mode1Button") as HTMLButtonElement;

mode1Button.addEventListener("click", () => {
    mode1.style.display = "flex";
    mainDiv.style.display = "none";
});