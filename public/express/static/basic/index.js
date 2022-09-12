let socket = new ReconnectingWebSocket("ws://127.0.0.1:17881/ws");

socket.onopen = () => console.log("Successfully Connected");

socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};

socket.onerror = error => console.log("Socket Error: ", error);

let ranked_score = document.getElementById('ranked_score');
let ranked_score_gained = document.getElementById('ranked_score_gained');
let clears_gained = document.getElementById('clears_gained');
let total_ss_gained = document.getElementById('total_ss_gained');
let total_s_gained = document.getElementById('total_s_gained');
let total_a_gained = document.getElementById('total_a_gained');

socket.onmessage = event => {
  try {
    const data = JSON.parse(event.data)
    console.log(data)
    ranked_score.innerText = data.ranked_score.current ?? ""
    ranked_score_gained.innerText = data.ranked_score.gained ?? ""
    clears_gained.innerText = data.clears.gained ?? ""
    total_ss_gained.innerText= data.total_ss.gained ?? ""
    total_s_gained.innerText = data.total_s.gained ?? ""
    total_a_gained.innerText = data.a_count.gained ?? ""
  } catch (err) { console.log(err); };
};