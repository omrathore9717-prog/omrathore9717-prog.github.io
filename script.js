/* SCROLL ANIMATION */

const revealElements = document.querySelectorAll(
'.card, .testimonial-card, .stat-box'
);

window.addEventListener('scroll', reveal);

function reveal(){

  revealElements.forEach(element => {

    const windowHeight = window.innerHeight;

    const revealTop =
    element.getBoundingClientRect().top;

    const revealPoint = 100;

    if(revealTop < windowHeight - revealPoint){

      element.classList.add('active');

    }

  });

}

reveal();

/* COUNTER ANIMATION */

const counters =
document.querySelectorAll('.stat-box h2');

counters.forEach(counter => {

  const updateCounter = () => {

    const target =
    +counter.innerText.replace('+','');

    const current =
    +counter.getAttribute('data-count') || 0;

    const increment = target / 100;

    if(current < target){

      const value =
      Math.ceil(current + increment);

      counter.innerText = value + "+";

      counter.setAttribute('data-count', value);

      setTimeout(updateCounter, 30);

    }else{

      counter.innerText = target + "+";

    }

  };

  updateCounter();

});

/* NAVBAR SHADOW */

window.addEventListener('scroll', () => {

  const header =
  document.querySelector('header');

  header.classList.toggle(
    'sticky',
    window.scrollY > 50
  );

});