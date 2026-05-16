// MARKET CHART

const marketChart = document.getElementById('marketChart');

new Chart(marketChart, {

  type: 'line',

  data: {

    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],

    datasets: [{

      label: 'Market Growth',

      data: [10, 25, 18, 40, 35, 60],

      borderWidth: 3,

      tension: 0.4,

      fill: true

    }]

  },

  options: {

    responsive: true,

    plugins: {

      legend: {

        labels: {

          color: 'white'

        }

      }

    },

    scales: {

      x: {

        ticks: {

          color: 'white'

        },

        grid: {

          color: 'rgba(255,255,255,0.08)'

        }

      },

      y: {

        ticks: {

          color: 'white'

        },

        grid: {

          color: 'rgba(255,255,255,0.08)'

        }

      }

    }

  }

});




// SIP CHART

const sipChart = document.getElementById('sipChart');

new Chart(sipChart, {

  type: 'doughnut',

  data: {

    labels: ['Invested Amount', 'Estimated Returns'],

    datasets: [{

      data: [600000, 561695],

      borderWidth: 1

    }]

  },

  options: {

    responsive: true,

    plugins: {

      legend: {

        labels: {

          color: 'white'

        }

      }

    }

  }

});




// SIP CALCULATOR FUNCTION

function calculateSIP(){

  let monthly = parseFloat(
    document.getElementById('monthly').value
  );

  let annualRate = parseFloat(
    document.getElementById('rate').value
  );

  let years = parseFloat(
    document.getElementById('years').value
  );


  let monthlyRate = annualRate / 12 / 100;

  let months = years * 12;


  let futureValue = monthly *

  (
    (
      (Math.pow(1 + monthlyRate, months)) - 1
    )
    / monthlyRate
  )

  * (1 + monthlyRate);


  document.getElementById('futureValue').innerText =

  '₹' +

  Math.round(futureValue).toLocaleString();

}




// AUTO CALCULATE ON LOAD

calculateSIP();




// NAVBAR SCROLL EFFECT

window.addEventListener('scroll', () => {

  const navbar = document.querySelector('.navbar');

  if(window.scrollY > 50){

    navbar.style.background =
    'rgba(5,8,22,0.95)';

  }

  else{

    navbar.style.background =
    'rgba(255,255,255,0.05)';

  }

});




// SMOOTH ANIMATION

const cards = document.querySelectorAll(
  '.service-card, .testimonial, .stat-box'
);

window.addEventListener('scroll', () => {

  cards.forEach(card => {

    const cardTop = card.getBoundingClientRect().top;

    if(cardTop < window.innerHeight - 50){

      card.style.transform = 'translateY(0)';
      card.style.opacity = '1';

    }

  });

});




// INITIAL CARD STYLE

cards.forEach(card => {

  card.style.transform = 'translateY(40px)';
  card.style.opacity = '0';
  card.style.transition = '0.6s ease';

});