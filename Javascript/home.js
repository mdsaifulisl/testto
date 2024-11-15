// product scroll 
const scroll = document.querySelector('.productscroll');


scroll.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scroll.scrollLeft += evt.deltaY;
});

function updateTime() {
    const now = new Date();

    // Extract parts of the date and time
    const day = now.getDate();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    hours = hours % 12 || 12; 

    // Update HTML
    document.querySelector('.date').textContent = `${day} :`;
    document.querySelector('.hours').textContent = `${hours} :`;
    document.querySelector('.minuss').textContent = `${minutes.toString().padStart(2, '0')} :`;
    document.querySelector('.second').textContent = `${seconds.toString().padStart(2, '0')} :`;
}
setInterval(updateTime, 1000);
updateTime();