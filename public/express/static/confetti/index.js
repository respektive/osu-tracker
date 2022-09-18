let socket = new ReconnectingWebSocket("ws://127.0.0.1:17881/ws");

socket.onopen = () => console.log("Successfully Connected");

socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};

socket.onerror = error => console.log("Socket Error: ", error);

let oldRankedScore;

socket.onmessage = event => {
  try {
    const data = JSON.parse(event.data)
    const rankedScore = parseInt(data.ranked_score.current.replace(/,/g, ''))
    const score_diff = rankedScore - oldRankedScore
    let duration, particles, applause

    if (score_diff >= 1_000_000_000) {
      duration = 45 * 1000
      particles = 300
      applause = new Audio('applause5.mp3')
    } else if (score_diff >= 500_000_000) {
      duration = 18 * 1000
      particles = 200
      applause = new Audio('applause4.mp3')
    } else if (score_diff >= 100_000_000) {
      duration = 16 * 1000
      particles = 150
      applause = new Audio('applause3.mp3')
    } else if (score_diff >= 50_000_000) {
      duration = 7 * 1000
      particles = 100
      applause = new Audio('applause2.mp3')
    } else {
      duration = 7 * 1000
      particles = 50
      applause = new Audio('applause.mp3')
    }

    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    if (!oldRankedScore || oldRankedScore >= rankedScore) {
      console.log(oldRankedScore, rankedScore)
      oldRankedScore = rankedScore
      return
    }
    oldRankedScore = rankedScore
    applause.volume = 0.5;
    applause.play();

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = particles * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 } }));

    }, 500);

    var interval2 = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval2);
      }

      confetti({
        particleCount: particles/10,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: particles/10,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 150);

  } catch (err) { console.log(err); };
};