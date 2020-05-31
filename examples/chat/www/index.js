const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '""': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;'
}
function escapeHTML (string) {
  return String(string).replace(/[&<>"'/]/g, s => entityMap[s])
}

function addMessage (txt) {
  const messages = document.getElementById('messages');
  messages.innerHTML += txt + '<br>'
  messages.scrollTop = messages.scrollHeight
}

const scheme = location.protocol === 'https:' ? 'wss://' : 'ws://'
const client = new WebSocket(scheme + location.host + '/chat')
client.onmessage = function (event) {
  addMessage(escapeHTML(event.data))
}

function sendMessage () {
  var txt = document.getElementById('messageSend').value
  document.getElementById('messageSend').value = ''
  addMessage('<font color="#999999">' + escapeHTML(txt) + '</font>')
  client.send(txt)
  return false
}
