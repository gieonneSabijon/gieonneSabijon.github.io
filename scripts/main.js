function onLoad(){
    toggleSite();
    toggleCollapse();
    
    const targetDiv = document.querySelector('.Socials');
    observer.observe(targetDiv);
}

function projectCycle(direction) {
    const carousel = document.querySelector('.carousel');
    const projectWrappers = Array.from(carousel.querySelectorAll('.projectWrapper'));

    if (direction === 'right') {
        // Rotate the elements to the left.
        const firstElement = projectWrappers.shift();
        projectWrappers.push(firstElement);
    } else if (direction === 'left') {
        // Rotate the elements to the right.
        const lastElement = projectWrappers.pop();
        projectWrappers.unshift(lastElement);
    }

    // Clear and reassign classes.
    projectWrappers.forEach((element, index) => {
        element.classList.remove('leftProject', 'focusedProject', 'rightProject', 'hiddenProject');
        if (index === 0) {
        element.classList.add('leftProject');
        } else if (index === 1) {
        element.classList.add('focusedProject');
        } else if (index === 2) {
        element.classList.add('rightProject');
        } else {
        element.classList.add('hiddenProject');
        }
    });

    // Reposition elements within the "carousel" container.
    while (carousel.firstChild) {
        carousel.removeChild(carousel.firstChild);
    }
    projectWrappers.forEach((element) => {
        carousel.appendChild(element);
    });

}



const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // The target div is in view.
            // You can trigger an event or execute a function here.
            const targetDiv = document.querySelector('.Socials');
            const titleDiv = document.querySelector('.socialsTitle');
            titleDiv.style.animation = "slideRight 1s forwards";
            observer.unobserve(targetDiv);
        }
    });
});

function toggleSite(){
    var page = document.querySelector('.pageContainer');
    var powerbuttonPage = document.querySelector(".powerButtonContainer");
    if (page){
        if (page.style.display != "none"){
            page.style.display = "none";
            powerbuttonPage.style.display = "flex";
        }
        else {
            encryptText();
            page.style.display = "flex";
            powerbuttonPage.style.display = "none";
        }
    }
}

function toggleCollapse(){
    var linkList = document.querySelector('.linkList');
    var collapseIcon = document.querySelector('.collapseIcon');
    var expandIcon = document.querySelector('.expandIcon');
    if (linkList){
        if (linkList.classList.contains('collapsed')){
            linkList.classList.remove('collapsed')
            linkList.style.display = "flex";
            collapseIcon.style.display = "flex";
            expandIcon.style.display = "none";
        }
        else {
            linkList.classList.add('collapsed')
            linkList.style.display = "none";
            collapseIcon.style.display = "none";
            expandIcon.style.display = "flex";
            
        }
    }
}

function encryptText() {
    var aboutMeParagraph = document.querySelector('.aboutMeParagraph');
    if (aboutMeParagraph) {
        const originalText = aboutMeParagraph.textContent;
        const encryptedText = stringToRandomChars(originalText, originalText.length);
        aboutMeParagraph.textContent = encryptedText;

        setTimeout(function () {
            decryptText(originalText, aboutMeParagraph, 0);
        }); // Delay decryption for 1 second (adjust as needed)
    }
}

function decryptText(originalText, element, index) {
    if (index < originalText.length) {
        const currentText = element.textContent;
        element.textContent = setCharAt(element.textContent, index, originalText.charAt(index));
        index++;
        setTimeout(function () {
            decryptText(originalText, element, index);
        }, 10); // Delay decryption for 100 milliseconds (adjust as needed)
    }
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function randomChar() {
    // Generate a random number between 32 (ASCII space) and 126 (ASCII ~)
    const randomCharCode = Math.floor(Math.random() * (126 - 32 + 1)) + 32;
    // Convert the random ASCII code to a character
    return String.fromCharCode(randomCharCode);
}

function stringToRandomChars(inputString, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomChar();
    }
    return result;
}
