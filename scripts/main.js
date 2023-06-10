function onLoad(){
  addLanguageListeners();
  //window.addEventListener('scroll', handleScroll);
  //window.addEventListener('resize', handleScroll);
  //window.addEventListener('load', handleScroll);
}

function addLanguageListeners(){
  const languages = document.querySelectorAll(".language_wrapper");

  for(let i = 0; i < languages.length; i++){
      languages[i].addEventListener('click', (event) => {
          if (languages[i].classList.contains("expanded_lang")){
              languages[i].classList.remove("expanded_lang")
          }
          else{
              languages[i].classList.add("expanded_lang")
          }
      });
      
  }
}

function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function handleScroll() {
  var sections = document.querySelectorAll('.section_container');

  sections.forEach(function(section) {
    if (isElementInViewport(section)) {
      section.classList.add('fade-in');
    }
  });
}


