let socket = new ReconnectingWebSocket("ws://127.0.0.1:17881/ws");

socket.onopen = () => console.log("Successfully Connected");

socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};

socket.onerror = error => console.log("Socket Error: ", error);

let oldBillion;

socket.onmessage = event => {
  try {
    const data = JSON.parse(event.data)
    const rankedScore = parseInt(data.ranked_score.current.replace(/,/g, ''))
    const billion = Math.floor(rankedScore / 1_000_000_000)
    const duration = 7 * 1000
    const particles = 150
    const applause = new Audio('applause.mp3')

    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    console.log(oldBillion, billion)

    if (!oldBillion || oldBillion >= billion) {
      oldBillion = billion
      return
    }

    oldBillion = billion
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