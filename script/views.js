//Funktion för att byta vyer
function switchView(fromView, toView) {
    document.querySelector(`.${fromView}`).classList.remove('active');
    document.querySelector(`.${toView}`).classList.add('active');
}
export { switchView };